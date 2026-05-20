import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { getLoginUserInfo, userLogout } from "@/api/user.ts";
import type { Api } from "@/types/api/typings";
import { BusinessCode } from "@/constants";

/**
 * 前端鉴权状态机：
 * - unknown:       尚未判定（初次进入或缓存过期后）
 * - checking:      正在向后端校验 Session
 * - authenticated: 已登录，持有用户信息
 * - guest:         未登录
 */
export type AuthStatus = "unknown" | "checking" | "authenticated" | "guest";

interface BootstrapOptions {
    /** 强制向后端重新校验，忽略本地缓存 */
    force?: boolean;
    /** 严格模式，受保护路由进入前使用 */
    strict?: boolean;
}

// 本地缓存的 TTL（过期后回到 unknown 状态，促使下一次访问触发真实鉴权请求）
const AUTH_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// 严格模式下两次后端校验的最小间隔，防止受保护路由被高频重验
const AUTH_REVALIDATE_INTERVAL_MS = 60 * 1000;

// Session 心跳间隔（20 分钟），防止用户长时间停留但无请求导致 Session 静默过期
const SESSION_HEARTBEAT_INTERVAL_MS = 20 * 60 * 1000;

/**
 * 认证状态管理.
 *
 * 安全基线：后端 Spring Session 是鉴权唯一真相源，前端状态仅用于界面驱动和体验优化
 */
export const useAuthStore = defineStore(
    "auth",
    () => {
        // State
        // 当前鉴权状态
        const authStatus = ref<AuthStatus>("unknown");
        // 当前登录用户信息；未登录时为 null
        const user = ref<Api.User.UserLoginVo | null>(null);
        /**
         * 是否已完成至少一次 bootstrap
         * 不参与持久化：页面刷新后始终为 false，由 bootstrap 内的缓存短路分支负责置 true
         */
        const initialized = ref(false);
        // 最近一次后端校验的时间戳（Unix ms）
        const lastValidatedAt = ref<number | null>(null);
        // 本地缓存到期时间戳（Unix ms），仅用于性能优化，不作为安全判断依据
        const cacheExpiresAt = ref<number | null>(null);

        // 心跳定时器句柄
        let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

        // 并发去重：同一时刻只允许一个 bootstrap 请求在飞行
        let bootstrapPromise: Promise<void> | null = null;

        // Computed
        /**
         * 判断是否已登录（即鉴权状态为 authenticated 且持有用户信息）
         */
        const isAuthenticated = computed(() => authStatus.value === "authenticated" && !!user.value);
        /**
         * 判断是否具有管理员权限（即已登录且用户角色为 admin）
         */
        const isAdmin = computed(() => user.value?.userRole === "admin");
        /**
         * 判断本地缓存是否仍然有效（即 cacheExpiresAt 未来且格式正确）。过期后会在 ensureCacheFreshness 中重置状态回 unknown。
         */
        const isCacheValid = computed(() => cacheExpiresAt.value !== null && cacheExpiresAt.value > Date.now());

        /**
         * 将后端返回的登录用户信息写入状态，并将认证状态设置为 authenticated
         * @param loginUser 登录用户信息
         */
        const applyAuthenticated = (loginUser: Api.User.UserLoginVo): void => {
            user.value = loginUser;
            authStatus.value = "authenticated";
            initialized.value = true;
            lastValidatedAt.value = Date.now();
            cacheExpiresAt.value = lastValidatedAt.value + AUTH_CACHE_TTL_MS;
        };

        /**
         * 将状态设置为 guest（未登录），通常在鉴权失败或注销后调用
         */
        const applyGuest = (): void => {
            user.value = null;
            authStatus.value = "guest";
            initialized.value = true;
            lastValidatedAt.value = Date.now();
            // guest 也写入缓存，避免短时间内重复请求后端
            cacheExpiresAt.value = lastValidatedAt.value + AUTH_CACHE_TTL_MS;
        };

        /**
         * 清空鉴权状态（主动登出 / 401 拦截时调用）。
         * 与 applyGuest 的区别：不写缓存过期时间，确保下次访问立即触发后端校验。
         */
        const clearAuthState = (): void => {
            user.value = null;
            authStatus.value = "guest";
            initialized.value = true;
            lastValidatedAt.value = null;
            cacheExpiresAt.value = null;
            stopSessionHeartbeat();
        };

        /**
         * 缓存过期时重置状态机，促使下一次访问触发真实鉴权请求
         */
        const ensureCacheFreshness = (): void => {
            if (cacheExpiresAt.value !== null && cacheExpiresAt.value <= Date.now()) {
                user.value = null;
                authStatus.value = "unknown";
                initialized.value = false;
                lastValidatedAt.value = null;
                cacheExpiresAt.value = null;
            }
        };

        /**
         * 严格模式下：距上次校验是否超过最小重验间隔
         */
        const needsStrictRevalidate = (): boolean => {
            return lastValidatedAt.value === null || Date.now() - lastValidatedAt.value >= AUTH_REVALIDATE_INTERVAL_MS;
        };

        /**
         * 向后端拉取当前用户信息
         * - 成功响应：写入用户信息并设置 authenticated 状态
         * - 其他响应（如未登录、服务器错误等）：视为鉴权失败，降级为 guest
         * - 网络/服务异常：如果之前已登录，保留用户信息但回退到 unknown 状态等待下次重试；否则直接降级为 guest
         */
        const fetchCurrentUser = async (): Promise<void> => {
            authStatus.value = "checking";
            try {
                const { data } = await getLoginUserInfo();
                if (data.code === BusinessCode.SUCCESS && data.success) {
                    // 写入用户信息并设置 authenticated 状态
                    applyAuthenticated(data.data);
                    return;
                }
                // 其他响应（如未登录、服务器错误等）都视为鉴权失败，降级为 guest
                applyGuest();
            } catch {
                if (isAuthenticated.value) {
                    // 已登录 + 网络/服务异常：保留用户信息，回退 unknown 等待下次重试
                    authStatus.value = "unknown";
                    lastValidatedAt.value = null;
                } else {
                    applyGuest();
                }
            }
        };

        // 核心鉴权逻辑
        /**
         * 启动鉴权流程，可在应用启动、路由守卫、页面恢复时调用。
         *
         * 短路策略：
         * - 普通模式：缓存有效时跳过后端请求
         * - 严格模式：受保护路由使用，按重验间隔确保 Session 一致性
         * - force=true：无条件请求后端
         */
        const bootstrap = async (options: BootstrapOptions = {}): Promise<void> => {
            const { force = false, strict = false } = options;

            // 判断本地缓存是否过期，如果过期需要重置状态机，确保安全性和数据一致性
            ensureCacheFreshness();

            if (!force) {
                if (strict) {
                    // 受保护页面：缓存可用且未到重验时间时，允许快速放行
                    if (isAuthenticated.value && isCacheValid.value && !needsStrictRevalidate()) {
                        initialized.value = true;
                        return;
                    }
                } else {
                    // 非严格模式：已初始化过且状态明确时，不重复请求
                    if (initialized.value && (authStatus.value === "authenticated" || authStatus.value === "guest")) {
                        return;
                    }
                    // 已登录且缓存仍有效，直接复用状态，无需等待后端响应
                    if (isAuthenticated.value && isCacheValid.value) {
                        initialized.value = true;
                        return;
                    }
                }
            }

            // 并发请求去重
            if (bootstrapPromise) {
                await bootstrapPromise;
                return;
            }

            // 发起真实请求并在结束后释放锁
            bootstrapPromise = fetchCurrentUser().finally(() => {
                bootstrapPromise = null;
            });

            await bootstrapPromise;
        };

        /**
         * 登录成功后直接写入用户信息，无需再请求
         */
        const markAuthenticated = (loginUser: Api.User.UserLoginVo): void => {
            applyAuthenticated(loginUser);
        };

        /**
         * 强制刷新当前用户信息，通常在用户更新资料后调用，确保界面展示最新数据
         */
        const refreshCurrentUser = async (): Promise<void> => {
            await bootstrap({ force: true, strict: true });
        };

        /**
         * 登出：请求后端销毁 Session，无论结果如何前端状态立即清理
         */
        const logout = async (): Promise<void> => {
            try {
                await userLogout();
            } finally {
                clearAuthState();
            }
        };

        /**
         * 启动 Session 心跳，每 20 分钟向后端发起一次校验以维持 Session 活跃
         * 适用于用户长时间停留在页面但无业务请求的场景（如填写长表单）
         * 建议在用户登录成功后或应用根组件 onMounted 中调用
         */
        const startSessionHeartbeat = (): void => {
            stopSessionHeartbeat();
            heartbeatTimer = setInterval(async () => {
                if (!isAuthenticated.value) {
                    stopSessionHeartbeat();
                    return;
                }
                await bootstrap({ strict: true });
            }, SESSION_HEARTBEAT_INTERVAL_MS);
        };

        /**
         * 停止心跳定时器（clearAuthState 内部会自动调用）
         */
        const stopSessionHeartbeat = (): void => {
            if (heartbeatTimer !== null) {
                clearInterval(heartbeatTimer);
                heartbeatTimer = null;
            }
        };

        return {
            authStatus,
            user,
            initialized,
            lastValidatedAt,
            cacheExpiresAt,
            isAuthenticated,
            isAdmin,
            isCacheValid,
            bootstrap,
            markAuthenticated,
            refreshCurrentUser,
            clearAuthState,
            logout,
            startSessionHeartbeat,
            stopSessionHeartbeat,
        };
    },
    {
        persist: {
            // 持久化仅用于“体验优化”，安全判断始终依赖后端 Session
            key: "user-center-auth-cache",
            storage: localStorage,
            // 白名单持久化，避免把不必要的运行时字段写入本地
            pick: ["authStatus", "user", "lastValidatedAt", "cacheExpiresAt"],
        },
    }
);

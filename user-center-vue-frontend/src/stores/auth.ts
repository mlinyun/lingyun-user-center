import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { getLoginUserInfo, userLogout } from "@/api/user.ts";
import type { Api } from "@/types/api/typings";
import { formatDateTime, parseDateTime } from "@/utils/date";

/**
 * 前端鉴权状态机：
 * - unknown: 尚未判定（初次进入应用、缓存过期后）
 * - checking: 正在向后端校验 Session
 * - authenticated: 已登录且拿到了用户信息
 * - guest: 未登录
 */
export type AuthStatus = "unknown" | "checking" | "authenticated" | "guest";

interface BootstrapOptions {
    /** 是否强制向后端重新校验登录态 */
    force?: boolean;
    /** 受保护路由进入前的严格校验 */
    strict?: boolean;
}

const AUTH_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const AUTH_REVALIDATE_INTERVAL_MS = 60 * 1000;

/**
 * 认证状态管理.
 *
 * 安全基线：后端 Session 才是鉴权真相源，前端状态仅用于界面驱动与体验优化。
 */
export const useAuthStore = defineStore(
    "auth",
    () => {
        /** 当前鉴权状态（配合路由守卫决定是否放行）。 */
        const authStatus = ref<AuthStatus>("unknown");
        /** 当前登录用户信息；未登录时为 null。 */
        const user = ref<Api.User.UserLoginVo | null>(null);
        /** 是否已完成至少一次 bootstrap。 */
        const initialized = ref(false);
        /** 最近一次向后端校验登录态的时间戳。 */
        const lastValidatedAt = ref<string | null>(null);
        /** 本地缓存到期时间戳（用于性能优化，不是安全边界）。 */
        const cacheExpiresAt = ref<string | null>(null);

        /**
         * 并发去重：同一时刻只允许一个 bootstrap 请求在飞行。
         * 其余调用方 await 同一个 Promise，避免重复请求 /user/current。
         */
        let bootstrapPromise: Promise<void> | null = null;

        /** 是否已登录。 */
        const isAuthenticated = computed(() => authStatus.value === "authenticated" && !!user.value);
        /** 是否管理员。 */
        const isAdmin = computed(() => user.value?.userRole === "admin");
        /** 本地缓存是否还在有效期内。 */
        const isCacheValid = computed(() => {
            if (cacheExpiresAt.value === null) {
                return false;
            }

            const expiresAt = parseDateTime(cacheExpiresAt.value);
            return expiresAt !== null && expiresAt > Date.now();
        });

        /**
         * 设置为“已登录”状态，并刷新时间戳。
         * 说明：这里更新的是前端缓存；后端 Session 才是最终真相源。
         */
        const applyAuthenticated = (loginUser: Api.User.UserLoginVo): void => {
            user.value = loginUser;
            authStatus.value = "authenticated";
            initialized.value = true;
            lastValidatedAt.value = formatDateTime();
            cacheExpiresAt.value = formatDateTime(Date.now() + AUTH_CACHE_TTL_MS);
        };

        /**
         * 设置为“访客”状态。
         * 场景：后端返回未登录、接口业务失败、或网络异常时兜底。
         */
        const applyGuest = (): void => {
            user.value = null;
            authStatus.value = "guest";
            initialized.value = true;
            lastValidatedAt.value = formatDateTime();
            cacheExpiresAt.value = formatDateTime(Date.now() + AUTH_CACHE_TTL_MS);
        };

        /**
         * 清空鉴权信息。
         * 与 applyGuest 的区别：这里会立即清掉缓存过期时间，确保后续优先走后端重校验。
         */
        const clearAuthState = (): void => {
            user.value = null;
            authStatus.value = "guest";
            initialized.value = true;
            lastValidatedAt.value = formatDateTime();
            cacheExpiresAt.value = null;
        };

        /**
         * 检查本地缓存是否过期。
         * 过期后回到 unknown + 未初始化，促使下一次访问触发真实鉴权请求。
         */
        const ensureCacheFreshness = (): void => {
            if (cacheExpiresAt.value !== null) {
                const expiresAt = parseDateTime(cacheExpiresAt.value);
                if (expiresAt === null || expiresAt <= Date.now()) {
                    user.value = null;
                    authStatus.value = "unknown";
                    initialized.value = false;
                    cacheExpiresAt.value = null;
                }
            }
        };

        /**
         * 严格模式下是否需要再次请求后端。
         * 即使缓存还在，也会按最小重验间隔做一次“强一致性”检查。
         */
        const needsStrictRevalidate = (): boolean => {
            if (lastValidatedAt.value === null) {
                return true;
            }

            const validatedAt = parseDateTime(lastValidatedAt.value);
            return validatedAt === null || Date.now() - validatedAt > AUTH_REVALIDATE_INTERVAL_MS;
        };

        /**
         * 真实向后端拉取当前用户信息。
         * 任何异常都降级为 guest，保证前端状态可预测。
         */
        const fetchCurrentUser = async (): Promise<void> => {
            authStatus.value = "checking";
            try {
                const response = await getLoginUserInfo();
                if (response.data?.success && response.data.data) {
                    applyAuthenticated(response.data.data);
                    return;
                }
                applyGuest();
            } catch {
                applyGuest();
            }
        };

        /**
         * 启动鉴权流程（可在应用启动、路由守卫、页面恢复时调用）。
         *
         * 策略说明：
         * - 普通模式：优先使用有效缓存，减少请求。
         * - 严格模式：受保护路由使用，按重验间隔确保 Session 一致性。
         * - force=true：无条件请求后端，忽略缓存短路。
         */
        const bootstrap = async (options: BootstrapOptions = {}): Promise<void> => {
            const { force = false, strict = false } = options;

            // 第一步：先处理本地缓存是否过期。
            ensureCacheFreshness();

            if (!force) {
                if (strict) {
                    // 受保护页面：缓存可用且未到重验时间时，允许快速放行。
                    if (isAuthenticated.value && isCacheValid.value && !needsStrictRevalidate()) {
                        initialized.value = true;
                        return;
                    }
                } else {
                    // 非严格模式：已初始化过且状态明确时，不重复请求。
                    if (initialized.value && (authStatus.value === "authenticated" || authStatus.value === "guest")) {
                        return;
                    }
                    // 已登录且缓存仍有效，直接复用。
                    if (isAuthenticated.value && isCacheValid.value) {
                        initialized.value = true;
                        return;
                    }
                }
            }

            // 第二步：并发请求去重。
            if (bootstrapPromise) {
                await bootstrapPromise;
                return;
            }

            // 第三步：发起真实请求并在结束后释放锁。
            bootstrapPromise = fetchCurrentUser().finally(() => {
                bootstrapPromise = null;
            });

            await bootstrapPromise;
        };

        /**
         * 登录成功后可直接调用，立即把后端返回的用户信息写入状态。
         * 这样无需额外再请求一次 /user/current。
         */
        const markAuthenticated = (loginUser: Api.User.UserLoginVo): void => {
            applyAuthenticated(loginUser);
        };

        /** 手动刷新当前用户信息（强制走后端）。 */
        const refreshCurrentUser = async (): Promise<void> => {
            await bootstrap({ force: true, strict: true });
        };

        /**
         * 注销流程：
         * - 先请求后端清 Session
         * - 无论请求结果如何，前端都清理本地鉴权状态
         */
        const logout = async (): Promise<void> => {
            try {
                await userLogout();
            } finally {
                clearAuthState();
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
        };
    },
    {
        persist: {
            // 持久化仅用于“体验优化”，安全判断始终依赖后端 Session。
            key: "user-center-auth-cache",
            storage: localStorage,
            // 白名单持久化，避免把不必要的运行时字段写入本地。
            pick: ["authStatus", "user", "lastValidatedAt", "cacheExpiresAt"],
        },
    }
);

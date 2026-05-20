/**
 * HTTP 请求封装模块.
 *
 * @description 基于 Axios 封装，提供统一的请求/响应拦截、业务错误处理和消息提示
 */
import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/http/response.ts";
import type { CustomInternalRequestConfig } from "@/types/http/request.ts";
import { CONTENT_TYPE, REQUEST_TIMEOUT } from "@/constants/http.ts";
import { isSuccess, isAuthError, isPermissionError, isServerError, getMessageByCode } from "@/constants/code.ts";
import { messageUtils } from "@/utils/message";
import type { MessageConfig } from "@/types/message";
import { useAuthStore } from "@/stores/auth.ts";
import router from "@/router";
import { ROUTES } from "@/constants/routes.ts";

/**
 * Axios 实例单例.
 *
 * @description 创建一个配置好的 Axios 单实例，设置基础 URL、请求超时、默认请求头等配置项
 */
const axiosInstance: AxiosInstance = axios.create({
    // 使用环境变量中的 API 基础 URL，确保在不同环境下可以灵活配置
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    // 设置请求超时时间，防止请求长时间挂起
    timeout: REQUEST_TIMEOUT,
    // 允许跨域请求时携带凭证（如 cookies）
    withCredentials: true,
    // 设置默认请求头，指定请求体格式为 JSON
    headers: { "Content-Type": CONTENT_TYPE.JSON },
});

/**
 * 请求拦截器.
 *
 * @description 在发送请求之前对请求进行处理，例如添加认证 token、设置全局加载状态等
 */
axiosInstance.interceptors.request.use(
    // 在请求发送之前对请求配置进行处理
    (config: CustomInternalRequestConfig): CustomInternalRequestConfig => config,
    // 在请求发送失败时对错误进行处理
    (error: AxiosError): Promise<never> => {
        // 开发环境日志
        if (import.meta.env.DEV) {
            console.error("[Request Error]:", error);
        }
        messageUtils.error(error.message);
        return Promise.reject(error);
    }
);

/**
 * 响应拦截器.
 *
 * @description 在接收响应之后对响应进行处理，例如统一处理错误响应、提取数据等
 */
axiosInstance.interceptors.response.use(
    /**
     * HTTP 2xx 响应处理。
     *
     * 注意：后端业务错误（如参数校验失败）也会走这里，需通过 success 字段区分
     * 无论业务成功与否，始终 return response，由调用方决定如何消费 response.data
     */
    (response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => {
        // 获取请求配置参数
        const requestConfig = response.config as CustomInternalRequestConfig;
        // 获取响应数据
        const responseData = response.data as ApiResponse;
        // 获取业务层面的响应状态码、成功标志和消息
        const { code: businessCode, success, message: responseMessage } = responseData;

        // 开发环境日志
        if (import.meta.env.DEV) {
            console.log(`[Response] ${requestConfig.url}`, responseData);
        }

        // 处理业务层面的成功响应
        if (success && isSuccess(businessCode)) {
            // 如果请求配置中设置了显示成功消息，则显示成功消息
            if (requestConfig.showSuccessMessage) {
                const successMessage = requestConfig.successMessage || responseMessage || "操作成功！";
                messageUtils.success(successMessage, requestConfig.messageConfig);
            }
            return response;
        } else {
            // 处理业务层面的错误响应，显示错误消息
            // 设置默认错误消息：依次取 响应消息 → 业务状态码映射消息 → 兜底文案
            const errorMessage = responseMessage || getMessageByCode(businessCode) || "请求失败，请稍后再试！";
            // 是否显示错误消息，默认为 true，只有当请求配置中明确设置 showErrorMessage: false 时才不显示
            const shouldShowError = requestConfig.showErrorMessage !== false;
            // 调用方可通过 requestConfig.messageConfig 覆盖默认的通知标题等配置
            const customMsgConfig = requestConfig.messageConfig;

            // 根据不同类型的错误进行不同的处理，例如认证错误、权限错误、服务器错误等
            switch (true) {
                case isAuthError(businessCode):
                    // 认证错误，用户未登录或认证失败：清理状态并跳转登录页
                    void handleAuthExpired(errorMessage, shouldShowError);
                    break;
                case isPermissionError(businessCode):
                    // 权限错误，用户没有访问权限：提示用户权限不足
                    if (shouldShowError) {
                        // 使用 Notification 组件显示权限错误消息
                        const msgConfig: MessageConfig = {
                            useNotification: true,
                            message: "权限不足",
                        };
                        messageUtils.error(errorMessage, msgConfig);
                    }
                    break;
                case isServerError(businessCode):
                    // 服务器错误，后端处理请求时发生异常：提示用户服务器错误
                    if (shouldShowError) {
                        // 使用 Notification 组件显示服务器错误消息
                        const msgConfig: MessageConfig = {
                            useNotification: true,
                            message: "服务器错误",
                        };
                        messageUtils.error(errorMessage, msgConfig);
                    }
                    break;
                default:
                    // 其他业务错误
                    if (shouldShowError) {
                        messageUtils.error(errorMessage, customMsgConfig);
                    }
                    break;
            }
        }
        return response;
    },

    /**
     * 非 2xx HTTP 状态码响应处理
     *
     * 区分三类场景：
     * - 服务器有响应（4xx/5xx）：按状态码处理，401 触发认证失效流程
     * - 无响应（网络问题/超时）：按 error.code 区分超时与断网
     * - 请求未发出（配置错误等）：直接展示原始错误信息
     */
    (error: AxiosError): Promise<never> => {
        const requestConfig = error.config as CustomInternalRequestConfig;
        const shouldShowError = requestConfig.showErrorMessage !== false;

        // 开发环境日志
        if (import.meta.env.DEV) {
            console.error("[Response Fail]:", error);
        }

        if (error.response) {
            // 服务器响应了一个状态码，表示请求已完成但服务器返回了错误状态
            const statusCode = error.response.status;
            const statusText = error.response.statusText;
            const message = `请求失败，状态码：${statusCode} ${statusText}`;

            if (statusCode === 401) {
                // HTTP 层面的 401，与业务码 NOT_LOGIN(40100)/NO_AUTH(40101) 同等处理，统一走认证失效流程
                void handleAuthExpired("登录状态已失效，请重新登录！", shouldShowError);
            } else if (shouldShowError) {
                const msgConfig: MessageConfig = {
                    useNotification: true,
                    message: `请求错误 ${statusCode}`,
                };
                messageUtils.error(message, msgConfig);
            }
        } else if (error.request) {
            // 请求已发送但没有收到响应，可能是网络问题或服务器未响应
            if (shouldShowError) {
                const msg = error.code === "ECONNABORTED" ? "请求超时，请稍后再试" : "请求未响应，请检查网络连接";
                const msgConfig: MessageConfig = {
                    useNotification: true,
                    message: error.code === "ECONNABORTED" ? "请求超时" : "网络错误",
                };
                messageUtils.error(msg, msgConfig);
            }
        } else {
            // 其他错误，例如请求配置错误等
            if (shouldShowError) {
                const msgConfig: MessageConfig = {
                    useNotification: true,
                    message: "请求错误",
                };
                messageUtils.error(error.message, msgConfig);
            }
        }
        return Promise.reject(error);
    }
);

/**
 * 认证失效跳转锁，防止并发请求触发重复跳转.
 */
let isRedirectingToLogin = false;

/**
 * 认证失效统一处理：通知用户、清理鉴权状态、重定向到登录页
 *
 * - 已处于登录页时不再重复跳转，并将当前路径作为 redirect 参数保留
 * - 调用 store.handleUnauthorized() 而非 clearAuthState()，
 *   确保同时停止 Session 心跳等副作用。
 *
 * @param errorMessage   向用户展示的错误提示文案
 * @param shouldShowError 是否弹出错误提示
 */
const handleAuthExpired = async (errorMessage: string, shouldShowError: boolean): Promise<void> => {
    if (shouldShowError) {
        // 使用 Notification 组件显示认证失效消息，提示用户重新登录
        const msgConfig: MessageConfig = {
            useNotification: true,
            message: "认证失效",
        };
        messageUtils.error(errorMessage || "登录状态已失效，请重新登录！", msgConfig);
    }
    if (isRedirectingToLogin) {
        return;
    }
    isRedirectingToLogin = true;

    try {
        // 清理鉴权状态
        const authStore = useAuthStore();
        authStore.clearAuthState();

        // 获取当前路径，避免在登录页时重复跳转
        const currentPath = router.currentRoute.value.fullPath;
        if (currentPath.startsWith(ROUTES.LOGIN.path)) {
            return;
        }

        // 重定向到登录页，并将当前路径作为 redirect 参数保留
        await router.replace({
            name: ROUTES.LOGIN.name,
            query: { redirect: currentPath },
        });
    } catch (error) {
        console.log("认证失效统一处理失败:", error);
    } finally {
        isRedirectingToLogin = false;
    }
};

/**
 * 导出 Axios 实例.
 */
export default axiosInstance;

/**
 * HTTP 请求封装模块.
 *
 * @description 基于 Axios 封装的 HTTP 请求工具，提供统一的请求/响应处理、错误处理、消息提示等功能
 */
import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/http/response.ts";
import type { CustomInternalRequestConfig, CustomRequestConfig } from "@/types/http/request.ts";
import { CONTENT_TYPE, REQUEST_TIMEOUT } from "@/constants/http.ts";
import { isSuccess, isAuthError, isPermissionError, isServerError, getMessageByCode } from "@/constants/code.ts";
import { messageUtils } from "@/utils/message";
import type { MessageConfig } from "@/types/message";

/**
 * 创建并配置 Axios 实例.
 *
 * @description 创建一个配置好的 Axios 实例，设置基础 URL、请求超时、默认请求头等配置项，方便在项目中统一使用该实例发送 HTTP 请求
 * @returns {AxiosInstance} 配置好的 Axios 实例，用于发送 HTTP 请求
 */
const createAxiosInstance = (): AxiosInstance => {
    return axios.create({
        // 使用环境变量中的 API 基础 URL，确保在不同环境下可以灵活配置
        baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
        // 设置请求超时时间，防止请求长时间挂起
        timeout: REQUEST_TIMEOUT,
        // 允许跨域请求时携带凭证（如 cookies）
        withCredentials: true,
        // 设置默认请求头，指定请求体格式为 JSON
        headers: {
            "Content-Type": CONTENT_TYPE.JSON,
        },
    });
};

/**
 * Axios 实例单例.
 *
 * @description 创建一个单例的 Axios 实例，确保在整个应用中共享同一个实例，避免重复创建实例带来的性能开销
 */
const axiosInstance: AxiosInstance = createAxiosInstance();

/**
 * 登录重定向锁，避免并发请求导致重复跳转.
 */
let isRedirectingToLogin = false;

/**
 * 统一处理认证失效：清理认证状态并跳转登录页.
 */
const redirectToLogin = async (): Promise<void> => {
    if (isRedirectingToLogin) {
        return;
    }
    isRedirectingToLogin = true;

    try {
        const [{ default: router }, { useAuthStore }] = await Promise.all([
            import("@/router"),
            import("@/stores/auth"),
        ]);

        const authStore = useAuthStore();
        authStore.clearAuthState();

        const currentPath = router.currentRoute.value.fullPath;
        if (currentPath.startsWith("/auth")) {
            return;
        }

        await router.replace({
            path: "/auth/login",
            query: { redirect: currentPath },
        });
    } finally {
        isRedirectingToLogin = false;
    }
};

/**
 * 认证错误统一处理入口.
 */
const handleAuthError = (errorMessage: string, shouldShowError: boolean): void => {
    if (shouldShowError) {
        messageUtils.error(errorMessage || "登录状态已失效，请重新登录");
    }
    void redirectToLogin();
};

/**
 * 请求拦截器.
 *
 * @description 在发送请求之前对请求进行处理，例如添加认证 token、设置全局加载状态等
 */
axiosInstance.interceptors.request.use(
    // 在请求发送之前对请求配置进行处理
    (config: CustomInternalRequestConfig): CustomInternalRequestConfig => {
        return config;
    },
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
    // 在响应成功时对响应数据进行处理
    (response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => {
        // 获取请求配置参数
        const requestConfig = response.config as CustomInternalRequestConfig;
        // 获取响应数据
        const responseData = response.data as ApiResponse;
        // 获取业务层面的响应状态码
        const businessCode = responseData.code;

        // 开发环境日志
        if (import.meta.env.DEV) {
            console.log(`[Response] ${requestConfig.url}`, responseData);
        }

        // TODO: 优化：可以获取请求配置的 消息配置选项 messageConfig

        // 处理业务层面的成功响应
        if (responseData.success && isSuccess(businessCode)) {
            // 如果请求配置中设置了显示成功消息，则显示成功消息
            if (requestConfig.showSuccessMessage) {
                const successMessage = requestConfig.successMessage || responseData.message || "操作成功";
                messageUtils.success(successMessage);
            }
            return response;
        } else {
            // 处理业务层面的错误响应，显示错误消息
            // 设置默认错误消息，如果响应中没有提供消息，就使用业务状态码映射的消息，如果映射中也没有，就使用通用的错误提示
            const errorMessage = responseData.message || getMessageByCode(businessCode) || "请求失败，请稍后再试";
            // 根据不同类型的错误进行不同的处理，例如认证错误、权限错误、服务器错误等
            switch (true) {
                case isAuthError(businessCode):
                    // 认证错误
                    handleAuthError(errorMessage, requestConfig.showErrorMessage !== false);
                    break;
                case isPermissionError(businessCode):
                    // 权限错误
                    if (requestConfig.showErrorMessage !== false) {
                        // 使用 Notification 组件显示权限错误消息，提示用户没有访问权限
                        const msgConfig: MessageConfig = {
                            useNotification: true,
                            title: "权限不足",
                            message: "权限不足",
                        };
                        messageUtils.error(errorMessage, msgConfig);
                    }
                    // TODO: 优化权限错误响应
                    break;
                case isServerError(businessCode):
                    // 服务器错误
                    if (requestConfig.showErrorMessage !== false) {
                        // 使用 Notification 组件显示权限错误消息，提示用户没有访问权限
                        const msgConfig: MessageConfig = {
                            useNotification: true,
                            title: "服务器错误",
                            message: "服务器错误",
                        };
                        messageUtils.error(errorMessage, msgConfig);
                    }
                    // TODO: 优化服务器错误响应
                    break;
                default:
                    // 其他业务错误
                    if (requestConfig.showErrorMessage !== false) {
                        messageUtils.error(errorMessage);
                    }
                    break;
            }
        }
        return response;
    },
    // 在响应失败时对错误进行处理
    (error: AxiosError): Promise<never> => {
        // 获取请求配置参数
        const requestConfig = error.config as CustomInternalRequestConfig;
        // 是否显示错误消息
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
                handleAuthError("登录状态已失效，请重新登录", shouldShowError);
            } else if (shouldShowError) {
                messageUtils.error(message);
            }
        } else if (error.request) {
            // 请求已发送但没有收到响应，可能是网络问题或服务器未响应
            if (shouldShowError) {
                if (error.code === "ECONNABORTED") {
                    messageUtils.error("请求超时，请稍后再试");
                } else {
                    messageUtils.error("请求未响应，请检查网络连接");
                }
            }
        } else {
            // 其他错误，例如请求配置错误等
            if (shouldShowError) {
                messageUtils.error(error.message);
            }
        }

        return Promise.reject(error);
    }
);

// 封装请求方法
export const http = {
    /**
     * 封装 GET 请求
     * @param url 请求地址
     * @param params 查询参数
     * @param config 请求配置
     * @returns Promise
     */
    get: <T = unknown>(
        url: string,
        params?: Record<string, unknown>,
        config?: CustomRequestConfig
    ): Promise<AxiosResponse<ApiResponse<T>>> => {
        return axiosInstance.get<ApiResponse<T>>(url, { params, ...config });
    },

    /**
     * 封装 POST 请求
     * @param url 请求地址
     * @param data 请求体数据
     * @param config 请求配置
     * @returns Promise
     */
    post: <T = unknown>(
        url: string,
        data?: unknown,
        config?: CustomRequestConfig
    ): Promise<AxiosResponse<ApiResponse<T>>> => {
        return axiosInstance.post<ApiResponse<T>>(url, data, config);
    },

    /**
     * 封装 PUT 请求
     * @param url 请求地址
     * @param data 请求体数据
     * @param config 请求配置
     * @returns Promise
     */
    put: <T = unknown>(
        url: string,
        data?: unknown,
        config?: CustomRequestConfig
    ): Promise<AxiosResponse<ApiResponse<T>>> => {
        return axiosInstance.put<ApiResponse<T>>(url, data, config);
    },

    /**
     * 封装 DELETE 请求
     * @param url 请求地址
     * @param params 查询参数
     * @param config 请求配置
     * @returns Promise
     */
    del: <T = unknown>(
        url: string,
        params?: Record<string, unknown>,
        config?: CustomRequestConfig
    ): Promise<AxiosResponse<ApiResponse<T>>> => {
        return axiosInstance.delete<ApiResponse<T>>(url, { params, ...config });
    },

    /**
     * 封装 PATCH 请求
     * @param url 请求地址
     * @param data 请求体数据
     * @param config 请求配置
     * @returns Promise
     */
    patch: <T = unknown>(
        url: string,
        data?: unknown,
        config?: CustomRequestConfig
    ): Promise<AxiosResponse<ApiResponse<T>>> => {
        return axiosInstance.patch<ApiResponse<T>>(url, data, config);
    },
};

/**
 * 导出 Axios 实例.
 */
export default axiosInstance;

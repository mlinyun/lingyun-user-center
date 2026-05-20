import type { CustomRequestConfig } from "@/types/http/request.ts";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/http/response.ts";
import axiosInstance from "@/utils/request/axios.ts";

/**
 * HTTP 请求工具类，封装了常用的 HTTP 方法，统一返回 ApiResponse 包裹的结果.
 */
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

import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import type { MessageConfig } from "@/types/message";

/** 扩展的请求配置接口 */
export interface CustomRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
    /** 是否显示错误提示 (默认 true) */
    showErrorMessage?: boolean;
    /** 是否显示成功提示 (默认 false) */
    showSuccessMessage?: boolean;
    /** 自定义成功提示信息 */
    successMessage?: string;
    /** 是否显示加载状态 (默认 false) */
    showLoading?: boolean;
    /** 消息配置选项 */
    messageConfig?: MessageConfig;
}

/** 扩展的内部请求配置接口（用于拦截器） */
export interface CustomInternalRequestConfig extends InternalAxiosRequestConfig {
    showErrorMessage?: boolean;
    showSuccessMessage?: boolean;
    successMessage?: string;
    showLoading?: boolean;
    messageConfig?: MessageConfig;
}

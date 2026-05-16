/**
 * API 响应类型定义模块
 *
 * @description 提供统一的 API 响应结构类型定义
 * @module types/http/response
 */

/** 基础 API 响应结构定义 */
export interface ApiResponse<T = unknown> {
    /** 请求是否成功 */
    success: boolean;
    /** 状态码（20000 表示成功，其余表示错误码） */
    code: number;
    /** 说明消息 */
    message: string;
    /** 响应数据 */
    data?: T;
}

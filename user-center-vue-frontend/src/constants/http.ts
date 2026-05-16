/**
 * HTTP 相关常量定义.
 *
 * @description 定义与 HTTP 请求相关的常量，如请求配置等常量
 * @module constants/http
 */

/**
 * 请求超时时间（单位：毫秒）
 */
export const REQUEST_TIMEOUT = 10000; // 10秒

/**
 * 内容类型常量
 */
export const CONTENT_TYPE = {
    /** JSON 格式 */
    JSON: "application/json;charset=UTF-8",
    /** 表单格式 */
    FORM: "application/x-www-form-urlencoded;charset=UTF-8",
    /** 文件上传 */
    MULTIPART: "multipart/form-data",
    /** 纯文本 */
    TEXT: "text/plain;charset=UTF-8",
} as const;

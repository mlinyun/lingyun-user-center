/**
 * 常量统一导出模块.
 *
 * @description 集中导出项目中使用的各种常量定义模块，方便在项目中统一引用和管理常量
 * @module constants
 */

// HTTP 相关
export { REQUEST_TIMEOUT, CONTENT_TYPE } from "./http";

// 业务状态码相关
export { BusinessCode, isSuccess, isAuthError, isPermissionError, isServerError, getMessageByCode } from "./code";

// 系统相关
export {
    SYSTEM_LOGO,
    SYSTEM_TITLE,
    SYSTEM_SUBTITLE,
    GITHUB_URL,
    DOCUMENT_URL,
    CONTACT_EMAIL,
    DEFAULT_AVATAR,
} from "./system";

// 正则相关
export { PWD_REGEX, PHONE_REGEX, CODE_REGEX } from "./validation";

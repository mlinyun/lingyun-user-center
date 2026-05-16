/**
 * 业务状态码枚举.
 */
export enum BusinessCode {
    /** 成功 */
    SUCCESS = 20000,
    /** 请求参数错误 */
    PARAM_ERROR = 40000,
    /** 用户未登录 */
    NOT_LOGIN = 40100,
    /** 认证失败 */
    NO_AUTH = 40101,
    /** 禁止访问 */
    FORBIDDEN = 40300,
    /** 资源不存在 */
    NOT_FOUND = 40400,
    /** 服务器内部错误 */
    SERVER_ERROR = 50000,
    /** 操作失败 */
    OPERATION_ERROR = 50001,
}

/**
 * 业务状态码对应的消息映射
 */
export const CODE_MESSAGES: Record<BusinessCode, string> = {
    [BusinessCode.SUCCESS]: "操作成功",
    [BusinessCode.PARAM_ERROR]: "请求参数错误",
    [BusinessCode.NOT_LOGIN]: "用户未登录",
    [BusinessCode.NO_AUTH]: "认证失败",
    [BusinessCode.FORBIDDEN]: "禁止访问",
    [BusinessCode.NOT_FOUND]: "资源不存在",
    [BusinessCode.SERVER_ERROR]: "服务器内部错误",
    [BusinessCode.OPERATION_ERROR]: "操作失败",
};

/**
 * 判断是否为成功状态
 * @param code 状态码
 * @return 是否成功
 */
export const isSuccess = (code: number): boolean => {
    return code === BusinessCode.SUCCESS;
};

/**
 * 判断是否为认证相关错误
 * @param code 状态码
 * @return 是否为认证错误
 */
export const isAuthError = (code: number): boolean => {
    return code === BusinessCode.NOT_LOGIN || code === BusinessCode.NO_AUTH;
};

/**
 * 判断是否为权限相关错误
 * @param code 状态码
 * @return 是否为权限错误
 */
export const isPermissionError = (code: number): boolean => {
    return code === BusinessCode.FORBIDDEN;
};

/**
 * 判断是否为服务器错误
 * @param code 状态码
 * @return 是否为服务器错误
 */
export const isServerError = (code: number): boolean => {
    return code === BusinessCode.SERVER_ERROR || code === BusinessCode.OPERATION_ERROR;
};

/**
 * 获取状态码对应的消息
 * @param code 状态码
 * @return 对应的消息字符串
 */
export const getMessageByCode = (code: number): string => {
    return CODE_MESSAGES[code as BusinessCode] || "未知错误";
};

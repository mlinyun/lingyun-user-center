package com.mlinyun.usercenterbackend.common;

import lombok.Getter;

/**
 * 错误码枚举类.
 *
 * <p>
 * 定义系统中使用的错误码及其对应的描述信息
 * </p>
 */
@Getter
public enum ErrorCode {

    // 200 OK: 请求成功
    SUCCESS(true, 20000, "操作成功"),

    // 400 Bad Request: 请求参数错误
    PARAMS_ERROR(false, 40000, "请求参数错误"),

    // 401 Unauthorized: 认证失败
    NOT_LOGIN_ERROR(false, 40100, "用户未登录"),

    NOT_AUTH_ERROR(false, 40101, "认证失败，权限不足"),

    // 403 Forbidden: 权限不足
    FORBIDDEN_ERROR(false, 40300, "权限不足，拒绝访问"),

    // 404 Not Found: 资源未找到
    NOT_FOUND_ERROR(false, 40400, "请求资源未找到"),

    // 500 Internal Server Error: 服务器内部错误
    SYSTEM_ERROR(false, 50000, "服务器内部错误"),

    OPERATION_ERROR(false, 50001, "操作失败");

    /**
     * 是否成功.
     */
    private final Boolean success;

    /**
     * 状态码.
     */
    private final Integer code;

    /**
     * 描述信息.
     */
    private final String message;

    /**
     * 构造函数.
     *
     * @param success 是否成功
     * @param code 状态码
     * @param message 描述信息
     */
    ErrorCode(Boolean success, Integer code, String message) {
        this.success = success;
        this.code = code;
        this.message = message;
    }

}

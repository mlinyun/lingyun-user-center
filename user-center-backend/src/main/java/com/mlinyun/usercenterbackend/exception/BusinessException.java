package com.mlinyun.usercenterbackend.exception;

import com.mlinyun.usercenterbackend.common.ErrorCode;
import lombok.Getter;

/**
 * 业务异常类.
 *
 * <p>
 * 用于处理业务逻辑中的异常情况，继承自 RuntimeException
 * </p>
 */
@Getter
public class BusinessException extends RuntimeException {

    /**
     * 业务异常状态码.
     */
    private final Integer code;

    /**
     * 构造函数，使用业务异常状态码和异常信息初始化异常对象.
     *
     * @param code 业务异常状态码
     * @param message 异常信息
     */
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    /**
     * 构造函数，使用预定义的错误码枚举初始化异常对象.
     *
     * @param errorCode 错误码枚举
     */
    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
    }

    /**
     * 构造函数，使用预定义的错误码枚举和自定义异常信息初始化异常对象.
     *
     * @param errorCode 错误码枚举
     * @param message 自定义异常信息
     */
    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.code = errorCode.getCode();
    }

}

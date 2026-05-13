package com.mlinyun.usercenterbackend.common;

/**
 * 响应结果工具类.
 *
 * <p>
 * 提供统一的响应结果创建方法，简化控制器返回结果的构建过程， 支持成功响应和各种错误响应的快速创建
 * </p>
 */
public final class ResultUtils {

    /**
     * 成功状态码：20000.
     *
     * <p>
     * 该常量用于表示请求成功的状态码，通常在成功响应中使用
     * </p>
     */
    public static final int SUCCESS_CODE = ErrorCode.SUCCESS.getCode();

    /**
     * 私有构造函数，防止实例化.
     */
    private ResultUtils() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * 创建成功响应结果.
     *
     * @param data 响应数据
     * @param <T> 响应数据类型
     * @return {@link BaseResponse} 包含成功状态码和响应数据的响应结果
     */
    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse<>(true, SUCCESS_CODE, "请求成功", data);
    }

    /**
     * 创建错误响应结果.
     *
     * @param code 错误状态码
     * @param message 错误消息
     * @return {@link BaseResponse} 包含错误状态码和错误消息的响应结果
     */
    public static BaseResponse<Object> error(Integer code, String message) {
        return new BaseResponse<>(false, code, message);
    }

    /**
     * 基于错误码枚举创建错误响应结果.
     *
     * @param errorCode 错误码枚举
     * @return {@link BaseResponse} 包含错误状态码和错误消息的响应结果
     */
    public static BaseResponse<Object> error(ErrorCode errorCode) {
        return new BaseResponse<>(errorCode);
    }

    /**
     * 基于错误码枚举和自定义消息创建错误响应结果.
     *
     * @param errorCode 错误码枚举
     * @param message 自定义错误消息
     * @return {@link BaseResponse} 包含错误状态码和自定义错误消息的响应结果
     */
    public static BaseResponse<Object> error(ErrorCode errorCode, String message) {
        return new BaseResponse<>(errorCode.getSuccess(), errorCode.getCode(), message);
    }
}

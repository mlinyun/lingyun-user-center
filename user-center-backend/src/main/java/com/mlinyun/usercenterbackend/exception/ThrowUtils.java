package com.mlinyun.usercenterbackend.exception;

import com.mlinyun.usercenterbackend.common.ErrorCode;

/**
 * 抛出异常工具类.
 *
 * <p>
 * 提供抛出运行时异常和业务异常的方法
 * </p>
 */
public final class ThrowUtils {

    /**
     * 私有构造函数，防止实例化.
     */
    private ThrowUtils() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * 条件成立则抛出指定的运行时异常.
     *
     * @param condition 条件
     * @param runtimeException 运行时异常
     */
    public static void throwIf(boolean condition, RuntimeException runtimeException) {
        // 如果条件为真，则抛出指定的运行时异常
        if (condition) {
            throw runtimeException;
        }
    }

    /**
     * 条件成立则抛出指定的业务异常.
     *
     * @param condition 条件
     * @param errorCode 业务异常错误码
     */
    public static void throwIf(boolean condition, ErrorCode errorCode) {
        throwIf(condition, new BusinessException(errorCode));
    }

    /**
     * 条件成立则抛出指定的业务异常并附带自定义异常信息.
     *
     * @param condition 条件
     * @param errorCode 业务异常错误码
     * @param message 自定义异常信息
     */
    public static void throwIf(boolean condition, ErrorCode errorCode, String message) {
        throwIf(condition, new BusinessException(errorCode, message));
    }

}

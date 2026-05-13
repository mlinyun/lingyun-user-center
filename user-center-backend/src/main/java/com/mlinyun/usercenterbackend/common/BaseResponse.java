package com.mlinyun.usercenterbackend.common;

import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 通用响应模型.
 *
 * <p>
 * 用于统一接口响应格式，支持泛型，可以返回各种类型的数据
 * </p>
 *
 * @param <T> 响应数据的类型
 */
@Data
@Schema(description = "通用响应模型")
public class BaseResponse<T> implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 8775873007856831836L;

    /**
     * 请求是否成功.
     */
    @Schema(description = "请求是否成功", example = "true", allowableValues = {"true", "false"},
            requiredMode = Schema.RequiredMode.REQUIRED)
    private Boolean success;

    /**
     * 状态码.
     */
    @Schema(description = "状态码", example = "20000", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer code;

    /**
     * 响应消息.
     */
    @Schema(description = "响应消息", nullable = true, example = "操作成功", requiredMode = Schema.RequiredMode.REQUIRED)
    private String message;

    /**
     * 响应数据.
     */
    @Schema(description = "响应数据", nullable = true)
    private transient T data;

    /**
     * 全参构造函数.
     *
     * @param success 请求是否成功
     * @param code 状态码
     * @param message 响应消息
     * @param data 响应数据
     */
    public BaseResponse(Boolean success, Integer code, String message, T data) {
        this.success = success;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 无数据构造函数.
     *
     * @param success 请求是否成功
     * @param code 状态码
     * @param message 响应消息
     */
    public BaseResponse(Boolean success, Integer code, String message) {
        this(success, code, message, null);
    }

    /**
     * 根据错误码构造响应对象.
     *
     * @param errorCode 错误码枚举
     */
    public BaseResponse(ErrorCode errorCode) {
        this(errorCode.getSuccess(), errorCode.getCode(), errorCode.getMessage(), null);
    }

}

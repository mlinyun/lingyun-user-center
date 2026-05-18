package com.mlinyun.usercenterbackend.model.dto.captcha;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 发送验证码请求体.
 *
 * <p>
 * 用于封装发送验证码时所需的请求参数
 * </p>
 */
@Data
@Schema(description = "发送验证码请求体")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class SendCaptchaRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 2948571036284950176L;

    /**
     * 验证码类型: EMAIL / SMS.
     */
    @Schema(description = "验证码类型", example = "EMAIL", allowableValues = {"EMAIL", "SMS"},
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = CaptchaConstant.TYPE_NOT_NULL_MSG)
    private String type;

    /**
     * 验证码场景: REGISTER / LOGIN / RESET_PWD / BIND_CHANGE.
     */
    @Schema(description = "验证码场景", example = "REGISTER",
            allowableValues = {"REGISTER", "LOGIN", "RESET_PWD", "BIND_CHANGE"},
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = CaptchaConstant.SCENE_NOT_NULL_MSG)
    private String scene;

    /**
     * 发送目标（邮箱地址或手机号）.
     */
    @Schema(description = "发送目标（邮箱或手机号）", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = CaptchaConstant.TARGET_NOT_BLANK_MSG)
    private String target;

}

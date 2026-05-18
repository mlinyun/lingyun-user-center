package com.mlinyun.usercenterbackend.model.dto.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaConstant;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 绑定/换绑手机号请求体.
 */
@Data
@Schema(description = "用户绑定或换绑手机号请求参数")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class UserBindPhoneRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 5599507071656129051L;

    /**
     * 手机号码.
     */
    @Schema(description = "手机号码", example = "13812345678", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.PHONE_NOT_NULL_MSG)
    @Pattern(regexp = UserConstant.PHONE_REGEX, message = UserConstant.PHONE_FORMAT_MSG)
    private String userPhone;

    /**
     * 短信验证码.
     */
    @Schema(description = "短信验证码", example = "382956", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = CaptchaConstant.CODE_NOT_BLANK_MSG)
    @Size(min = CaptchaConstant.CODE_LENGTH, max = CaptchaConstant.CODE_LENGTH,
            message = CaptchaConstant.CODE_LENGTH_MSG)
    private String captchaCode;

}

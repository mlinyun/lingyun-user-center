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
 * 用户通过手机重置密码请求体.
 *
 * <p>
 * 用于用户忘记密码时，通过手机验证码验证身份后重置密码的请求参数
 * </p>
 */
@Data
@Schema(description = "通过手机重置密码请求参数")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class UserPhoneResetPwdRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 7283946510392847561L;

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

    /**
     * 新的密码.
     */
    @Schema(description = "新的密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.CREDENTIAL_NOT_NULL_MSG)
    @Size(min = UserConstant.PWD_MIN, max = UserConstant.PWD_MAX, message = UserConstant.CREDENTIAL_LENGTH_MSG)
    @Pattern(regexp = UserConstant.CREDENTIAL_REGEX, message = UserConstant.CREDENTIAL_FORMAT_MSG)
    private String newPassword;

    /**
     * 校验密码.
     */
    @Schema(description = "校验密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.CREDENTIAL_NOT_NULL_MSG)
    @Size(min = UserConstant.PWD_MIN, max = UserConstant.PWD_MAX, message = UserConstant.CREDENTIAL_LENGTH_MSG)
    @Pattern(regexp = UserConstant.CREDENTIAL_REGEX, message = UserConstant.CREDENTIAL_FORMAT_MSG)
    private String checkPassword;

}

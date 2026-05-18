package com.mlinyun.usercenterbackend.model.dto.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaConstant;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 用户通过邮箱重置密码请求体.
 *
 * <p>
 * 用于用户忘记密码时，通过邮箱验证码验证身份后重置密码的请求参数
 * </p>
 */
@Data
@Schema(description = "通过邮箱重置密码请求参数")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class UserEmailResetPwdRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 7283946510392847561L;

    /**
     * 用户邮箱（用于身份验证）.
     */
    @Schema(description = "用户邮箱", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.EMAIL_NOT_NULL_MSG)
    @Email(message = UserConstant.EMAIL_FORMAT_MSG)
    private String userEmail;

    /**
     * 邮箱验证码.
     */
    @Schema(description = "邮箱验证码", example = "382956", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = CaptchaConstant.CODE_NOT_BLANK_MSG)
    @Size(min = CaptchaConstant.CODE_LENGTH, max = CaptchaConstant.CODE_LENGTH,
            message = CaptchaConstant.CODE_LENGTH_MSG)
    private String captchaCode;

    /**
     * 新的密码.
     */
    @Schema(description = "新的密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.PWD_NOT_NULL_MSG)
    @Size(min = UserConstant.PWD_MIN, max = UserConstant.PWD_MAX, message = UserConstant.PWD_LENGTH_MSG)
    @Pattern(regexp = UserConstant.PWD_REGEX, message = UserConstant.PWD_FORMAT_MSG)
    private String newPassword;

    /**
     * 校验密码.
     */
    @Schema(description = "校验密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.PWD_NOT_NULL_MSG)
    @Size(min = UserConstant.PWD_MIN, max = UserConstant.PWD_MAX, message = UserConstant.PWD_LENGTH_MSG)
    @Pattern(regexp = UserConstant.PWD_REGEX, message = UserConstant.PWD_FORMAT_MSG)
    private String checkPassword;

}

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
 * 邮箱注册请求体.
 *
 * <p>
 * 用于封装通过邮箱验证码注册时所需的请求参数
 * </p>
 */
@Data
@Schema(description = "邮箱注册请求参数")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class UserEmailRegisterRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 8371625049281734650L;

    /**
     * 邮箱地址.
     */
    @Schema(description = "邮箱地址", example = "user@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
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
     * 登录密码.
     */
    @Schema(description = "登录密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.PWD_NOT_NULL_MSG)
    @Size(min = UserConstant.PWD_MIN, max = UserConstant.PWD_MAX, message = UserConstant.PWD_LENGTH_MSG)
    @Pattern(regexp = UserConstant.PWD_REGEX, message = UserConstant.PWD_FORMAT_MSG)
    private String userPassword;

    /**
     * 校验密码.
     */
    @Schema(description = "校验密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.PWD_NOT_NULL_MSG)
    @Size(min = UserConstant.PWD_MIN, max = UserConstant.PWD_MAX, message = UserConstant.PWD_LENGTH_MSG)
    @Pattern(regexp = UserConstant.PWD_REGEX, message = UserConstant.PWD_FORMAT_MSG)
    private String checkPassword;

}

package com.mlinyun.usercenterbackend.model.dto.admin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

/**
 * 管理员添加用户请求体.
 *
 * <p>
 * 用于管理员添加用户的请求参数
 * </p>
 */
@Data
@Schema(description = "管理员添加用户请求体")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class AdminAddUserRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 1832581217864128304L;

    /**
     * 登录账号.
     */
    @Schema(description = "登录账号", example = "admin", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.ACCOUNT_NOT_NULL_MSG)
    @Size(min = UserConstant.ACCOUNT_MIN, max = UserConstant.ACCOUNT_MAX, message = UserConstant.ACCOUNT_LENGTH_MSG)
    @Pattern(regexp = UserConstant.ACCOUNT_REGEX, message = UserConstant.ACCOUNT_FORMAT_MSG)
    private String userAccount;

    /**
     * 登录密码.
     */
    @Schema(description = "登录密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.CREDENTIAL_NOT_NULL_MSG)
    @Size(min = UserConstant.PWD_MIN, max = UserConstant.PWD_MAX, message = UserConstant.CREDENTIAL_LENGTH_MSG)
    @Pattern(regexp = UserConstant.CREDENTIAL_REGEX, message = UserConstant.CREDENTIAL_FORMAT_MSG)
    private String userPassword;

    /**
     * 校验密码.
     */
    @Schema(description = "校验密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.CREDENTIAL_NOT_NULL_MSG)
    @Size(min = UserConstant.PWD_MIN, max = UserConstant.PWD_MAX, message = UserConstant.CREDENTIAL_LENGTH_MSG)
    @Pattern(regexp = UserConstant.CREDENTIAL_REGEX, message = UserConstant.CREDENTIAL_FORMAT_MSG)
    private String checkPassword;

    /**
     * 用户昵称.
     */
    @Schema(description = "用户昵称", example = "凌云")
    @Size(min = UserConstant.NICKNAME_MIN, max = UserConstant.NICKNAME_MAX, message = UserConstant.NICKNAME_LENGTH_MSG)
    private String userName;

    /**
     * 用户头像.
     */
    @Schema(description = "用户头像", example = "https://example.com/avatar.jpg")
    @URL(message = UserConstant.AVATAR_FORMAT_MSG)
    private String userAvatar;

    /**
     * 用户简介.
     */
    @Schema(description = "用户简介", example = "一名普通的程序员")
    @Size(max = UserConstant.PROFILE_MAX, message = UserConstant.PROFILE_LENGTH_MSG)
    private String userProfile;

    /**
     * 用户角色：admin/user.
     */
    @Schema(description = "用户角色", example = "user", defaultValue = "user", allowableValues = {"user", "admin"})
    @Pattern(regexp = UserConstant.ROLE_REGEX, message = UserConstant.ROLE_VALUE_MSG)
    private String userRole;

    /**
     * 性别（0女 1男 2未知）.
     */
    @Schema(description = "性别（0女 1男 2未知）", example = "2", defaultValue = "2", allowableValues = {"0", "1", "2"})
    @Min(value = UserConstant.GENDER_MIN, message = UserConstant.GENDER_RANGE_MSG)
    @Max(value = UserConstant.GENDER_MAX, message = UserConstant.GENDER_RANGE_MSG)
    private Integer userGender;

    /**
     * 手机号.
     */
    @Schema(description = "手机号", example = "13800000000")
    @Pattern(regexp = UserConstant.PHONE_REGEX, message = UserConstant.PHONE_FORMAT_MSG)
    private String userPhone;

    /**
     * 邮箱地址.
     */
    @Schema(description = "邮箱地址", example = "user13800@gmail.com")
    @Email(message = UserConstant.EMAIL_FORMAT_MSG)
    private String userEmail;

}

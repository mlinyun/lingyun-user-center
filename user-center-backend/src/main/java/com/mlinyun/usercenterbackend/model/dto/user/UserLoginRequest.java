package com.mlinyun.usercenterbackend.model.dto.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 用户登录请求体.
 *
 * <p>
 * 用于用户登录的请求参数
 * </p>
 */
@Data
@Schema(description = "用户登录请求参数")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class UserLoginRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 5656368489536039066L;

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

}

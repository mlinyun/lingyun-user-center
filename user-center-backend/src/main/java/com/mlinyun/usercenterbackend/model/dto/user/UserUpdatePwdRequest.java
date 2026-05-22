package com.mlinyun.usercenterbackend.model.dto.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mlinyun.usercenterbackend.constant.table.BaseFields;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 用户更新密码请求体.
 *
 * <p>
 * 用于用户更新密码的请求参数
 * </p>
 */
@Data
@Schema(description = "用户更新密码请求参数")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class UserUpdatePwdRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 6869808017455097456L;

    /**
     * 用户 ID.
     */
    @Schema(description = "用户主键 ID，使用雪花算法生成", example = "386738996358914048",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = BaseFields.ID_NOT_NULL_MSG)
    @PositiveOrZero(message = BaseFields.ID_INVALID_MSG)
    private Long id;

    /**
     * 原始密码.
     */
    @Schema(description = "原始密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.CREDENTIAL_NOT_NULL_MSG)
    @Size(min = UserConstant.PWD_MIN, max = UserConstant.PWD_MAX, message = UserConstant.CREDENTIAL_LENGTH_MSG)
    @Pattern(regexp = UserConstant.CREDENTIAL_REGEX, message = UserConstant.CREDENTIAL_FORMAT_MSG)
    private String rawPassword;

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

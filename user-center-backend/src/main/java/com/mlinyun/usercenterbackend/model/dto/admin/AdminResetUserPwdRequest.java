package com.mlinyun.usercenterbackend.model.dto.admin;

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
 * 管理员重置用户密码请求体.
 *
 * <p>
 * 用于管理员重置用户密码的请求参数
 * </p>
 */
@Data
@Schema(description = "管理员重置用户密码请求体")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class AdminResetUserPwdRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 2770492091766945808L;

    /**
     * 用户 ID.
     */
    @Schema(description = "用户主键 ID，使用雪花算法生成", example = "386738996358914048",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = BaseFields.ID_NOT_NULL_MSG)
    @PositiveOrZero(message = BaseFields.ID_INVALID_MSG)
    private Long id;

    /**
     * 新的密码.
     */
    @Schema(description = "新的密码", example = "Password..1234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = UserConstant.CREDENTIAL_NOT_NULL_MSG)
    @Size(min = UserConstant.PWD_MIN, max = UserConstant.PWD_MAX, message = UserConstant.CREDENTIAL_LENGTH_MSG)
    @Pattern(regexp = UserConstant.CREDENTIAL_REGEX, message = UserConstant.CREDENTIAL_FORMAT_MSG)
    private String newPassword;

}

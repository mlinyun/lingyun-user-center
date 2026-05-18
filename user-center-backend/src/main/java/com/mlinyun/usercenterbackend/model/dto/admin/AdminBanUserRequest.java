package com.mlinyun.usercenterbackend.model.dto.admin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mlinyun.usercenterbackend.constant.table.BaseFields;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 管理员封禁或解封用户请求体.
 *
 * <p>
 * 用于管理员封禁或解封用户的请求参数
 * </p>
 */
@Data
@Schema(description = "管理员封禁或解封用户请求体")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class AdminBanUserRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 2336192067171034272L;

    /**
     * 用户 ID.
     */
    @Schema(description = "用户主键 ID，使用雪花算法生成", example = "386738996358914048",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = BaseFields.ID_NOT_NULL_MSG)
    @PositiveOrZero(message = BaseFields.ID_INVALID_MSG)
    private Long id;

    /**
     * 状态（0正常 1封禁）.
     */
    @Schema(description = "状态（0正常 1封禁）", example = "0", defaultValue = "0", allowableValues = {"0", "1"})
    @Min(value = UserConstant.STATUS_MIN, message = UserConstant.STATUS_RANGE_MSG)
    @Max(value = UserConstant.STATUS_MAX, message = UserConstant.STATUS_RANGE_MSG)
    private Integer userStatus;

}

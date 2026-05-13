package com.mlinyun.usercenterbackend.common.dto;

import com.mlinyun.usercenterbackend.constant.table.BaseFields;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 通用获取或删除请求参数.
 *
 * <p>
 * 用于获取或者删除操作的请求参数，包含主键 ID
 * </p>
 */
@Data
@Schema(description = "获取或删除请求参数")
public class GetOrDeleteRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 1799978216342363898L;

    /**
     * 主键 ID.
     */
    @Schema(description = "主键 ID", example = "386738996358914048", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = BaseFields.ID_NOT_NULL_MSG)
    @PositiveOrZero(message = BaseFields.ID_INVALID_MSG)
    private Long id;

}

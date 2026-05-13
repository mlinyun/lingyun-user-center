package com.mlinyun.usercenterbackend.common.dto;

import com.mlinyun.usercenterbackend.constant.page.PageConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;

/**
 * 分页请求参数.
 *
 * <p>
 * 用于分页查询的请求参数，包含当前页码、每页记录数、排序字段和排序方式
 * </p>
 */
@Data
@Schema(description = "分页请求参数")
public class PageRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 5537409530019973566L;

    /**
     * 当前页码.
     */
    @Schema(description = "当前页码", example = "1", defaultValue = "1")
    @NotNull(message = PageConstant.PAGE_NUM_NOT_NULL_MSG)
    @Min(value = PageConstant.PAGE_NUM_MIN, message = PageConstant.PAGE_NUM_RANGE_MSG)
    private int pageNum = PageConstant.PAGE_NUM_MIN;

    /**
     * 每页记录数.
     */
    @Schema(description = "每页记录数", example = "10", defaultValue = "10")
    @NotNull(message = PageConstant.PAGE_SIZE_NOT_NULL_MSG)
    @Min(value = PageConstant.PAGE_SIZE_MIN, message = PageConstant.PAGE_SIZE_RANGE_MSG)
    @Max(value = PageConstant.PAGE_SIZE_MAX, message = PageConstant.PAGE_SIZE_RANGE_MSG)
    private int pageSize = PageConstant.PAGE_SIZE_DEFAULT;

    /**
     * 排序字段.
     */
    @Schema(description = "排序字段", example = "createTime")
    @Pattern(regexp = PageConstant.SORT_FIELD_REGEX, message = PageConstant.SORT_FIELD_FORMAT_MSG)
    private String sortField;

    /**
     * 排序方式（默认降序）.
     */
    @Schema(description = "排序方式", example = "descend", defaultValue = "descend",
            allowableValues = {"ascend", "descend"})
    @Pattern(regexp = PageConstant.SORT_ORDER_REGEX, message = PageConstant.SORT_ORDER_FORMAT_MSG)
    private String sortOrder = PageConstant.SORT_ORDER_DEFAULT;

}

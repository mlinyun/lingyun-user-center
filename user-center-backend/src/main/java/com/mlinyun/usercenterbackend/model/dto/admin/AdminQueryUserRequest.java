package com.mlinyun.usercenterbackend.model.dto.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mlinyun.usercenterbackend.common.dto.PageRequest;
import com.mlinyun.usercenterbackend.constant.table.BaseFields;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 管理员查询用户请求体.
 *
 * <p>
 * 用于管理员查询用户的请求参数，包含分页信息和多种筛选条件
 * </p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "管理员查询用户请求体")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class AdminQueryUserRequest extends PageRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 267998799929573384L;

    /**
     * 用户 ID.
     */
    @Schema(description = "用户主键 ID，使用雪花算法生成", example = "386738996358914048")
    @PositiveOrZero(message = BaseFields.ID_INVALID_MSG)
    private Long id;

    /**
     * 登录账号.
     */
    @Schema(description = "登录账号", example = "admin")
    @Size(min = UserConstant.ACCOUNT_MIN, max = UserConstant.ACCOUNT_MAX, message = UserConstant.ACCOUNT_LENGTH_MSG)
    @Pattern(regexp = UserConstant.ACCOUNT_REGEX, message = UserConstant.ACCOUNT_FORMAT_MSG)
    private String userAccount;

    /**
     * 用户昵称.
     */
    @Schema(description = "用户昵称", example = "凌云")
    @Size(min = UserConstant.NICKNAME_MIN, max = UserConstant.NICKNAME_MAX, message = UserConstant.NICKNAME_LENGTH_MSG)
    private String userName;

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

    /**
     * 状态（0正常 1封禁）.
     */
    @Schema(description = "状态（0正常 1封禁）", example = "0", defaultValue = "0", allowableValues = {"0", "1"})
    @Min(value = UserConstant.STATUS_MIN, message = UserConstant.STATUS_RANGE_MSG)
    @Max(value = UserConstant.STATUS_MAX, message = UserConstant.STATUS_RANGE_MSG)
    private Integer userStatus;

    /**
     * 创建起始时间.
     */
    @Schema(description = "创建起始时间", example = "2025-04-01 00:00:00")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createTimeStart;

    /**
     * 创建结束时间.
     */
    @Schema(description = "创建结束时间", example = "2025-04-30 23:59:59")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createTimeEnd;

}

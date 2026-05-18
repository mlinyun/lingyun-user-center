package com.mlinyun.usercenterbackend.model.dto.admin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mlinyun.usercenterbackend.constant.table.BaseFields;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

/**
 * 管理员更新用户信息请求体.
 *
 * <p>
 * 用于管理员更新用户信息的请求参数
 * </p>
 */
@Data
@Schema(description = "管理员更新用户信息请求体")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class AdminUpdateUserInfoRequest implements Serializable {

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

}

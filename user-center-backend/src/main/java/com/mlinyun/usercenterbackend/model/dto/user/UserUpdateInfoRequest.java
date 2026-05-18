package com.mlinyun.usercenterbackend.model.dto.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mlinyun.usercenterbackend.constant.table.BaseFields;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

/**
 * 用户更新用户信息请求体.
 *
 * <p>
 * 用于用户更新其个人信息的请求参数
 * </p>
 */
@Data
@Schema(description = "普通用户更新用户信息请求参数")
@JsonIgnoreProperties(ignoreUnknown = true) // 忽略未知字段
public class UserUpdateInfoRequest implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 5642469922385272312L;

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
     * 性别（0女 1男 2未知）.
     */
    @Schema(description = "性别（0女 1男 2未知）", example = "2", defaultValue = "2", allowableValues = {"0", "1", "2"})
    @Min(value = UserConstant.GENDER_MIN, message = UserConstant.GENDER_RANGE_MSG)
    @Max(value = UserConstant.GENDER_MAX, message = UserConstant.GENDER_RANGE_MSG)
    private Integer userGender;

}

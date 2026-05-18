package com.mlinyun.usercenterbackend.model.vo.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.mlinyun.usercenterbackend.constant.user.UserRoleEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * 用户视图（脱敏）.
 *
 * <p>
 * 用于展示用户信息的视图对象，包含用户的基本信息和角色信息
 * </p>
 */
@Data
@Schema(description = "用户视图（脱敏）")
public class UserVo implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 1954588107821370598L;

    /**
     * 用户主键 ID（雪花算法生成）.
     */
    @Schema(description = "用户主键ID，使用雪花算法生成", example = "386738996358914048")
    // 将 Long 类型序列化为字符串，以防止前端精度丢失
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    /**
     * 登录账号（唯一）.
     */
    @Schema(description = "登录账号，必须唯一", example = "LingYun")
    private String userAccount;

    /**
     * 用户昵称.
     */
    @Schema(description = "用户昵称", example = "凌云")
    private String userName;

    /**
     * 用户头像 URL.
     */
    @Schema(description = "用户头像 URL", example = "https://example.com/avatar.jpg")
    private String userAvatar;

    /**
     * 用户简介.
     */
    @Schema(description = "用户简介", example = "这是一个用户简介")
    private String userProfile;

    /**
     * 用户角色.
     */
    @Schema(description = "用户角色", example = "user", defaultValue = "user", allowableValues = {"user", "admin"})
    private UserRoleEnum userRole;

    /**
     * 性别（0: 女 1: 男 2: 未知）.
     */
    @Schema(description = "性别（0女 1男 2未知）", example = "2", defaultValue = "2", allowableValues = {"0", "1", "2"})
    private Integer userGender;

    /**
     * 手机号.
     */
    @Schema(description = "手机号", example = "13800000000")
    private String userPhone;

    /**
     * 手机号是否已验证（0: 未验证 1: 已验证）.
     */
    @Schema(description = "手机号是否已验证（0未验证 1已验证）", example = "0", defaultValue = "0", allowableValues = {"0", "1"})
    private Integer phoneVerified;

    /**
     * 邮箱地址.
     */
    @Schema(description = "邮箱地址", example = "user13800@gmail.com")
    private String userEmail;

    /**
     * 邮箱是否已验证（0: 未验证 1: 已验证）.
     */
    @Schema(description = "邮箱是否已验证（0未验证 1已验证）", example = "0", defaultValue = "0", allowableValues = {"0", "1"})
    private Integer emailVerified;

    /**
     * 状态（0: 正常 1: 封禁）.
     */
    @Schema(description = "状态（0正常 1封禁）", example = "0", defaultValue = "0", allowableValues = {"0", "1"})
    private Integer userStatus;

    /**
     * 编辑时间.
     */
    @Schema(description = "编辑时间", example = "2025-04-18 10:41:56")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime editTime;

    /**
     * 创建时间.
     */
    @Schema(description = "创建时间", example = "2025-04-18 10:41:56")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createTime;

    /**
     * 更新时间.
     */
    @Schema(description = "更新时间", example = "2025-04-18 17:44:25")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updateTime;

}

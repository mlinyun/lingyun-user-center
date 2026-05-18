package com.mlinyun.usercenterbackend.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.mlinyun.usercenterbackend.constant.table.TableNames;
import com.mlinyun.usercenterbackend.constant.user.UserRoleEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用户信息表 实体类.
 *
 * <p>
 * 该类主要用于映射数据库中的用户信息表，包含用户的基本信息、联系方式、状态等字段
 * </p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName(value = TableNames.USER)
public class User implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 5446660682181113253L;

    /**
     * 用户主键 ID（雪花算法生成）.
     */
    @Schema(description = "用户主键 ID，使用雪花算法生成", example = "386738996358914048")
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 登录账号（唯一）.
     */
    @Schema(description = "登录账号，必须唯一", example = "LingYun")
    private String userAccount;

    /**
     * 登录密码（加密存储）.
     */
    @Schema(description = "登录密码，加密存储", example = "Password..1234")
    private String userPassword;

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
    @Schema(description = "用户简介", example = "一名普通的程序员")
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
     * 邮箱地址.
     */
    @Schema(description = "邮箱地址", example = "user13800@gmail.com")
    private String userEmail;

    /**
     * 手机号是否已验证（0: 未验证 1: 已验证）.
     */
    @Schema(description = "手机号是否已验证（0未验证 1已验证）", example = "0", defaultValue = "0", allowableValues = {"0", "1"})
    private Integer phoneVerified;

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

    /**
     * 逻辑删除（0: 未删除, 时间戳: 删除时间）.
     */
    @Schema(description = "逻辑删除", example = "0", defaultValue = "0")
    @TableLogic(value = "0", delval = "UNIX_TIMESTAMP()")
    private Long isDelete;

}

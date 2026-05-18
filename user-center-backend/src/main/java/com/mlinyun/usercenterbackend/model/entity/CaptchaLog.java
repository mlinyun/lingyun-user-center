package com.mlinyun.usercenterbackend.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaSceneEnum;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaTypeEnum;
import com.mlinyun.usercenterbackend.constant.table.TableNames;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 验证码发送日志表 实体类.
 *
 * <p>
 * 该类用于映射数据库中的验证码发送日志表，记录每次验证码发送的元数据（不存储验证码明文）
 * </p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName(value = TableNames.CAPTCHA_LOG)
public class CaptchaLog implements Serializable {

    /**
     * 序列化版本号.
     */
    @Serial
    private static final long serialVersionUID = 1258887083920327802L;

    /**
     * 主键 ID（雪花算法生成）.
     */
    @Schema(description = "主键 ID，使用雪花算法生成", example = "386738996358914048")
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 发送目标（邮箱地址或手机号）.
     */
    @Schema(description = "发送目标（邮箱地址或手机号）", example = "user@example.com")
    private String target;

    /**
     * 验证码类型（EMAIL: 邮箱, SMS: 短信）.
     */
    @Schema(description = "验证码类型", example = "EMAIL", allowableValues = {"EMAIL", "SMS"})
    private CaptchaTypeEnum captchaType;

    /**
     * 验证码场景（REGISTER: 注册, LOGIN: 登录, RESET_PWD: 重置密码, BIND_CHANGE: 绑定/换绑）.
     */
    @Schema(description = "验证码场景", example = "REGISTER", allowableValues = {"REGISTER", "RESET_PWD", "BIND_CHANGE"})
    private CaptchaSceneEnum captchaScene;

    /**
     * 验证码状态（0: 已发送 1: 已验证 2: 已过期）.
     */
    @Schema(description = "状态（0已发送 1已验证 2已过期）", example = "0", allowableValues = {"0", "1", "2"})
    private Integer captchaStatus;

    /**
     * 请求 IP 地址.
     */
    @Schema(description = "请求 IP 地址", example = "127.0.0.1")
    private String ipAddress;

    /**
     * 发送时间.
     */
    @Schema(description = "发送时间", example = "2025-04-18 10:45:00")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime sendTime;

    /**
     * 验证时间.
     */
    @Schema(description = "验证时间", example = "2025-04-18 11:00:00")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime verifyTime;

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

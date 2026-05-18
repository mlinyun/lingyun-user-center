package com.mlinyun.usercenterbackend.constant.captcha;

import lombok.Getter;

/**
 * 验证码发送日志状态枚举.
 *
 * <p>
 * 定义验证码发送日志记录的状态，对应数据库 captcha_log 表的 status 字段
 * </p>
 */
@Getter
public enum CaptchaLogStatusEnum {

    SENT("已发送", 0),

    VERIFIED("已验证", 1),

    EXPIRED("已过期", 2);

    /**
     * 状态描述.
     */
    private final String desc;

    /**
     * 状态值.
     */
    private final Integer value;

    CaptchaLogStatusEnum(String desc, Integer value) {
        this.desc = desc;
        this.value = value;
    }

}

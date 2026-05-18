package com.mlinyun.usercenterbackend.constant.captcha;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 验证码类型枚举.
 *
 * <p>
 * 定义验证码的发送渠道类型，包括邮箱和短信
 * </p>
 */
@Getter
public enum CaptchaTypeEnum {

    EMAIL("邮箱验证码", "EMAIL"),

    SMS("短信验证码", "SMS");

    /**
     * 类型描述.
     */
    private final String desc;

    /**
     * 类型值.
     */
    @EnumValue // MyBatis-Plus 注解：标识此属性存储到数据库
    @JsonValue // Jackson 注解：序列化时返回该值
    private final String value;

    CaptchaTypeEnum(String desc, String value) {
        this.desc = desc;
        this.value = value;
    }

    /**
     * 根据值获取枚举.
     *
     * @param value 枚举值
     * @return 对应枚举，不存在则返回 null
     */
    public static CaptchaTypeEnum getByValue(String value) {
        if (ObjectUtil.isEmpty(value)) {
            return null;
        }
        for (CaptchaTypeEnum typeEnum : values()) {
            if (typeEnum.value.equals(value)) {
                return typeEnum;
            }
        }
        return null;
    }

}

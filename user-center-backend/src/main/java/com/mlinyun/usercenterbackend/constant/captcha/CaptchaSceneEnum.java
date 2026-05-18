package com.mlinyun.usercenterbackend.constant.captcha;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 验证码场景枚举.
 *
 * <p>
 * 定义验证码的使用场景，不同场景使用独立的 Redis Key，防止跨场景盗用
 * </p>
 */
@Getter
public enum CaptchaSceneEnum {

    REGISTER("用户注册", "REGISTER"),

    LOGIN("验证码登录", "LOGIN"),

    RESET_PWD("重置密码", "RESET_PWD"),

    BIND_CHANGE("绑定/换绑", "BIND_CHANGE");

    /**
     * 场景描述.
     */
    private final String desc;

    /**
     * 场景值.
     */
    @EnumValue // MyBatis-Plus 注解：标识此属性存储到数据库
    @JsonValue // Jackson 注解：序列化时返回该值
    private final String value;

    CaptchaSceneEnum(String desc, String value) {
        this.desc = desc;
        this.value = value;
    }

    /**
     * 根据值获取枚举.
     *
     * @param value 枚举值
     * @return 对应枚举，不存在则返回 null
     */
    public static CaptchaSceneEnum getByValue(String value) {
        if (ObjectUtil.isEmpty(value)) {
            return null;
        }
        for (CaptchaSceneEnum sceneEnum : values()) {
            if (sceneEnum.value.equals(value)) {
                return sceneEnum;
            }
        }
        return null;
    }

}

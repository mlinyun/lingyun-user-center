package com.mlinyun.usercenterbackend.constant.user;

import cn.hutool.core.util.ObjectUtil;
import lombok.Getter;

/**
 * 用户状态枚举类.
 *
 * <p>
 * 用于定义用户的状态类型，包括正常、封禁， 对应数据库用户表字段 userStatus（0: 正常, 1: 封禁）
 * </p>
 */
@Getter
public enum UserStatusEnum {

    NORMAL("正常", 0),

    BANNED("封禁", 1);

    /**
     * 状态名称.
     */
    private final String status;

    /**
     * 状态值.
     */
    private final Integer value;

    UserStatusEnum(String status, Integer value) {
        this.status = status;
        this.value = value;
    }

    /**
     * 根据状态值获取对应的枚举.
     *
     * @param value 状态值
     * @return 对应的枚举，如果没有匹配的枚举则返回 null
     */
    public static UserStatusEnum getStatusEnumByValue(Integer value) {
        if (ObjectUtil.isEmpty(value)) {
            return null;
        }
        for (UserStatusEnum userStatusEnum : UserStatusEnum.values()) {
            if (userStatusEnum.value.equals(value)) {
                return userStatusEnum;
            }
        }
        return null;
    }

    /**
     * 根据状态值获取状态名称.
     *
     * @param value 状态值
     * @return 状态名称，如果没有匹配的则返回 null
     */
    public static String getStatusByValue(Integer value) {
        UserStatusEnum statusEnum = getStatusEnumByValue(value);
        return statusEnum != null ? statusEnum.getStatus() : null;
    }

    /**
     * 判断是否为有效状态值.
     *
     * @param value 状态值
     * @return 是否为有效状态值
     */
    public static boolean isValidValue(Integer value) {
        return getStatusEnumByValue(value) != null;
    }

    /**
     * 判断是否为正常状态.
     *
     * @param value 状态值
     * @return 是否为正常状态
     */
    public static boolean isNormal(Integer value) {
        return NORMAL.value.equals(value);
    }

    /**
     * 判断是否为封禁状态.
     *
     * @param value 状态值
     * @return 是否为封禁状态
     */
    public static boolean isBanned(Integer value) {
        return BANNED.value.equals(value);
    }

}

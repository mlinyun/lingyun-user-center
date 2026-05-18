package com.mlinyun.usercenterbackend.constant.user;

import cn.hutool.core.util.ObjectUtil;
import lombok.Getter;

/**
 * 用户性别枚举类.
 *
 * <p>
 * 用于定义用户的性别类型，包括女、男、未知， 对应数据库用户表字段 userGender（0: 女, 1: 男, 2: 未知）
 * </p>
 */
@Getter
public enum UserGenderEnum {

    FEMALE("女", 0),

    MALE("男", 1),

    UNKNOWN("未知", 2);

    /**
     * 性别名称.
     */
    private final String gender;

    /**
     * 性别值.
     */
    private final Integer value;

    UserGenderEnum(String gender, Integer value) {
        this.gender = gender;
        this.value = value;
    }

    /**
     * 根据性别值获取对应的枚举.
     *
     * @param value 性别值
     * @return 对应的枚举，如果没有匹配的枚举则返回 null
     */
    public static UserGenderEnum getGenderEnumByValue(Integer value) {
        if (ObjectUtil.isEmpty(value)) {
            return null;
        }
        for (UserGenderEnum userGenderEnum : UserGenderEnum.values()) {
            if (userGenderEnum.value.equals(value)) {
                return userGenderEnum;
            }
        }
        return null;
    }

    /**
     * 根据性别值获取性别名称.
     *
     * @param value 性别值
     * @return 性别名称，如果没有匹配的则返回 null
     */
    public static String getGenderByValue(Integer value) {
        UserGenderEnum genderEnum = getGenderEnumByValue(value);
        return genderEnum != null ? genderEnum.getGender() : null;
    }

    /**
     * 判断是否为有效性别值.
     *
     * @param value 性别值
     * @return 是否为有效性别值
     */
    public static boolean isValidValue(Integer value) {
        return getGenderEnumByValue(value) != null;
    }

}

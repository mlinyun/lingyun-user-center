package com.mlinyun.usercenterbackend.constant.user;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 用户角色枚举类.
 *
 * <p>
 * 用于定义用户的角色类型，包括普通用户和管理员， 对应数据库用户表字段 userRole （user: 普通用户, admin: 管理员）
 * </p>
 */
@Getter
public enum UserRoleEnum {

    USER("普通用户", "user"),

    ADMIN("管理员", "admin");

    /**
     * 角色名称.
     */
    private final String role;

    /**
     * 角色值.
     */
    @EnumValue // MyBatis-Plus 注解：标识此属性存储到数据库
    @JsonValue // Jackson 注解：序列化时返回该值
    private final String value;

    /**
     * 构造函数.
     *
     * @param role 角色
     * @param value 角色值
     */
    UserRoleEnum(String role, String value) {
        this.role = role;
        this.value = value;
    }

    /**
     * 根据角色值获取对应的枚举.
     *
     * @param value 角色值
     * @return 对应的枚举，如果没有匹配的枚举则返回 null
     */
    public static UserRoleEnum getRoleEnumByValue(String value) {
        if (ObjectUtil.isEmpty(value)) {
            return null;
        }
        for (UserRoleEnum userRoleEnum : UserRoleEnum.values()) {
            if (userRoleEnum.value.equals(value)) {
                return userRoleEnum;
            }
        }
        return null;
    }

    /**
     * 根据角色值获取对应的角色名称.
     *
     * @param value 角色值
     * @return 对应的角色名称，如果没有匹配的枚举则返回 null
     */
    public static String getRoleByValue(String value) {
        UserRoleEnum userRoleEnum = getRoleEnumByValue(value);
        return userRoleEnum != null ? userRoleEnum.getRole() : null;
    }

    /**
     * 验证角色值是否合法.
     *
     * @param value 角色值
     * @return 如果角色值合法则返回 true，否则返回 false
     */
    public static boolean isValidValue(String value) {
        return getRoleEnumByValue(value) != null;
    }

}

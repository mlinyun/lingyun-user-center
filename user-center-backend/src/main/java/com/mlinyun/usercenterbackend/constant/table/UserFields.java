package com.mlinyun.usercenterbackend.constant.table;

/**
 * 用户表字段常量类.
 *
 * <p>
 * 该类定义了用户表（user）中各个字段的常量，用于在代码中统一引用这些字段，避免硬编码字符串，提高代码的可维护性和可读性。
 * </p>
 */
public final class UserFields {

    /**
     * 私有构造函数，防止实例化.
     */
    private UserFields() {
        throw new IllegalStateException("Utility class");
    }

    // 表名
    /**
     * 用户表名.
     */
    public static final String TABLE_NAME = TableNames.USER;

    // 字段名
    /**
     * 登录账号（唯一）.
     */
    public static final String USER_ACCOUNT = "userAccount";

    /**
     * 登录密码（加密存储）.
     */
    public static final String USER_PASSWORD = "userPassword";

    /**
     * 用户昵称.
     */
    public static final String USER_NAME = "userName";

    /**
     * 用户头像 URL.
     */
    public static final String USER_AVATAR = "userAvatar";

    /**
     * 用户简介.
     */
    public static final String USER_PROFILE = "userProfile";

    /**
     * 用户角色（user: 普通用户, admin: 管理员）.
     */
    public static final String USER_ROLE = "userRole";

    /**
     * 性别（0: 女, 1: 男, 2: 未知）.
     */
    public static final String USER_GENDER = "userGender";

    /**
     * 手机号.
     */
    public static final String USER_PHONE = "userPhone";

    /**
     * 邮箱地址.
     */
    public static final String USER_EMAIL = "userEmail";

    /**
     * 手机验证状态.
     */
    public static final String PHONE_VERIFIED = "phoneVerified";

    /**
     * 邮箱验证状态.
     */
    public static final String EMAIL_VERIFIED = "emailVerified";

    /**
     * 状态（0: 正常, 1: 封禁）.
     */
    public static final String USER_STATUS = "userStatus";

}

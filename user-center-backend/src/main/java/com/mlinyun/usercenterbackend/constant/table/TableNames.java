package com.mlinyun.usercenterbackend.constant.table;

/**
 * 数据库表名常量.
 *
 * <p>
 * 该类定义了数据库中使用的表名常量，集中管理所有表名
 * </p>
 */
public final class TableNames {

    /**
     * 私有构造函数，防止实例化.
     */
    private TableNames() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * 用户相关表.
     */
    public static final String USER = "user";

    /**
     * 验证码发送日志表.
     */
    public static final String CAPTCHA_LOG = "captcha_log";

}

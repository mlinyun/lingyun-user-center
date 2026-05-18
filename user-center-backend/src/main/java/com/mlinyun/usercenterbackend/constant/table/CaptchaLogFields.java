package com.mlinyun.usercenterbackend.constant.table;

/**
 * 验证码发送日志表字段常量类.
 *
 * <p>
 * 该类定义了验证码发送日志表（captcha_log）的字段名称常量，便于在代码中使用这些字段时避免硬编码字符串，提高代码的可维护性和可读性
 * </p>
 */
public final class CaptchaLogFields {

    /**
     * 私有构造函数，防止实例化.
     */
    private CaptchaLogFields() {
        throw new IllegalStateException("Utility class");
    }

    // 表名
    /**
     * 验证码发送日志表名.
     */
    public static final String TABLE_NAME = TableNames.CAPTCHA_LOG;

    // 字段名

    /**
     * 发送目标（邮箱或手机号）.
     */
    public static final String TARGET = "target";

    /**
     * 验证码类型（EMAIL: 邮箱, SMS: 短信）.
     */
    public static final String CAPTCHA_TYPE = "captchaType";

    /**
     * 验证码场景（REGISTER: 注册, RESET_PWD: 重置密码, BIND_CHANGE: 绑定/换绑）.
     */
    public static final String CAPTCHA_SCENE = "captchaScene";

    /**
     * 状态（0: 已发送 1: 已验证 2: 已过期）.
     */
    public static final String CAPTCHA_STATUS = "captchaStatus";

    /**
     * 请求 IP 地址.
     */
    public static final String IP_ADDRESS = "ipAddress";

    /**
     * 发送时间.
     */
    public static final String SEND_TIME = "sendTime";

    /**
     * 验证时间.
     */
    public static final String VERIFY_TIME = "verifyTime";

}

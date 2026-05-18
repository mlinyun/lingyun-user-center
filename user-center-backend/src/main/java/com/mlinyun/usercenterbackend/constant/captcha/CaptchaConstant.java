package com.mlinyun.usercenterbackend.constant.captcha;

/**
 * 验证码常量类.
 *
 * <p>
 * 用于存放验证码相关的常量，包括 Redis Key 前缀、验证码长度、有效期和限流参数
 * </p>
 */
public final class CaptchaConstant {
    /**
     * 私有构造函数，防止实例化.
     */
    private CaptchaConstant() {
        throw new IllegalStateException("Utility class");
    }

    // =============== Redis Key 前缀 ===============

    /**
     * 验证码存储 Key 前缀.
     *
     * <p>
     * 完整格式: user-center:captcha:{scene}:{type}:{target}
     * </p>
     */
    public static final String CAPTCHA_KEY_PREFIX = "user-center:captcha:";

    /**
     * 发送锁 Key 前缀（防止短时间重复发送）.
     *
     * <p>
     * 完整格式: user-center:captcha:lock:{type}:{target}
     * </p>
     */
    public static final String CAPTCHA_LOCK_PREFIX = "user-center:captcha:lock:";

    /**
     * 小时级限流 Key 前缀.
     *
     * <p>
     * 完整格式: user-center:captcha:limit:{type}:{target}
     * </p>
     */
    public static final String CAPTCHA_LIMIT_PREFIX = "user-center:captcha:limit:";

    /**
     * 验证次数计数 Key 前缀.
     *
     * <p>
     * 完整格式: user-center:captcha:attempt:{scene}:{type}:{target}
     * </p>
     */
    public static final String CAPTCHA_ATTEMPT_PREFIX = "user-center:captcha:attempt:";

    // =============== 验证码参数 ===============

    /**
     * 验证码长度（6 位数字）.
     */
    public static final int CODE_LENGTH = 6;

    /**
     * 验证码有效期（秒）: 5 分钟.
     */
    public static final long CODE_TTL_SECONDS = 300L;

    /**
     * 发送锁有效期（秒）: 60 秒内不可重复发送.
     */
    public static final long LOCK_TTL_SECONDS = 60L;

    /**
     * 小时级限流窗口（秒）: 1 小时.
     */
    public static final long LIMIT_WINDOW_SECONDS = 3600L;

    /**
     * 小时级最大发送次数: 5 次/小时.
     */
    public static final int LIMIT_MAX_COUNT = 5;

    /**
     * 单个验证码最大验证次数: 5 次.
     */
    public static final int MAX_VERIFY_ATTEMPTS = 5;

    // =============== 提示信息 ===============

    /**
     * 验证码发送成功提示.
     */
    public static final String CODE_SENT_SUCCESS = "验证码发送成功";

    /**
     * 发送过于频繁提示.
     */
    public static final String CODE_SEND_TOO_FREQUENT = "操作过于频繁，请 60 秒后再试";

    /**
     * 发送次数超限提示.
     */
    public static final String CODE_SEND_LIMIT_EXCEEDED = "发送次数已达上限，请 1 小时后再试";

    /**
     * 验证码错误或已过期提示.
     */
    public static final String CODE_INVALID = "验证码错误或已过期";

    /**
     * 验证次数过多提示.
     */
    public static final String CODE_ATTEMPTS_EXCEEDED = "验证次数过多，验证码已失效，请重新获取";

    /**
     * 验证码不能为空提示.
     */
    public static final String CODE_NOT_BLANK_MSG = "验证码不能为空";

    /**
     * 验证码长度提示.
     */
    public static final String CODE_LENGTH_MSG = "验证码长度必须为 6 位";

    /**
     * 验证码场景不能为空提示.
     */
    public static final String SCENE_NOT_NULL_MSG = "验证码场景不能为空";

    /**
     * 验证码类型不能为空提示.
     */
    public static final String TYPE_NOT_NULL_MSG = "验证码类型不能为空";

    /**
     * 发送目标不能为空提示.
     */
    public static final String TARGET_NOT_BLANK_MSG = "发送目标不能为空";

    /**
     * 不支持的验证码类型提示.
     */
    public static final String UNSUPPORTED_TYPE = "不支持的验证码类型";

    /**
     * 不支持的验证码场景提示.
     */
    public static final String UNSUPPORTED_SCENE = "不支持的验证码场景";

}

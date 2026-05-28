package com.mlinyun.usercenterbackend.utils;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.crypto.digest.BCrypt;
import com.mlinyun.usercenterbackend.common.ErrorCode;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import com.mlinyun.usercenterbackend.exception.BusinessException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;

/**
 * 密码工具类.
 *
 * <p>
 * 基于 BCrypt 算法，提供密码加密、验证、强度校验与随机生成功能
 * </p>
 *
 * <p>
 * <b>BCrypt 特性：</b>自适应哈希、自动随机盐、固定 60 字符输出、抗暴力破解
 * </p>
 */
@Slf4j
public final class PasswordUtils {
    /**
     * 私有构造函数，防止实例化.
     */
    private PasswordUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    // ==================== BCrypt 配置 ====================

    /**
     * 默认工作因子（推荐 12，约 280ms；高安全场景用 14）.
     */
    private static final int DEFAULT_STRENGTH = 12;

    /**
     * 工作因子合法范围（4-31，越高越安全但越慢）.
     */
    private static final int STRENGTH_MIN = 4;
    private static final int STRENGTH_MAX = 31;

    // ==================== 密码长度限制 ====================

    private static final int LEN_MIN = UserConstant.PWD_MIN;
    private static final int LEN_MAX = UserConstant.PWD_MAX;
    private static final int LEN_DEFAULT = UserConstant.PWD_DEFAULT;

    // ==================== 强度等级 ====================

    /**
     * 弱密码.
     */
    public static final int LEVEL_WEAK = 0;
    /**
     * 中等强度.
     */
    public static final int LEVEL_MEDIUM = 1;
    /**
     * 强密码.
     */
    public static final int LEVEL_STRONG = 2;

    // ==================== 字符集 ====================

    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL = "~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?";
    private static final String ALL = UPPER + LOWER + DIGITS + SPECIAL;

    // ==================== 强度正则 ====================

    /**
     * 中等：字母 + 数字，长度 8-20，可含特殊字符.
     */
    private static final Pattern PATTERN_MEDIUM =
            Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d~`!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?]{" + LEN_MIN
                    + "," + LEN_MAX + "}$");

    /**
     * 强：大写 + 小写 + 数字 + 特殊字符，长度 8-20.
     */
    private static final Pattern PATTERN_STRONG =
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[~`!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?])"
                    + "[A-Za-z\\d~`!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?]{" + LEN_MIN + "," + LEN_MAX + "}$");

    // ==================== 弱密码字典 ====================

    private static final String[] WEAK_PASSWORDS =
            {"123456", "12345678", "123456789", "123123", "111111", "000000", "654321", "666666", "888888", "password",
                    "qwerty", "qwerty123", "abc123", "1qaz2wsx", "admin", "admin123", "root", "asdfgh", "zxcvbn"};

    private static final SecureRandom RANDOM = new SecureRandom();

    // ==================== 加密 ====================

    /**
     * 加密密码（使用默认工作因子 12）.
     *
     * @param raw 原始密码（非空）
     * @return BCrypt 加密结果（60字符）
     */
    public static String encrypt(String raw) {
        return encrypt(raw, DEFAULT_STRENGTH);
    }

    /**
     * 加密密码（指定工作因子）.
     *
     * @param raw 原始密码（非空）
     * @param strength 工作因子（4-31，推荐 12）
     * @return BCrypt 加密结果
     */
    public static String encrypt(String raw, int strength) {
        if (CharSequenceUtil.isBlank(raw)) {
            throw new IllegalArgumentException("密码不能为空");
        }
        if (strength < STRENGTH_MIN || strength > STRENGTH_MAX) {
            log.warn("工作因子 {} 超出范围，回退至默认值 {}", strength, DEFAULT_STRENGTH);
            strength = DEFAULT_STRENGTH;
        }
        try {
            String encrypted = BCrypt.hashpw(raw, BCrypt.gensalt(strength));
            log.debug("密码加密成功，strength={}", strength);
            return encrypted;
        } catch (Exception e) {
            log.error("密码加密异常", e);
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "密码加密失败");
        }
    }

    // ==================== 验证 ====================

    /**
     * 验证密码是否与加密串匹配.
     *
     * @param raw 原始密码
     * @param hashed 数据库中的 BCrypt 加密串
     * @return true=匹配
     */
    public static boolean verify(String raw, String hashed) {
        if (CharSequenceUtil.isBlank(raw) || CharSequenceUtil.isBlank(hashed)) {
            log.warn("密码验证参数为空");
            return false;
        }
        try {
            boolean match = BCrypt.checkpw(raw, hashed);
            log.debug("密码验证结果: {}", match);
            return match;
        } catch (Exception e) {
            log.error("密码验证异常", e);
            return false;
        }
    }

    // ==================== 强度校验 ====================

    /**
     * 基础校验：长度 8-20 位.
     */
    public static boolean isValidBasic(String pwd) {
        if (CharSequenceUtil.isBlank(pwd)) {
            return false;
        }
        return pwd.length() >= LEN_MIN && pwd.length() <= LEN_MAX;
    }

    /**
     * 中等校验：字母 + 数字，长度 8-20，可含特殊字符.
     */
    public static boolean isValidMedium(String pwd) {
        return !CharSequenceUtil.isBlank(pwd) && PATTERN_MEDIUM.matcher(pwd).matches();
    }

    /**
     * 强校验：大小写字母 + 数字 + 特殊字符，长度 8-20.
     */
    public static boolean isValidStrong(String pwd) {
        return !CharSequenceUtil.isBlank(pwd) && PATTERN_STRONG.matcher(pwd).matches();
    }

    /**
     * 检测是否为弱密码（命中字典或含连续重复字符）.
     */
    public static boolean isWeak(String pwd) {
        if (CharSequenceUtil.isBlank(pwd)) {
            return true;
        }
        String lower = pwd.toLowerCase();
        for (String weak : WEAK_PASSWORDS) {
            if (lower.contains(weak)) {
                log.warn("命中弱密码特征: {}", weak);
                return true;
            }
        }
        // 连续重复字符（如 aaa, 111）
        if (pwd.matches(".*(\\w)\\1{2,}.*")) {
            log.warn("含连续重复字符");
            return true;
        }
        return false;
    }

    /**
     * 获取密码强度等级.
     *
     * @return {@link #LEVEL_WEAK} / {@link #LEVEL_MEDIUM} / {@link #LEVEL_STRONG}
     */
    public static int strengthLevel(String pwd) {
        if (isWeak(pwd) || !isValidBasic(pwd)) {
            return LEVEL_WEAK;
        }
        if (isValidStrong(pwd)) {
            return LEVEL_STRONG;
        }
        if (isValidMedium(pwd)) {
            return LEVEL_MEDIUM;
        }
        return LEVEL_WEAK;
    }

    /**
     * 获取密码强度描述（弱 / 中等 / 强）.
     */
    public static String strengthDesc(String pwd) {
        return switch (strengthLevel(pwd)) {
            case LEVEL_STRONG -> "强";
            case LEVEL_MEDIUM -> "中等";
            default -> "弱";
        };
    }

    // ==================== 随机密码生成 ====================

    /**
     * 生成默认长度（16位）随机强密码.
     */
    public static String generate() {
        return generate(LEN_DEFAULT);
    }

    /**
     * 生成指定长度的随机强密码.
     *
     * <p>
     * 确保包含大写、小写、数字、特殊字符各至少1位，并通过强度校验。
     *
     * @param length 长度（最小8）
     * @return 随机强密码
     */
    public static String generate(int length) {
        if (length < LEN_MIN) {
            throw new IllegalArgumentException("密码长度不能小于 " + LEN_MIN);
        }

        String pwd;
        int retry = 0;
        do {
            // 各类字符至少出现一次
            List<Character> chars = new ArrayList<>(length);
            chars.add(pick(UPPER));
            chars.add(pick(LOWER));
            chars.add(pick(DIGITS));
            chars.add(pick(SPECIAL));
            for (int i = chars.size(); i < length; i++) {
                chars.add(pick(ALL));
            }
            Collections.shuffle(chars, RANDOM);
            StringBuilder sb = new StringBuilder(length);
            chars.forEach(sb::append);
            pwd = sb.toString();
            retry++;
        } while (!isValidStrong(pwd) && retry < 10); // 兜底：确保结果符合强策略

        return pwd;
    }

    /**
     * 从字符池中随机取一个字符.
     *
     * @param pool 字符池字符串
     * @return 随机选中的字符
     */
    private static char pick(String pool) {
        return pool.charAt(RANDOM.nextInt(pool.length()));
    }
}

package com.mlinyun.usercenterbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mlinyun.usercenterbackend.common.ErrorCode;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaConstant;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaLogStatusEnum;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaSceneEnum;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaTypeEnum;
import com.mlinyun.usercenterbackend.constant.table.CaptchaLogFields;
import com.mlinyun.usercenterbackend.exception.BusinessException;
import com.mlinyun.usercenterbackend.mapper.CaptchaLogMapper;
import com.mlinyun.usercenterbackend.model.entity.CaptchaLog;
import com.mlinyun.usercenterbackend.service.CaptchaService;
import com.mlinyun.usercenterbackend.service.EmailService;
import com.mlinyun.usercenterbackend.service.SmsService;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

/**
 * 验证码服务实现.
 *
 * <p>
 * 使用 Redis 实现验证码的存储、限流和校验，同时将发送记录写入数据库用于安全审计。 验证码明文仅存储在 Redis 中（带 TTL 自动过期），数据库中不保存验证码明文。
 * </p>
 */
@Slf4j
@Service
public class CaptchaServiceImpl extends ServiceImpl<CaptchaLogMapper, CaptchaLog> implements CaptchaService {

    /**
     * 生成验证码的随机数生成器，使用 SecureRandom 提供更强的随机性保障.
     */
    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Redis 字符串模板.
     */
    private final StringRedisTemplate redisTemplate;

    /**
     * 邮件服务.
     */
    private final EmailService emailService;

    /**
     * 短信服务.
     */
    private final SmsService smsService;

    /**
     * 构造函数，注入依赖.
     *
     * @param redisTemplate {@linkplain StringRedisTemplate Redis 字符串模板}
     * @param emailService {@linkplain EmailService 邮件服务}
     */
    @Autowired
    public CaptchaServiceImpl(StringRedisTemplate redisTemplate, EmailService emailService, SmsService smsService) {
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    /**
     * 发送验证码.
     *
     * @param type 验证码类型（邮箱/短信）
     * @param scene 使用场景（注册/重置密码/绑定）
     * @param target 发送目标（邮箱地址或手机号）
     * @param ipAddress 请求者 IP 地址
     */
    @Override
    public void sendCaptcha(CaptchaTypeEnum type, CaptchaSceneEnum scene, String target, String ipAddress) {
        // 1. 检查 60 秒发送锁（防止短时间内重复发送）
        String lockKey = buildLockKey(type, target);
        Boolean locked = redisTemplate.hasKey(lockKey);
        if (Boolean.TRUE.equals(locked)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, CaptchaConstant.CODE_SEND_TOO_FREQUENT);
        }

        // 2. 检查小时级限流（同一目标每小时最多 5 次）
        String limitKey = buildLimitKey(type, target);
        String limitVal = redisTemplate.opsForValue().get(limitKey);
        int count = (limitVal != null) ? Integer.parseInt(limitVal) : 0;
        if (count >= CaptchaConstant.LIMIT_MAX_COUNT) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, CaptchaConstant.CODE_SEND_LIMIT_EXCEEDED);
        }

        // 3. 生成 6 位数字验证码
        String code = generateCode();

        // 4. 存储验证码到 Redis（带 5 分钟 TTL）
        String captchaKey = buildCaptchaKey(scene, type, target);
        redisTemplate.opsForValue().set(captchaKey, code, CaptchaConstant.CODE_TTL_SECONDS, TimeUnit.SECONDS);

        // 5. 设置 60 秒发送锁
        redisTemplate.opsForValue().set(lockKey, "1", CaptchaConstant.LOCK_TTL_SECONDS, TimeUnit.SECONDS);

        // 6. 更新小时级发送计数
        redisTemplate.opsForValue().increment(limitKey);
        if (count == 0) {
            redisTemplate.expire(limitKey, CaptchaConstant.LIMIT_WINDOW_SECONDS, TimeUnit.SECONDS);
        }

        // 7. 清除之前的验证次数计数
        String attemptKey = buildAttemptKey(scene, type, target);
        redisTemplate.delete(attemptKey);

        // 8. 根据类型调用对应的发送服务
        if (CaptchaTypeEnum.EMAIL.equals(type)) {
            emailService.sendCaptchaEmail(target, code, scene.getDesc());
        } else if (CaptchaTypeEnum.SMS.equals(type)) {
            smsService.sendCaptchaSms(target, code, scene);
        } else {
            // 理论上不应该出现其他类型，如果出现则抛出异常
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "不支持的验证码类型");
        }

        // 9. 写入发送日志到数据库（用于安全审计）
        saveSendLog(type, scene, target, ipAddress);

        log.info("验证码已发送: type={}, scene={}, target={}", type.getValue(), scene.getValue(), maskTarget(target));
    }

    /**
     * 校验验证码（失败时直接抛异常）.
     *
     * @param type 验证码类型
     * @param scene 使用场景
     * @param target 发送目标
     * @param code 用户输入的验证码
     */
    @Override
    public void verifyCaptchaOrThrow(CaptchaTypeEnum type, CaptchaSceneEnum scene, String target, String code) {
        // 1. 检查验证次数是否超限
        String attemptKey = buildAttemptKey(scene, type, target);
        String attemptVal = redisTemplate.opsForValue().get(attemptKey);
        int attempts = (attemptVal != null) ? Integer.parseInt(attemptVal) : 0;
        if (attempts >= CaptchaConstant.MAX_VERIFY_ATTEMPTS) {
            invalidateCaptcha(type, scene, target);
            throw new BusinessException(ErrorCode.PARAMS_ERROR, CaptchaConstant.CODE_ATTEMPTS_EXCEEDED);
        }

        // 2. 获取 Redis 中存储的验证码
        String captchaKey = buildCaptchaKey(scene, type, target);
        String storedCode = redisTemplate.opsForValue().get(captchaKey);

        if (storedCode == null || !storedCode.equals(code)) {
            // 验证失败，递增验证次数
            redisTemplate.opsForValue().increment(attemptKey);
            if (attempts == 0) {
                redisTemplate.expire(attemptKey, CaptchaConstant.CODE_TTL_SECONDS, TimeUnit.SECONDS);
            }
            throw new BusinessException(ErrorCode.PARAMS_ERROR, CaptchaConstant.CODE_INVALID);
        }

        // 3. 验证成功，删除验证码和验证次数计数（一码一用）
        redisTemplate.delete(captchaKey);
        redisTemplate.delete(attemptKey);

        // 4. 更新日志状态为"已验证"
        updateLogStatus(type, scene, target, CaptchaLogStatusEnum.VERIFIED);

        log.info("验证码校验通过: type={}, scene={}, target={}", type.getValue(), scene.getValue(), maskTarget(target));
    }

    /**
     * 手动注销验证码.
     *
     * <p>
     * 清除 Redis 中的验证码和验证次数计数，同时更新数据库日志状态为"已过期"
     * </p>
     *
     * @param type 验证码类型
     * @param scene 使用场景
     * @param target 发送目标
     */
    @Override
    public void invalidateCaptcha(CaptchaTypeEnum type, CaptchaSceneEnum scene, String target) {
        redisTemplate.delete(buildCaptchaKey(scene, type, target));
        redisTemplate.delete(buildAttemptKey(scene, type, target));

        // 同步更新数据库日志状态为"已过期"
        updateLogStatus(type, scene, target, CaptchaLogStatusEnum.EXPIRED);
    }

    // ==================== 数据库日志操作 ====================

    /**
     * 保存发送日志到数据库.
     *
     * @param type 验证码类型
     * @param scene 使用场景
     * @param target 发送目标
     * @param ipAddress 请求者 IP 地址
     */
    private void saveSendLog(CaptchaTypeEnum type, CaptchaSceneEnum scene, String target, String ipAddress) {
        try {
            CaptchaLog captchaLog = new CaptchaLog();
            captchaLog.setCaptchaType(CaptchaTypeEnum.getByValue(type.getValue()));
            captchaLog.setCaptchaScene(CaptchaSceneEnum.getByValue(scene.getValue()));
            captchaLog.setTarget(target);
            captchaLog.setIpAddress(ipAddress);
            captchaLog.setCaptchaStatus(CaptchaLogStatusEnum.SENT.getValue());
            captchaLog.setSendTime(LocalDateTime.now());
            boolean saveResult = this.save(captchaLog);
            if (!saveResult) {
                log.warn("验证码发送日志保存失败: target={}", maskTarget(target));
            }
        } catch (Exception e) {
            // 日志写入失败不应影响验证码发送的主流程
            log.error("验证码发送日志写入失败: target={}", maskTarget(target), e);
        }
    }

    /**
     * 更新日志状态.
     *
     * @param type 验证码类型
     * @param scene 使用场景
     * @param target 发送目标
     */
    private void updateLogStatus(CaptchaTypeEnum type, CaptchaSceneEnum scene, String target,
            CaptchaLogStatusEnum newStatus) {
        try {
            // 查找该目标最近一条"已发送"状态的日志并更新
            QueryWrapper<CaptchaLog> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq(CaptchaLogFields.TARGET, target).eq(CaptchaLogFields.CAPTCHA_TYPE, type.getValue())
                    .eq(CaptchaLogFields.CAPTCHA_SCENE, scene.getValue())
                    .eq(CaptchaLogFields.CAPTCHA_STATUS, CaptchaLogStatusEnum.SENT.getValue());
            queryWrapper.orderByDesc(CaptchaLogFields.SEND_TIME).last("LIMIT 1");
            CaptchaLog latestLog = this.baseMapper.selectOne(queryWrapper);
            if (latestLog != null) {
                latestLog.setCaptchaStatus(newStatus.getValue());
                latestLog.setVerifyTime(LocalDateTime.now());
                this.baseMapper.updateById(latestLog);
            } else {
                log.info("未找到对应的验证码日志进行状态更新: target={}", maskTarget(target));
            }
        } catch (Exception e) {
            log.error("验证码日志状态更新失败: target={}", maskTarget(target), e);
        }
    }

    // ==================== Redis Key 构建 ====================

    /**
     * 构建验证码存储 Key.
     */
    private String buildCaptchaKey(CaptchaSceneEnum scene, CaptchaTypeEnum type, String target) {
        return CaptchaConstant.CAPTCHA_KEY_PREFIX + scene.getValue() + ":" + type.getValue() + ":" + target;
    }

    /**
     * 构建发送锁 Key.
     */
    private String buildLockKey(CaptchaTypeEnum type, String target) {
        return CaptchaConstant.CAPTCHA_LOCK_PREFIX + type.getValue() + ":" + target;
    }

    /**
     * 构建限流计数 Key.
     */
    private String buildLimitKey(CaptchaTypeEnum type, String target) {
        return CaptchaConstant.CAPTCHA_LIMIT_PREFIX + type.getValue() + ":" + target;
    }

    /**
     * 构建验证次数计数 Key.
     */
    private String buildAttemptKey(CaptchaSceneEnum scene, CaptchaTypeEnum type, String target) {
        return CaptchaConstant.CAPTCHA_ATTEMPT_PREFIX + scene.getValue() + ":" + type.getValue() + ":" + target;
    }

    // ==================== 工具方法 ====================

    /**
     * 生成指定长度的数字验证码.
     *
     * @return 6 位数字验证码字符串
     */
    private String generateCode() {
        int bound = (int) Math.pow(10, CaptchaConstant.CODE_LENGTH);
        int code = RANDOM.nextInt(bound);
        return String.format("%0" + CaptchaConstant.CODE_LENGTH + "d", code);
    }

    /**
     * 日志脱敏：隐藏目标中间部分.
     *
     * @param target 原始目标字符串
     * @return 脱敏后的字符串
     */
    private String maskTarget(String target) {
        if (target == null || target.length() <= 4) {
            return "****";
        }
        return target.substring(0, 2) + "****" + target.substring(target.length() - 2);
    }

}

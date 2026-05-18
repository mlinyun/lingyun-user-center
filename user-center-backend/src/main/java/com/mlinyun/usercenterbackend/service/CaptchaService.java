package com.mlinyun.usercenterbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaSceneEnum;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaTypeEnum;
import com.mlinyun.usercenterbackend.model.entity.CaptchaLog;

/**
 * 验证码服务层.
 *
 * <p>
 * 提供验证码的生成、发送、校验、注销等核心能力，底层使用 Redis 实现存储和限流， 同时将发送记录写入数据库用于安全审计
 * </p>
 */
public interface CaptchaService extends IService<CaptchaLog> {

    /**
     * 发送验证码.
     *
     * <p>
     * 包含 60 秒防刷锁和小时级限流校验，通过后生成验证码并发送， 同时异步写入发送日志到数据库
     * </p>
     *
     * @param type 验证码类型（邮箱/短信）
     * @param scene 使用场景（注册/重置密码/绑定）
     * @param target 发送目标（邮箱地址或手机号）
     * @param ipAddress 请求者 IP 地址（用于审计日志）
     */
    void sendCaptcha(CaptchaTypeEnum type, CaptchaSceneEnum scene, String target, String ipAddress);

    /**
     * 校验验证码（失败时直接抛出 {@link com.mlinyun.usercenterbackend.exception.BusinessException}）.
     *
     * <p>
     * 校验通过后自动删除验证码（一码一用），并更新日志状态为"已验证"
     * </p>
     *
     * @param type 验证码类型
     * @param scene 使用场景
     * @param target 发送目标
     * @param code 用户输入的验证码
     */
    void verifyCaptchaOrThrow(CaptchaTypeEnum type, CaptchaSceneEnum scene, String target, String code);

    /**
     * 手动注销验证码.
     *
     * @param type 验证码类型
     * @param scene 使用场景
     * @param target 发送目标
     */
    void invalidateCaptcha(CaptchaTypeEnum type, CaptchaSceneEnum scene, String target);

}

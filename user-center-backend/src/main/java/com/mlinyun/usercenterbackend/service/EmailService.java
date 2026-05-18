package com.mlinyun.usercenterbackend.service;

/**
 * 邮件服务层.
 *
 * <p>
 * 定义邮件发送相关的方法，包括验证码邮件等
 * </p>
 */
public interface EmailService {

    /**
     * 发送验证码邮件.
     *
     * <p>
     * 使用 HTML 模板发送美观的验证码邮件，包含验证码、场景说明和有效期提示
     * </p>
     *
     * @param to 收件人邮箱地址
     * @param code 验证码
     * @param sceneDesc 场景描述（如"用户注册"、"重置密码"）
     */
    void sendCaptchaEmail(String to, String code, String sceneDesc);

}

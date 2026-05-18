package com.mlinyun.usercenterbackend.service;

import com.mlinyun.usercenterbackend.constant.captcha.CaptchaSceneEnum;

/**
 * 短信服务接口.
 *
 * <p>
 * 定义短信发送能力的抽象接口，支持验证码短信等场景。
 * </p>
 */
public interface SmsService {

    /**
     * 发送验证码短信.
     *
     * @param phoneNumber 手机号码
     * @param code 验证码
     * @param captchaSceneEnum 验证码使用场景（用于选择对应的短信模板）
     */
    void sendCaptchaSms(String phoneNumber, String code, CaptchaSceneEnum captchaSceneEnum);

}

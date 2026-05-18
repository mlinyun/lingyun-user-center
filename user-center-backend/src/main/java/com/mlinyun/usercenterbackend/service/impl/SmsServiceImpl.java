package com.mlinyun.usercenterbackend.service.impl;

import com.aliyun.dypnsapi20170525.Client;
import com.aliyun.dypnsapi20170525.models.SendSmsVerifyCodeRequest;
import com.aliyun.dypnsapi20170525.models.SendSmsVerifyCodeResponse;
import com.aliyun.teautil.models.RuntimeOptions;
import com.mlinyun.usercenterbackend.common.ErrorCode;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaSceneEnum;
import com.mlinyun.usercenterbackend.exception.BusinessException;
import com.mlinyun.usercenterbackend.service.SmsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 阿里云号码认证服务短信实现.
 *
 * <p>
 * 基于阿里云号码认证服务（Dypnsapi）的 SendSmsVerifyCode API 发送短信验证码。 使用系统赠送签名 + 赠送模板，个人开发者无需申请企业资质即可使用
 * </p>
 *
 * <p>
 * 可用模板编号说明：
 * <ul>
 * <li>100001 - 登录/注册模板</li>
 * <li>100002 - 修改绑定手机号模板</li>
 * <li>100003 - 重置密码模板</li>
 * <li>100004 - 绑定新手机号模板</li>
 * <li>100005 - 验证绑定手机号模板</li>
 * </ul>
 * </p>
 */
@Slf4j
@Service
public class SmsServiceImpl implements SmsService {

    /**
     * 阿里云号码认证服务客户端.
     */
    private final Client dypnsClient;

    /**
     * 短信签名名称（使用系统赠送签名）.
     */
    @Value("${aliyun.sms.sign-name}")
    private String signName;

    /**
     * 验证码长度（4-8位，默认 6 位）.
     */
    @Value("${aliyun.sms.code-length:6L}")
    private Long codeLength;

    /**
     * 验证码有效时长（秒，默认 300 秒即 5分钟）.
     */
    @Value("${aliyun.sms.valid-time:300}")
    private Long validTime;

    /**
     * 发送间隔（秒，默认60秒）.
     */
    @Value("${aliyun.sms.interval:60}")
    private Long interval;

    /**
     * 构造函数，注入阿里云号码认证服务客户端.
     *
     * @param dypnsClient {@linkplain Client 阿里云号码认证服务客户端}
     */
    public SmsServiceImpl(Client dypnsClient) {
        this.dypnsClient = dypnsClient;
    }

    /**
     * 发送验证码短信.
     *
     * <p>
     * 通过 SendSmsVerifyCode API 发送验证码，使用 ##code## 占位符由阿里云系统自动生成验证码。 根据不同的业务场景自动选择对应的短信模板编号。
     * </p>
     *
     * @param phoneNumber 手机号码
     * @param code 验证码（传入自定义验证码，直接下发给用户）
     * @param captchaSceneEnum 验证码使用场景（用于选择对应的短信模板）
     */
    @Override
    public void sendCaptchaSms(String phoneNumber, String code, CaptchaSceneEnum captchaSceneEnum) {
        try {
            // 根据场景获取对应的模板编号
            String templateCode = getTemplateCode(captchaSceneEnum);

            // 计算验证码有效时长，单位分钟
            long validTimeMinutes = validTime / 60;

            // 构建模板参数：直接传入自定义验证码值
            String templateParam = String.format("{\"code\":\"%s\",\"min\":\"%s\"}", code, validTimeMinutes);

            // 构建 SendSmsVerifyCode 请求
            SendSmsVerifyCodeRequest request = new SendSmsVerifyCodeRequest().setPhoneNumber(phoneNumber)
                    .setSignName(signName).setTemplateCode(templateCode).setTemplateParam(templateParam)
                    .setCodeLength(codeLength).setValidTime(validTime).setInterval(interval).setCodeType(1L)
                    .setReturnVerifyCode(false).setCountryCode("86");

            // 发送短信
            RuntimeOptions runtime = new RuntimeOptions();
            SendSmsVerifyCodeResponse response = dypnsClient.sendSmsVerifyCodeWithOptions(request, runtime);

            // 检查发送结果
            String responseCode = response.getBody().getCode();
            if ("OK".equals(responseCode)) {
                log.info("短信验证码发送成功: phone={}, scene={}, templateCode={}", maskPhone(phoneNumber),
                        captchaSceneEnum.getDesc(), templateCode);
            } else {
                String message = response.getBody().getMessage();
                log.error("短信验证码发送失败: phone={}, scene={}, code={}, message={}", maskPhone(phoneNumber),
                        captchaSceneEnum.getDesc(), responseCode, message);
                throw new BusinessException(ErrorCode.SYSTEM_ERROR, "短信发送失败: " + message);
            }
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("短信验证码发送异常: phone={}, scene={}", maskPhone(phoneNumber), captchaSceneEnum.getDesc(), e);
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "短信发送失败，请稍后再试");
        }

    }

    /**
     * 根据验证码场景获取对应的短信模板编号.
     *
     * <p>
     * 模板编号与阿里云号码认证控制台赠送的系统模板一一对应：
     * <ul>
     *   <li>REGISTER / LOGIN → 100001（登录/注册模板）</li>
     *   <li>BIND_CHANGE → 100002（修改绑定手机号模板）</li>
     *   <li>RESET_PWD → 100003（重置密码模板）</li>
     * </ul>
     * </p>
     *
     * @param scene 验证码使用场景
     * @return 对应的短信模板编号
     */
    private String getTemplateCode(CaptchaSceneEnum scene) {
        return switch (scene) {
            case REGISTER, LOGIN -> "100001";
            case BIND_CHANGE -> "100002";
            case RESET_PWD -> "100003";
        };
    }

    /**
     * 手机号脱敏：隐藏中间 4 位.
     *
     * @param phone 原始手机号
     * @return 脱敏后的手机号
     */
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 7) {
            return "****";
        }
        return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
    }

}

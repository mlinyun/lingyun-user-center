package com.mlinyun.usercenterbackend.service.impl;

import com.mlinyun.usercenterbackend.common.ErrorCode;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaConstant;
import com.mlinyun.usercenterbackend.exception.BusinessException;
import com.mlinyun.usercenterbackend.service.EmailService;
import jakarta.annotation.Resource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * 邮箱服务层实现.
 *
 * <p>
 * 基于 Spring Boot Mail 发送邮件，支持 HTML 模板格式的验证码邮件
 * </p>
 */
@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    /**
     * Spring Boot Mail 发送器.
     */
    @Resource
    private JavaMailSender javaMailSender;

    /**
     * 发件人邮箱地址（从配置文件读取）.
     */
    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * 应用名称（用于邮件标题）.
     */
    @Value("${spring.application.name:User Center}")
    private String appName;

    /**
     * 发送验证码邮件.
     *
     * @param to 收件人邮箱地址
     * @param code 验证码
     * @param sceneDesc 场景描述（如"用户注册"、"重置密码"）
     */
    @Override
    public void sendCaptchaEmail(String to, String code, String sceneDesc) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            // 设置邮件标题
            String subject = "【" + appName + "】" + sceneDesc + " 验证码";
            // 构造邮件内容
            String htmlContent = buildHtmlContent(code, sceneDesc);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            log.info("验证码邮件发送成功: to={}", to);
        } catch (MessagingException e) {
            log.error("验证码邮件发送失败: to={}", to, e);
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "邮件发送失败，请稍后再试");
        }
    }

    /**
     * 构建 HTML 格式的验证码邮件内容.
     *
     * @param code 验证码
     * @param sceneDesc 场景描述
     * @return HTML 格式的邮件内容
     */
    private String buildHtmlContent(String code, String sceneDesc) {
        long minutes = CaptchaConstant.CODE_TTL_SECONDS / 60;
        return "<div style=\"max-width:500px;margin:0 auto;padding:32px;"
                + "font-family:'Segoe UI',Roboto,sans-serif;\">" + "<h2 style=\"color:#1677ff;margin-bottom:24px;\">"
                + appName + "</h2>" + "<p style=\"font-size:15px;color:#333;line-height:1.6;\">您正在进行<strong>"
                + sceneDesc + "</strong>操作，验证码如下：</p>"
                + "<div style=\"background:linear-gradient(135deg,#f0f5ff,#e6f4ff);"
                + "padding:24px;text-align:center;border-radius:12px;margin:24px 0;" + "border:1px solid #d6e4ff;\">"
                + "<span style=\"font-size:36px;font-weight:bold;letter-spacing:10px;" + "color:#1677ff;\">" + code
                + "</span></div>" + "<p style=\"color:#999;font-size:13px;line-height:1.6;\">" + "验证码 " + minutes
                + " 分钟内有效，请勿泄露给他人。<br/>" + "如非本人操作，请忽略此邮件。</p>"
                + "<hr style=\"border:none;border-top:1px solid #f0f0f0;margin:24px 0;\"/>"
                + "<p style=\"color:#bbb;font-size:12px;\">此邮件由系统自动发送，请勿直接回复。</p>" + "</div>";
    }

}

package com.mlinyun.usercenterbackend.config;

import com.aliyun.dypnsapi20170525.Client;
import com.aliyun.teaopenapi.models.Config;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 阿里云号码认证服务配置类.
 *
 * <p>
 * 基于 application.yml 中的 aliyun.sms.* 配置项创建阿里云号码认证服务 Client， 用于调用 SendSmsVerifyCode 等 API 发送短信验证码
 * </p>
 */
@Slf4j
@Configuration
public class AliyunSmsConfig {

    /**
     * 阿里云 AccessKey ID.
     */
    @Value("${aliyun.sms.access-key-id}")
    private String accessKeyId;

    /**
     * 阿里云 AccessKey Secret.
     */
    @Value("${aliyun.sms.access-key-secret}")
    private String accessKeySecret;

    /**
     * 号码认证服务 API 接入点.
     */
    @Value("${aliyun.sms.endpoint:dypnsapi.aliyuncs.com}")
    private String endpoint;

    /**
     * 创建阿里云号码认证服务 Client Bean.
     *
     * @return {@linkplain Client 阿里云短信服务客户端}
     * @throws Exception 客户端创建异常
     */
    @Bean
    public Client dypnsClient() throws Exception {
        Config config =
                new Config().setAccessKeyId(accessKeyId).setAccessKeySecret(accessKeySecret).setEndpoint(endpoint);
        log.info("阿里云号码认证服务客户端初始化成功: endpoint={}", endpoint);
        return new Client(config);
    }

}

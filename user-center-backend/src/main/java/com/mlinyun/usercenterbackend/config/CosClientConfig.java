package com.mlinyun.usercenterbackend.config;

import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.auth.COSCredentials;
import com.qcloud.cos.region.Region;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 腾讯云 COS 客户端配置类.
 *
 * <p>
 * 该类用于配置腾讯云对象存储（COS）客户端的相关信息，包括身份识别 ID、密钥、区域和存储桶名称等。 通过 @ConfigurationProperties 注解将配置文件中的属性映射到该类的字段上。
 * </p>
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "cos.client")
public class CosClientConfig {

    /**
     * 域名.
     */
    private String host;

    /**
     * API 身份识别 ID secretId.
     */
    private String secretId;

    /**
     * API 身份密钥 secretKey.
     */
    private String secretKey;

    /**
     * 区域.
     */
    private String region;

    /**
     * 存储桶名称.
     */
    private String bucket;

    /**
     * 初始化 COS 客户端.
     *
     * @return {@link COSClient} 腾讯云 COS 客户端实例
     */
    @Bean
    public COSClient cosClient() {
        // 初始化用户身份信息（secretId, secretKey）
        COSCredentials cred = new BasicCOSCredentials(secretId, secretKey);
        // 设置 bucket 的地域, COS 地域的简称请参见 https://cloud.tencent.com/document/product/436/6224
        ClientConfig clientConfig = new ClientConfig(new Region(region));
        // 生成 COS 客户端
        return new COSClient(cred, clientConfig);
    }

}

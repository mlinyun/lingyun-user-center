package com.mlinyun.usercenterbackend.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;
import tools.jackson.databind.DefaultTyping;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;

/**
 * Spring Session Redis 配置类.
 *
 * <p>
 * 配置 Spring Session 的 Redis 序列化器 和 Cookie 策略
 * </p>
 */
@Configuration
public class SessionConfig {

    /**
     * Cookie 最大有效期.
     *
     * <p>
     * 支持 Duration 格式：7d、12h、30m、120s 等，默认 7 天（7d）
     * </p>
     */
    @Value("${server.servlet.session.cookie.max-age:7d}")
    private Duration cookieMaxAge;

    /**
     * Spring Session 专用 Redis 序列化器.
     *
     * <p>
     * Bean 名称必须为 {@code springSessionDefaultRedisSerializer}， Spring Session 自动装配时按此名称查找
     * </p>
     *
     * @return 供 Spring Session 使用的 {@link RedisSerializer} 实例
     */
    @Bean("springSessionDefaultRedisSerializer")
    public RedisSerializer<Object> springSessionDefaultRedisSerializer(ObjectMapper objectMapper) {
        BasicPolymorphicTypeValidator ptv = BasicPolymorphicTypeValidator.builder().allowIfBaseType(Object.class)
                .allowIfSubType("com.mlinyun.usercenterbackend.model.entity").build();
        ObjectMapper sessionMapper = objectMapper.rebuild()
                .activateDefaultTyping(ptv, DefaultTyping.NON_FINAL, JsonTypeInfo.As.PROPERTY).build();
        return new GenericJacksonJsonRedisSerializer(sessionMapper);
    }

    /**
     * 配置 Session Cookie 序列化策略.
     *
     * @return 配置好的 {@link CookieSerializer} 实例
     */
    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer cookieSerializer = new DefaultCookieSerializer();
        // 设置 cookie 的名称，默认是 SESSION
        cookieSerializer.setCookieName("USER-CENTER-SESSION");
        // 设置 cookie 的作用路径
        cookieSerializer.setCookiePath("/");
        // 设置 cookie 的域名匹配模式，提取主域名（如 example.com），适用于多子域部署
        cookieSerializer.setDomainNamePattern("^.+?\\.(\\w+\\.[a-z]+)$");
        // Cookie 有效期（秒）
        cookieSerializer.setCookieMaxAge((int) cookieMaxAge.getSeconds());
        return cookieSerializer;
    }

}

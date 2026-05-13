package com.mlinyun.usercenterbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 配置类.
 *
 * <p>
 * 该类主要用于配置 Redis 的序列化方式和连接工厂.
 * </p>
 */
@Configuration
public class RedisConfig {

    /**
     * 配置 RedisTemplate.
     *
     * @param redisConnectionFactory Redis 连接工厂
     * @return {@code RedisTemplate<String, Object>} 配置好的 RedisTemplate 实例
     */
    @Bean
    @Primary
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);

        // 使用 Spring Data Redis 推荐的 JSON 序列化器
        RedisSerializer<Object> jsonSerializer = RedisSerializer.json();
        StringRedisSerializer stringSerializer = new StringRedisSerializer();

        // Key / HashKey 使用字符串序列化，便于在 Redis CLI 中直接查看
        redisTemplate.setKeySerializer(stringSerializer);
        redisTemplate.setHashKeySerializer(stringSerializer);

        // Value / HashValue 使用带类型信息的 JSON 序列化器
        redisTemplate.setValueSerializer(jsonSerializer);
        redisTemplate.setHashValueSerializer(jsonSerializer);

        // 初始化 RedisTemplate
        redisTemplate.afterPropertiesSet();

        // 返回配置好的 RedisTemplate
        return redisTemplate;
    }

}

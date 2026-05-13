package com.mlinyun.usercenterbackend.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis-Plus 配置类.
 *
 * <p>
 * 该类主要用于配置 MyBatis-Plus 的拦截器，主要用于分页查询等功能.
 * </p>
 */
@Configuration
@MapperScan("com.mlinyun.usercenterbackend.mapper")
public class MybatisPlusConfig {

    /**
     * 配置 MyBatis-Plus 的拦截器.
     *
     * @return {@link MybatisPlusInterceptor} MyBatis-Plus 拦截器实例
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        // 创建 MyBatis-Plus 拦截器实例，用于注册各种内部拦截器
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 添加分页插件，指定数据库类型为 MySQL
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        // 返回配置好的拦截器实例，将由Spring容器管理
        return interceptor;
    }

}

package com.mlinyun.usercenterbackend.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Knife4j 配置类.
 *
 * <p>
 * 该类主要用于配置 Knife4j 的相关信息，包括 API 文档的基本信息、分组等.
 * </p>
 */
@Configuration
public class Knife4jConfig {

    // 扫描的包路径
    private static final String CONTROLLERS_PACKAGE = "com.mlinyun.usercenterbackend.controller";

    /**
     * 创建 GroupedOpenApi 对象，用于分组 API.
     *
     * @return GroupedOpenApi 对象
     */
    @Bean
    public GroupedOpenApi groupedOpenApi() {
        return GroupedOpenApi.builder().group("user-center").packagesToScan(CONTROLLERS_PACKAGE).build();
    }

    /**
     * 创建该 API 的基本信息.
     *
     * @return Info 对象
     */
    private Info apiInfo() {
        Contact contact = new Contact();
        contact.setEmail("lingyun2311@gmail.com");
        contact.setName("mlinyun");
        contact.setUrl("https://github.com/mlinyun");
        return new Info().title("凌云用户中心系统API文档")
                .description("企业核心的用户中心系统，基于 Spring Boot 后端 + React/Vue 前端的 **全栈项目**，实现了用户注册、登录、查询等基础功能。")
                .version("v1.0.0").contact(contact)
                .license(new License().name("MIT License").url("https://mit-license.org/"));
    }

    /**
     * 创建 ExternalDocumentation 对象，用于指定项目的外部文档.
     *
     * @return ExternalDocumentation 对象
     */
    private ExternalDocumentation externalDocumentation() {
        return new ExternalDocumentation().description("项目 GitHub 地址")
                .url("https://github.com/mlinyun/lingyun-user-center");
    }

    /**
     * 创建 OpenAPI 对象，用于配置整个 API 文档.
     *
     * @return OpenAPI 对象
     */
    @Bean
    public OpenAPI customOpenApi() {
        return new OpenAPI().info(apiInfo()).externalDocs(externalDocumentation());
    }

}

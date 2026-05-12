package com.mlinyun.usercenterbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 凌云用户中心系统后端应用入口类.
 *
 * <p>
 * 该类包含主方法，用于启动 Spring Boot 应用程序
 * </p>
 */
@SpringBootApplication
public class UserCenterBackendApplication {

    /**
     * 应用程序入口方法.
     *
     * @param args 启动参数
     */
    public static void main(String[] args) {
        SpringApplication.run(UserCenterBackendApplication.class, args);
    }

}

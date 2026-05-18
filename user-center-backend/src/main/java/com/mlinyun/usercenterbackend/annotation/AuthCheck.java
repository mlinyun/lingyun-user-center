package com.mlinyun.usercenterbackend.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 权限检查注解.
 *
 * <p>
 * 该注解可以用于方法上，表示该方法需要进行权限检查
 * </p>
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthCheck {

    /**
     * 必须具有某个角色才能访问.
     */
    String mustRole() default "";

}

package com.mlinyun.usercenterbackend.validation.annotation;

import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 头像文件验证注解.
 */
@Documented
@ValidImageFile(maxSizeBytes = UserConstant.AVATAR_MAX_FILE_SIZE)
@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {}) // 关键：validatedBy 为空，校验逻辑委托给 @ValidImageFile
public @interface ValidAvatarFile {

    /**
     * 错误消息，默认值为 "头像格式不支持，请上传 JPG、PNG、WEBP 或 GIF，且不超过 2MB".
     *
     * @return 错误消息字符串
     */
    String message() default "头像格式不支持，请上传 JPG、PNG、WEBP 或 GIF，且不超过 2MB";

    /**
     * 分组验证，默认值为一个空数组.
     *
     * @return 分组验证的类数组
     */
    Class<?>[] groups() default {};

    /**
     * 负载信息，默认值为一个空数组.
     *
     * @return 负载信息的类数组
     */
    Class<? extends Payload>[] payload() default {};

}

package com.mlinyun.usercenterbackend.validation.annotation;

import com.mlinyun.usercenterbackend.validation.validator.ImageFileValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 图片文件验证注解.
 */
@Documented
@Target({ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ImageFileValidator.class)
public @interface ValidImageFile {

    /**
     * 错误消息，默认值为 "不支持的图片格式或文件内容非法".
     *
     * @return 错误消息字符串
     */
    String message() default "不支持的图片格式或文件内容非法";

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

    /**
     * 最大文件大小，单位为字节，默认值为 2MB (2 * 1024 * 1024 字节).
     *
     * @return 最大文件大小的字节数
     */
    long maxSizeBytes() default 5 * 1024 * 1024; // 默认最大文件大小为 5MB

    /**
     * 允许的文件扩展名，默认值为常见的图片文件扩展名数组.
     *
     * @return 允许的文件扩展名字符串数组
     */
    String[] allowedExtensions() default {"jpg", "jpeg", "png", "webp", "gif"};

    /**
     * 允许的 MIME 类型，默认值为常见的图片 MIME 类型数组.
     *
     * @return 允许的 MIME 类型字符串数组
     */
    String[] allowedMimeTypes() default {"image/jpeg", "image/png", "image/webp", "image/gif"};

}

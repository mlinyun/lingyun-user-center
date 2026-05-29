package com.mlinyun.usercenterbackend.validation.validator;

import com.mlinyun.usercenterbackend.validation.annotation.ValidImageFile;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.io.BufferedInputStream;
import java.io.InputStream;
import java.util.Set;
import org.apache.tika.Tika;
import org.springframework.web.multipart.MultipartFile;

/**
 * 图片文件验证器.
 */
public class ImageFileValidator implements ConstraintValidator<ValidImageFile, MultipartFile> {

    /**
     * 最大文件大小，单位为字节，默认值为 2MB (2 * 1024 * 1024 字节).
     */
    private long maxSizeBytes;

    /**
     * 允许的文件扩展名，默认值为常见的图片文件扩展名数组.
     */
    private Set<String> allowedExtensions;

    /**
     * 允许的 MIME 类型，默认值为常见的图片 MIME 类型数组.
     */
    private Set<String> allowedMimeTypes;

    /**
     * Apache Tika 实例，用于检测文件的 MIME 类型，基于 Magic Bytes 进行内容检测，防止文件伪装攻击.
     */
    private final Tika tika = new Tika();

    /**
     * 初始化验证器，获取注解中的参数值.
     *
     * @param constraintAnnotation annotation instance for a given constraint declaration
     */
    @Override
    public void initialize(ValidImageFile constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        this.maxSizeBytes = constraintAnnotation.maxSizeBytes();
        this.allowedExtensions = Set.of(constraintAnnotation.allowedExtensions());
        this.allowedMimeTypes = Set.of(constraintAnnotation.allowedMimeTypes());
    }

    /**
     * 验证文件是否符合要求，包括大小、扩展名和内容类型.
     *
     * @param file 待验证的文件
     * @param context 验证上下文，用于构建错误消息
     *
     * @return true if the file is valid, false otherwise
     */
    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        if (file == null || file.isEmpty()) {
            return false;
        }
        // 1. 大小校验
        if (file.getSize() > maxSizeBytes) {
            buildMessage(context, "文件大小超过限制：" + maxSizeBytes / 1024 / 1024 + "MB");
            return false;
        }
        // 2. 后缀名校验（先快速拦截，再做内容检测）
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            buildMessage(context, "文件名非法：缺少扩展名");
            return false;
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
        if (!allowedExtensions.contains(extension)) {
            buildMessage(context, "不支持的文件扩展名：" + extension);
            return false;
        }
        // 3. Magic Bytes 内容检测
        try (InputStream is = new BufferedInputStream(file.getInputStream())) {
            String detectedMimeType = tika.detect(is);
            if (!allowedMimeTypes.contains(detectedMimeType)) {
                buildMessage(context, "检测到非法文件类型：" + detectedMimeType);
                return false;
            }
        } catch (Exception _) {
            buildMessage(context, "文件内容非法，无法读取");
            return false;
        }
        return true;
    }

    /**
     * 构建错误消息并添加到验证上下文中.
     *
     * @param ctx 验证上下文
     * @param msg 错误消息
     */
    private void buildMessage(ConstraintValidatorContext ctx, String msg) {
        ctx.disableDefaultConstraintViolation();
        ctx.buildConstraintViolationWithTemplate(msg).addConstraintViolation();
    }

}

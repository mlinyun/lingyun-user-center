package com.mlinyun.usercenterbackend.exception;

import com.mlinyun.usercenterbackend.common.BaseResponse;
import com.mlinyun.usercenterbackend.common.ErrorCode;
import com.mlinyun.usercenterbackend.common.ResultUtils;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.util.unit.DataSize;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * 全局异常处理器.
 *
 * <p>
 * 使用 Spring Boot 的 @RestControllerAdvice 注解统一处理项目中的异常， 将异常转换为规范化的 API 响应， 避免直接将错误堆栈信息暴露给客户端， 同时记录异常日志便于问题排查
 * </p>
 */
@Slf4j
@Hidden
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 上传文件的最大大小限制，单位为字节.
     */
    @Value("${spring.servlet.multipart.max-file-size}")
    private DataSize maxFileSize;

    /**
     * 处理业务异常.
     *
     * <p>
     * 捕获自定义的业务异常，提取异常中的状态码和消息，构造规范的错误响应， 业务异常通常是预期内的异常，代表一种业务校验不通过的情况
     * </p>
     *
     * @param e 业务异常对象
     * @return 统一格式的错误响应
     */
    @ExceptionHandler(BusinessException.class)
    public BaseResponse<Object> handleBusinessException(BusinessException e) {
        // 记录异常信息
        log.warn("BusinessException: code={}, message={}", e.getCode(), e.getMessage());
        // 返回错误响应
        return ResultUtils.error(e.getCode(), e.getMessage());
    }

    /**
     * 处理运行时异常.
     *
     * <p>
     * 捕获所有未被其他异常处理器捕获的运行时异常，通常代表系统内部错误， 将详细错误日志记录在服务端，但向客户端返回友好的错误提示
     * </p>
     *
     * @param e 运行时异常对象
     * @return 统一格式的错误响应
     */
    @ExceptionHandler(RuntimeException.class)
    public BaseResponse<Object> handleRuntimeException(RuntimeException e) {
        // 记录异常信息
        log.warn("RuntimeException: message={}", e.getMessage());
        // 返回错误响应
        return ResultUtils.error(ErrorCode.SYSTEM_ERROR, "系统异常，请稍后再试");
    }

    /**
     * 处理上传文件过大异常.
     *
     * @param e 上传文件过大异常对象
     * @return 统一格式的错误响应
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public BaseResponse<Object> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
        // 记录异常信息
        log.warn("MaxUploadSizeExceededException: message={}", e.getMessage());
        long maxSizeMb = maxFileSize.toMegabytes();
        // 返回错误响应
        return ResultUtils.error(ErrorCode.PARAMS_ERROR, "上传文件大小超过限制，最大支持 " + maxSizeMb + "MB");
    }

    /**
     * 处理请求体不可读异常.
     *
     * @param e 请求体不可读异常对象
     * @return 统一格式的错误响应
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public BaseResponse<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        // 记录异常信息
        log.warn("HttpMessageNotReadableException: message={}", e.getMessage());
        // 返回错误响应
        return ResultUtils.error(ErrorCode.PARAMS_ERROR, "请求体不能为空");
    }

    /**
     * 处理方法参数校验异常.
     *
     * <p>
     * 捕获由于请求参数校验失败引发的异常， 提取校验错误信息并返回给客户端，帮助客户端了解请求参数的问题所在
     * </p>
     *
     * @param e 方法参数校验异常对象
     * @return 统一格式的错误响应
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public BaseResponse<Object> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        // 记录异常信息
        log.error("MethodArgumentNotValidException: message={}", e.getMessage());
        // 提取校验错误信息
        String errorMessage = e.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
        // 返回错误响应
        return ResultUtils.error(ErrorCode.PARAMS_ERROR, errorMessage);
    }

    /**
     * 处理参数绑定校验异常.
     *
     * <p>
     * 捕获 @ModelAttribute 或 GET 参数校验失败引发的异常，提取校验错误信息并返回给客户端
     * </p>
     *
     * @param e 参数绑定校验异常对象
     * @return 统一格式的错误响应
     */
    @ExceptionHandler(BindException.class)
    public BaseResponse<Object> handleBindException(BindException e) {
        // 记录异常信息
        log.error("BindException: message={}", e.getMessage());
        // 提取校验错误信息
        String errorMessage = e.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
        // 返回错误响应
        return ResultUtils.error(ErrorCode.PARAMS_ERROR, errorMessage);
    }

    /**
     * 处理参数约束校验异常.
     *
     * @param e 处理参数约束校验异常
     * @return 统一格式的错误响应
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public BaseResponse<Object> handleConstraintViolationException(ConstraintViolationException e) {
        // 记录异常信息
        log.error("ConstraintViolationException: message={}", e.getMessage());
        // 提取校验错误信息
        String errorMessage = e.getConstraintViolations().iterator().next().getMessage();
        // 返回错误响应
        return ResultUtils.error(ErrorCode.PARAMS_ERROR, errorMessage);
    }

    /**
     * 处理静态资源未找到异常（404）.
     *
     * <p>
     * 当请求的静态资源找不到时，可能抛出 NoResourceFoundException，在此捕获并返回统一的 404 响应，避免暴露内部堆栈信息
     * </p>
     *
     * @param e 资源未找到异常对象
     * @return 统一格式的错误响应
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public BaseResponse<Object> handleNoResourceFoundException(NoResourceFoundException e) {
        // 记录异常信息（使用 warn 表示非服务器内部错误）
        log.warn("NoResourceFoundException: message={}", e.getMessage());
        // 返回 404 错误响应
        return ResultUtils.error(ErrorCode.NOT_FOUND_ERROR);
    }

}

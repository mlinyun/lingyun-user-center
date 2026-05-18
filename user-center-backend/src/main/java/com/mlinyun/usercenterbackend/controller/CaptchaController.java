package com.mlinyun.usercenterbackend.controller;

import cn.hutool.core.util.ObjectUtil;
import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.mlinyun.usercenterbackend.common.BaseResponse;
import com.mlinyun.usercenterbackend.common.ErrorCode;
import com.mlinyun.usercenterbackend.common.ResultUtils;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaSceneEnum;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaTypeEnum;
import com.mlinyun.usercenterbackend.exception.ThrowUtils;
import com.mlinyun.usercenterbackend.model.dto.captcha.SendCaptchaRequest;
import com.mlinyun.usercenterbackend.service.CaptchaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 验证码控制器.
 *
 * <p>
 * 提供验证码的发送接口，支持邮箱验证码（短信验证码后续迭代支持）
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/captcha")
@Tag(name = "CaptchaController", description = "验证码相关接口")
public class CaptchaController {

    /**
     * 验证码服务.
     */
    private final CaptchaService captchaService;

    /**
     * 构造函数，注入 CaptchaService.
     *
     * @param captchaService {@linkplain CaptchaService 验证码服务实例}
     */
    @Autowired
    public CaptchaController(CaptchaService captchaService) {
        this.captchaService = captchaService;
    }

    /**
     * 发送验证码接口.
     *
     * @param sendCaptchaRequest {@linkplain SendCaptchaRequest 发送验证码请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 发送结果
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/send")
    @Operation(summary = "发送验证码", description = "发送邮箱或短信验证码，60秒内不可重复发送")
    public BaseResponse<Boolean> sendCaptcha(@RequestBody @Valid SendCaptchaRequest sendCaptchaRequest,
            HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(sendCaptchaRequest), ErrorCode.PARAMS_ERROR);

        // 解析并校验验证码类型
        CaptchaTypeEnum type = CaptchaTypeEnum.getByValue(sendCaptchaRequest.getType());
        ThrowUtils.throwIf(type == null, ErrorCode.PARAMS_ERROR, "不支持的验证码类型");

        // 解析并校验验证码场景
        CaptchaSceneEnum scene = CaptchaSceneEnum.getByValue(sendCaptchaRequest.getScene());
        ThrowUtils.throwIf(scene == null, ErrorCode.PARAMS_ERROR, "不支持的验证码场景");

        // 获取请求者 IP 地址（用于审计日志）
        String ipAddress = getClientIp(request);

        // 获取发送目标
        String target = sendCaptchaRequest.getTarget();

        // 发送验证码
        captchaService.sendCaptcha(type, scene, target, ipAddress);
        return ResultUtils.success(true);
    }

    /**
     * 获取客户端 IP 地址.
     *
     * <p>
     * 优先从代理头中获取，支持 Nginx 反向代理场景
     * </p>
     *
     * @param request HTTP 请求对象
     * @return 客户端 IP 地址
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 多级代理时取第一个 IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

}

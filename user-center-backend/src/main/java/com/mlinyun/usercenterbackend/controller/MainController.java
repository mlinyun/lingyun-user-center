package com.mlinyun.usercenterbackend.controller;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.mlinyun.usercenterbackend.common.BaseResponse;
import com.mlinyun.usercenterbackend.common.ResultUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 主控制器.
 *
 * <p>
 * 提供系统基础功能的接口，如健康检查等
 * </p>
 */
@RestController
@RequestMapping("/")
@Tag(name = "MainController", description = "提供系统基础功能的接口")
public class MainController {

    /**
     * 健康检查接口.
     *
     * @return {@link BaseResponse} 返回健康状态
     */
    @ApiOperationSupport(author = "LingYun")
    @GetMapping("/health")
    @Operation(summary = "健康检查", description = "用于检查系统是否正常运行")
    public BaseResponse<String> healthCheck() {
        return ResultUtils.success("User Center 后端服务正在运行！");
    }

}

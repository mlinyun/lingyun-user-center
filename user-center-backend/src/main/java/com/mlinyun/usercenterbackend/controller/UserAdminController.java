package com.mlinyun.usercenterbackend.controller;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.mlinyun.usercenterbackend.annotation.AuthCheck;
import com.mlinyun.usercenterbackend.common.BaseResponse;
import com.mlinyun.usercenterbackend.common.ErrorCode;
import com.mlinyun.usercenterbackend.common.ResultUtils;
import com.mlinyun.usercenterbackend.common.dto.GetOrDeleteRequest;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import com.mlinyun.usercenterbackend.exception.ThrowUtils;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminAddUserRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminBanUserRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminQueryUserRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminResetUserPwdRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminUpdateUserInfoRequest;
import com.mlinyun.usercenterbackend.model.vo.user.UserVo;
import com.mlinyun.usercenterbackend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户管理控制器.
 *
 * <p>
 * 提供用户的增删改查接口，供管理员使用
 * </p>
 */
@RestController
@RequestMapping("/admin/user")
@Tag(name = "UserAdminController", description = "用户管理相关接口")
public class UserAdminController {
    /**
     * 用户服务.
     */
    private final UserService userService;

    /**
     * 构造函数，注入 UserService.
     *
     * @param userService {@linkplain UserService 用户服务实例}
     */
    @Autowired
    public UserAdminController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 管理员添加用户接口.
     *
     * @param adminAddUserRequest {@linkplain AdminAddUserRequest 管理员添加用户请求体}
     * @return 添加成功的用户 ID
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/add")
    @AuthCheck(mustRole = UserConstant.ROLE_ADMIN)
    @Operation(summary = "管理员添加用户", description = "管理员添加用户接口")
    public BaseResponse<Long> adminAddUser(@RequestBody @Valid AdminAddUserRequest adminAddUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminAddUserRequest), ErrorCode.PARAMS_ERROR);
        long userId = userService.adminAddUser(adminAddUserRequest);
        return ResultUtils.success(userId);
    }

    /**
     * 管理员根据 id 获取用户信息接口.
     *
     * @param adminGetUserRequest {@linkplain GetOrDeleteRequest 通用获取或删除请求参数}
     * @return 用户信息
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/get")
    @AuthCheck(mustRole = UserConstant.ROLE_ADMIN)
    @Operation(summary = "管理员根据 id 获取用户信息", description = "管理员根据 id 获取用户信息接口")
    public BaseResponse<UserVo> adminGetUserById(@RequestBody @Valid GetOrDeleteRequest adminGetUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminGetUserRequest), ErrorCode.PARAMS_ERROR);
        UserVo userVo = userService.adminGetUserById(adminGetUserRequest);
        return ResultUtils.success(userVo);
    }

    /**
     * 管理员根据 id 删除用户接口.
     *
     * @param adminDeleteUserRequest {@linkplain GetOrDeleteRequest 通用获取或删除请求参数}
     * @return 是否删除成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/delete")
    @AuthCheck(mustRole = UserConstant.ROLE_ADMIN)
    @Operation(summary = "管理员根据 id 删除用户", description = "管理员根据 id 删除用户接口")
    public BaseResponse<Boolean> adminDeleteUserById(@RequestBody @Valid GetOrDeleteRequest adminDeleteUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminDeleteUserRequest), ErrorCode.PARAMS_ERROR);
        boolean result = userService.adminDeleteUserById(adminDeleteUserRequest);
        return ResultUtils.success(result);
    }

    /**
     * 管理员更新用户信息接口.
     *
     * @param adminUpdateUserInfoRequest {@linkplain AdminUpdateUserInfoRequest 管理员更新用户信息请求体}
     * @return 是否更新成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/update")
    @AuthCheck(mustRole = UserConstant.ROLE_ADMIN)
    @Operation(summary = "管理员更新用户信息", description = "管理员更新用户信息接口")
    public BaseResponse<Boolean> adminUpdateUserInfo(
            @RequestBody @Valid AdminUpdateUserInfoRequest adminUpdateUserInfoRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminUpdateUserInfoRequest), ErrorCode.PARAMS_ERROR);
        boolean result = userService.adminUpdateUserInfo(adminUpdateUserInfoRequest);
        return ResultUtils.success(result);
    }

    /**
     * 管理员分页获取用户列表接口.
     *
     * @param adminQueryUserRequest {@linkplain AdminQueryUserRequest 管理员查询用户请求体}
     * @return 用户列表分页结果
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/page")
    @AuthCheck(mustRole = UserConstant.ROLE_ADMIN)
    @Operation(summary = "管理员分页获取用户列表", description = "管理员分页获取用户列表接口")
    public BaseResponse<Page<UserVo>> adminGetUserInfoByPage(
            @RequestBody @Valid AdminQueryUserRequest adminQueryUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminQueryUserRequest), ErrorCode.PARAMS_ERROR);
        Page<UserVo> userVoPage = userService.adminGetUserInfoByPage(adminQueryUserRequest);
        return ResultUtils.success(userVoPage);
    }

    /**
     * 管理员重置用户密码接口.
     *
     * @param adminResetUserPwdRequest {@linkplain AdminResetUserPwdRequest 管理员重置用户密码请求体}
     * @return 是否重置成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/reset")
    @AuthCheck(mustRole = UserConstant.ROLE_ADMIN)
    @Operation(summary = "管理员重置用户密码", description = "管理员重置用户密码接口")
    public BaseResponse<Boolean> adminResetUserPwd(
            @RequestBody @Valid AdminResetUserPwdRequest adminResetUserPwdRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminResetUserPwdRequest), ErrorCode.PARAMS_ERROR);
        boolean result = userService.adminResetUserPassword(adminResetUserPwdRequest);
        return ResultUtils.success(result);
    }

    /**
     * 管理员封禁或解封用户接口.
     *
     * @param adminBanUserRequest 管理员封禁或解封用户请求体
     * @return 是否操作成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/status")
    @AuthCheck(mustRole = UserConstant.ROLE_ADMIN)
    @Operation(summary = "管理员封禁或解封用户", description = "管理员封禁或解封用户接口")
    public BaseResponse<Boolean> adminBanOrUnbanUser(@RequestBody @Valid AdminBanUserRequest adminBanUserRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(adminBanUserRequest), ErrorCode.PARAMS_ERROR);
        boolean result = userService.adminBanOrUnbanUser(adminBanUserRequest);
        return ResultUtils.success(result);
    }
}

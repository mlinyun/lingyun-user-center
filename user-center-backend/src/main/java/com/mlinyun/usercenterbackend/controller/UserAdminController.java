package com.mlinyun.usercenterbackend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.mlinyun.usercenterbackend.aop.annotation.AuthCheck;
import com.mlinyun.usercenterbackend.common.BaseResponse;
import com.mlinyun.usercenterbackend.common.ResultUtils;
import com.mlinyun.usercenterbackend.common.dto.GetOrDeleteRequest;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminAddUserRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminBanUserRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminQueryUserRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminResetUserPwdRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminUpdateUserInfoRequest;
import com.mlinyun.usercenterbackend.model.vo.user.UserVo;
import com.mlinyun.usercenterbackend.service.UserService;
import com.mlinyun.usercenterbackend.validation.annotation.ValidAvatarFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 用户管理控制器.
 *
 * <p>
 * 提供用户的增删改查接口，供管理员使用
 * </p>
 */
@Validated
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
    public BaseResponse<String> adminAddUser(@RequestBody @Valid AdminAddUserRequest adminAddUserRequest) {
        String userId = userService.adminAddUser(adminAddUserRequest);
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
        boolean result = userService.adminBanOrUnbanUser(adminBanUserRequest);
        return ResultUtils.success(result);
    }

    /**
     * 管理员上传或修改头像.
     *
     * @param file {@linkplain MultipartFile 头像文件}
     * @param userId 用户 ID
     * @return 上传后的头像 URL
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/avatar")
    @AuthCheck(mustRole = UserConstant.ROLE_ADMIN)
    @Operation(summary = "管理员上传或修改头像", description = "管理员上传或修改头像接口")
    public BaseResponse<String> adminUploadAvatar(@ValidAvatarFile @RequestPart("file") @NotNull MultipartFile file,
            @RequestParam("userId") @NotNull @PositiveOrZero Long userId) {
        String avatarUrl = userService.adminUploadAvatar(file, userId);
        return ResultUtils.success(avatarUrl);
    }

}

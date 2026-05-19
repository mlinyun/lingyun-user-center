package com.mlinyun.usercenterbackend.controller;

import cn.hutool.core.util.ObjectUtil;
import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.mlinyun.usercenterbackend.common.BaseResponse;
import com.mlinyun.usercenterbackend.common.ErrorCode;
import com.mlinyun.usercenterbackend.common.ResultUtils;
import com.mlinyun.usercenterbackend.exception.ThrowUtils;
import com.mlinyun.usercenterbackend.model.dto.user.UserBindEmailRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserBindPhoneRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserEmailLoginRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserEmailRegisterRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserEmailResetPwdRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserLoginRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserPhoneLoginRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserPhoneRegisterRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserPhoneResetPwdRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserRegisterRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserUpdateInfoRequest;
import com.mlinyun.usercenterbackend.model.dto.user.UserUpdatePwdRequest;
import com.mlinyun.usercenterbackend.model.vo.user.UserLoginVo;
import com.mlinyun.usercenterbackend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 用户控制器.
 *
 * <p>
 * 该类用于处理与用户相关的请求，提供用户管理的接口
 * </p>
 */
@RestController
@RequestMapping("/user")
@Tag(name = "UserController", description = "用户相关接口")
public class UserController {

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
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 用户注册接口.
     *
     * @param userRegisterRequest {@linkplain UserRegisterRequest 用户注册请求体}
     * @return 注册成功的用户 ID
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/register/account")
    @Operation(summary = "用户注册", description = "通过账号和密码进行注册")
    public BaseResponse<String> userRegister(@RequestBody @Valid UserRegisterRequest userRegisterRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userRegisterRequest), ErrorCode.PARAMS_ERROR);
        String userId = userService.userRegister(userRegisterRequest);
        return ResultUtils.success(userId);
    }

    /**
     * 邮箱注册接口.
     *
     * @param userEmailRegisterRequest {@linkplain UserEmailRegisterRequest 邮箱注册请求体}
     * @return 注册成功的用户 ID
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/register/email")
    @Operation(summary = "邮箱注册", description = "通过邮箱验证码注册")
    public BaseResponse<String> userEmailRegister(
            @RequestBody @Valid UserEmailRegisterRequest userEmailRegisterRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userEmailRegisterRequest), ErrorCode.PARAMS_ERROR);
        String userId = userService.userEmailRegister(userEmailRegisterRequest);
        return ResultUtils.success(userId);
    }

    /**
     * 手机号注册接口.
     *
     * @param userPhoneRegisterRequest {@linkplain UserPhoneRegisterRequest 手机号注册请求体}
     * @return 注册成功的用户 ID
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/register/phone")
    @Operation(summary = "手机号注册", description = "通过短信验证码注册")
    public BaseResponse<String> userPhoneRegister(
            @RequestBody @Valid UserPhoneRegisterRequest userPhoneRegisterRequest) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userPhoneRegisterRequest), ErrorCode.PARAMS_ERROR);
        String userId = userService.userPhoneRegister(userPhoneRegisterRequest);
        return ResultUtils.success(userId);
    }

    /**
     * 用户登录接口.
     *
     * @param userLoginRequest {@linkplain UserLoginRequest 用户登录请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录成功的用户信息
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/login/account")
    @Operation(summary = "用户登录", description = "通过账号和密码进行登录")
    public BaseResponse<UserLoginVo> userLogin(@RequestBody @Valid UserLoginRequest userLoginRequest,
            HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userLoginRequest), ErrorCode.PARAMS_ERROR);
        UserLoginVo userLoginVo = userService.userLogin(userLoginRequest, request);
        return ResultUtils.success(userLoginVo);
    }

    /**
     * 邮箱验证码登录接口.
     *
     * @param userEmailLoginRequest {@linkplain UserEmailLoginRequest 邮箱登录请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录成功的用户信息
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/login/email")
    @Operation(summary = "邮箱验证码登录", description = "通过邮箱验证码登录，无需密码")
    public BaseResponse<UserLoginVo> userEmailLogin(@RequestBody @Valid UserEmailLoginRequest userEmailLoginRequest,
            HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userEmailLoginRequest), ErrorCode.PARAMS_ERROR);
        UserLoginVo userLoginVo = userService.userEmailLogin(userEmailLoginRequest, request);
        return ResultUtils.success(userLoginVo);
    }

    /**
     * 手机号验证码登录接口.
     *
     * @param userPhoneLoginRequest {@linkplain UserPhoneLoginRequest 手机号登录请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录成功的用户信息
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/login/phone")
    @Operation(summary = "手机号验证码登录", description = "通过短信验证码登录，无需密码")
    public BaseResponse<UserLoginVo> userPhoneLogin(@RequestBody @Valid UserPhoneLoginRequest userPhoneLoginRequest,
            HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userPhoneLoginRequest), ErrorCode.PARAMS_ERROR);
        UserLoginVo userLoginVo = userService.userPhoneLogin(userPhoneLoginRequest, request);
        return ResultUtils.success(userLoginVo);
    }

    /**
     * 绑定或换绑邮箱接口.
     *
     * @param userBindEmailRequest {@linkplain UserBindEmailRequest 绑定邮箱请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 用户绑定或换绑邮箱是否成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/bind/email")
    @Operation(summary = "绑定/换绑邮箱", description = "用户绑定或换绑邮箱，需提供新邮箱及验证码")
    public BaseResponse<Boolean> userBindEmail(@RequestBody @Valid UserBindEmailRequest userBindEmailRequest,
            HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userBindEmailRequest), ErrorCode.PARAMS_ERROR);
        boolean result = userService.userBindEmail(userBindEmailRequest, request);
        return ResultUtils.success(result);
    }

    /**
     * 绑定或换绑手机号接口.
     *
     * @param userBindPhoneRequest {@linkplain UserBindPhoneRequest 绑定手机号请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 用户绑定或换绑手机号是否成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/bind/phone")
    @Operation(summary = "绑定/换绑手机号", description = "用户绑定或换绑手机号，需提供新手机号及短信验证码")
    public BaseResponse<Boolean> userBindPhone(@RequestBody @Valid UserBindPhoneRequest userBindPhoneRequest,
            HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userBindPhoneRequest), ErrorCode.PARAMS_ERROR);
        boolean result = userService.userBindPhone(userBindPhoneRequest, request);
        return ResultUtils.success(result);
    }

    /**
     * 获取登录用户信息接口.
     *
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录用户信息
     */
    @ApiOperationSupport(author = "LingYun")
    @GetMapping("/current")
    @Operation(summary = "获取登录用户信息", description = "获取登录用户信息接口")
    public BaseResponse<UserLoginVo> getLoginUserInfo(HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(request), ErrorCode.PARAMS_ERROR);
        UserLoginVo userLoginVo = userService.getLoginUserInfo(request);
        return ResultUtils.success(userLoginVo);
    }

    /**
     * 用户注销接口.
     *
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 注销成功的消息
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/logout")
    @Operation(summary = "用户注销", description = "用户注销接口")
    public BaseResponse<Boolean> userLogout(HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(request), ErrorCode.PARAMS_ERROR);
        boolean result = userService.userLogout(request);
        return ResultUtils.success(result);
    }

    /**
     * 用户更新用户信息.
     *
     * @param userUpdateInfoRequest {@linkplain UserUpdateInfoRequest 普通用户更新用户信息请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否更新成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/update-info")
    @Operation(summary = "更新用户信息", description = "更新用户信息接口")
    public BaseResponse<Boolean> userUpdateInfo(@RequestBody @Valid UserUpdateInfoRequest userUpdateInfoRequest,
            HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userUpdateInfoRequest), ErrorCode.PARAMS_ERROR);
        boolean result = userService.userUpdateInfo(userUpdateInfoRequest, request);
        return ResultUtils.success(result);
    }

    /**
     * 用户更新密码接口.
     *
     * @param userUpdatePwdRequest {@linkplain UserUpdatePwdRequest 用户更新密码请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否更新成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/update-pwd")
    @Operation(summary = "更新密码", description = "用户更新密码接口")
    public BaseResponse<Boolean> userUpdatePwd(@RequestBody @Valid UserUpdatePwdRequest userUpdatePwdRequest,
            HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userUpdatePwdRequest), ErrorCode.PARAMS_ERROR);
        boolean result = userService.userUpdatePwd(userUpdatePwdRequest, request);
        return ResultUtils.success(result);
    }

    /**
     * 用户通过邮箱重置密码（忘记密码）.
     *
     * @param userEmailResetPwdRequest {@linkplain UserEmailResetPwdRequest 用户通过邮箱重置密码请求体}
     * @return 是否重置成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/reset-pwd/email")
    @Operation(summary = "通过邮箱重置密码", description = "通过邮箱验证码验证身份后重置密码")
    public BaseResponse<Boolean> userResetPwd(@RequestBody @Valid UserEmailResetPwdRequest userEmailResetPwdRequest,
            HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userEmailResetPwdRequest), ErrorCode.PARAMS_ERROR);
        boolean result = userService.userEmailResetPwd(userEmailResetPwdRequest, request);
        return ResultUtils.success(result);
    }

    /**
     * 通过手机号重置密码接口（忘记密码）.
     *
     * @param userPhoneResetPwdRequest {@linkplain UserPhoneResetPwdRequest 用户通过手机重置密码请求体}
     * @return 是否重置成功
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/reset-pwd/phone")
    @Operation(summary = "通过手机号重置密码", description = "通过短信验证码验证身份后重置密码")
    public BaseResponse<Boolean> userPhoneResetPwd(
            @RequestBody @Valid UserPhoneResetPwdRequest userPhoneResetPwdRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(userPhoneResetPwdRequest), ErrorCode.PARAMS_ERROR);
        boolean result = userService.userPhoneResetPwd(userPhoneResetPwdRequest, request);
        return ResultUtils.success(result);
    }

    /**
     * 用户上传或修改头像接口.
     *
     * @param file 头像文件
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 上传后的头像 URL
     */
    @ApiOperationSupport(author = "LingYun")
    @PostMapping("/avatar")
    @Operation(summary = "上传/修改头像", description = "上传头像文件并更新当前登录用户的头像")
    public BaseResponse<String> userUploadAvatar(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        ThrowUtils.throwIf(ObjectUtil.isEmpty(file), ErrorCode.PARAMS_ERROR);
        String avatarUrl = userService.userUploadAvatar(file, request);
        return ResultUtils.success(avatarUrl);
    }

}

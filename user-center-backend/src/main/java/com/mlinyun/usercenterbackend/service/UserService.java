package com.mlinyun.usercenterbackend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.mlinyun.usercenterbackend.common.dto.GetOrDeleteRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminAddUserRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminBanUserRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminQueryUserRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminResetUserPwdRequest;
import com.mlinyun.usercenterbackend.model.dto.admin.AdminUpdateUserInfoRequest;
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
import com.mlinyun.usercenterbackend.model.entity.User;
import com.mlinyun.usercenterbackend.model.vo.user.UserLoginVo;
import com.mlinyun.usercenterbackend.model.vo.user.UserVo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

/**
 * 用户信息表 服务层.
 *
 * <p>
 * 该接口定义了对用户信息表进行操作的方法，继承自 MyBatis Flex 的 IService 接口，提供了基本的 CRUD 操作
 * </p>
 */
public interface UserService extends IService<User> {

    // region 用户服务
    /**
     * 用户注册服务.
     *
     * @param userRegisterRequest {@linkplain UserRegisterRequest 用户注册请求体}
     * @return 注册成功的用户 ID
     */
    String userRegister(UserRegisterRequest userRegisterRequest);

    /**
     * 邮箱注册服务.
     *
     * @param userEmailRegisterRequest {@linkplain UserEmailRegisterRequest 邮箱注册请求体}
     * @return 注册成功的用户 ID
     */
    String userEmailRegister(UserEmailRegisterRequest userEmailRegisterRequest);

    /**
     * 手机号注册服务.
     *
     * @param userPhoneRegisterRequest {@linkplain UserPhoneRegisterRequest 手机号注册请求体}
     * @return 注册成功的用户 ID
     */
    String userPhoneRegister(UserPhoneRegisterRequest userPhoneRegisterRequest);

    /**
     * 用户登录服务.
     *
     * @param userLoginRequest {@linkplain UserLoginRequest 用户登录请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录成功的用户信息
     */
    UserLoginVo userLogin(UserLoginRequest userLoginRequest, HttpServletRequest request);

    /**
     * 邮箱验证码登录服务.
     *
     * @param userEmailLoginRequest {@linkplain UserEmailLoginRequest 邮箱登录请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录成功的用户信息
     */
    UserLoginVo userEmailLogin(UserEmailLoginRequest userEmailLoginRequest, HttpServletRequest request);

    /**
     * 手机号验证码登录服务.
     *
     * @param userPhoneLoginRequest {@linkplain UserPhoneLoginRequest 手机号登录请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录成功的用户信息
     */
    UserLoginVo userPhoneLogin(UserPhoneLoginRequest userPhoneLoginRequest, HttpServletRequest request);

    /**
     * 用户绑定或换绑邮箱.
     *
     * @param userBindEmailRequest {@linkplain UserBindEmailRequest 绑定邮箱请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 用户绑定或换绑邮箱是否成功
     */
    boolean userBindEmail(UserBindEmailRequest userBindEmailRequest, HttpServletRequest request);

    /**
     * 用户绑定或换绑手机号.
     *
     * @param userBindPhoneRequest {@linkplain UserBindPhoneRequest 绑定手机号请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 用户绑定或换绑手机号是否成功
     */
    boolean userBindPhone(UserBindPhoneRequest userBindPhoneRequest, HttpServletRequest request);

    /**
     * 获取登录用户信息服务.
     *
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 脱敏后的用户信息
     */
    UserLoginVo getLoginUser(HttpServletRequest request);

    /**
     * 用户注销服务.
     *
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否注销成功
     */
    boolean userLogout(HttpServletRequest request);

    /**
     * 用户更新用户信息.
     *
     * @param userUpdateInfoRequest {@linkplain UserUpdateInfoRequest 用户更新信息请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否更新成功
     */
    boolean userUpdateInfo(UserUpdateInfoRequest userUpdateInfoRequest, HttpServletRequest request);

    /**
     * 用户更新密码.
     *
     * @param userUpdatePwdRequest {@linkplain UserUpdatePwdRequest 用户更新密码请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否更新成功
     */
    boolean userUpdatePwd(UserUpdatePwdRequest userUpdatePwdRequest, HttpServletRequest request);

    /**
     * 用户通过邮箱重置密码（忘记密码）.
     *
     * @param userEmailResetPwdRequest {@linkplain UserEmailResetPwdRequest 用户邮箱重置密码请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否重置成功
     */
    boolean userEmailResetPwd(UserEmailResetPwdRequest userEmailResetPwdRequest, HttpServletRequest request);

    /**
     * 用户通过手机号重置密码（忘记密码）.
     *
     * @param userPhoneResetPwdRequest {@linkplain UserPhoneResetPwdRequest 用户手机重置密码请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否重置成功
     */
    boolean userPhoneResetPwd(UserPhoneResetPwdRequest userPhoneResetPwdRequest, HttpServletRequest request);

    /**
     * 用户上传或修改头像.
     *
     * @param file {@linkplain MultipartFile 头像文件}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 上传后的头像 URL
     */
    String userUploadAvatar(MultipartFile file, HttpServletRequest request);
    // endregion

    // region 用户管理服务
    /**
     * 管理员添加用户.
     *
     * @param adminAddUserRequest {@linkplain AdminAddUserRequest 管理员添加用户请求体}
     * @return 添加成功的用户 ID
     */
    String adminAddUser(AdminAddUserRequest adminAddUserRequest);

    /**
     * 管理员根据 id 获取用户信息.
     *
     * @param adminGetUserRequest {@linkplain GetOrDeleteRequest 通用获取或删除请求参数}
     * @return 用户信息
     */
    UserVo adminGetUserById(GetOrDeleteRequest adminGetUserRequest);

    /**
     * 管理员根据 id 删除用户.
     *
     * @param adminDeleteUserRequest {@linkplain GetOrDeleteRequest 通用获取或删除请求参数}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否删除成功
     */
    boolean adminDeleteUserById(GetOrDeleteRequest adminDeleteUserRequest, HttpServletRequest request);

    /**
     * 管理员更新用户信息.
     *
     * @param adminUpdateUserInfoRequest {@linkplain AdminUpdateUserInfoRequest 管理员更新用户信息请求体}
     * @return 是否更新成功
     */
    boolean adminUpdateUserInfo(AdminUpdateUserInfoRequest adminUpdateUserInfoRequest);

    /**
     * 管理员分页获取用户信息.
     *
     * @param adminQueryUserRequest {@linkplain AdminQueryUserRequest 管理员查询用户请求体}
     * @return 分页的用户信息列表
     */
    Page<UserVo> adminGetUserInfoByPage(AdminQueryUserRequest adminQueryUserRequest);

    /**
     * 管理员重置用户密码.
     *
     * @param adminResetUserPwdRequest {@linkplain AdminResetUserPwdRequest 管理员重置用户密码请求体}
     * @return 是否重置成功
     */
    boolean adminResetUserPassword(AdminResetUserPwdRequest adminResetUserPwdRequest);

    /**
     * 管理员封禁或解封用户.
     *
     * @param adminBanUserRequest {@linkplain AdminBanUserRequest 管理员封禁或解封用户请求体}
     * @return 是否操作成功
     */
    boolean adminBanOrUnbanUser(AdminBanUserRequest adminBanUserRequest);

    /**
     * 管理员上传或修改头像.
     *
     * @param file {@linkplain MultipartFile 头像文件}
     * @param userId 用户 ID
     * @return 上传后的头像 URL
     */
    String adminUploadAvatar(MultipartFile file, Long userId);
    // endregion

}

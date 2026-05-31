package com.mlinyun.usercenterbackend.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mlinyun.usercenterbackend.common.ErrorCode;
import com.mlinyun.usercenterbackend.common.dto.GetOrDeleteRequest;
import com.mlinyun.usercenterbackend.config.CosClientConfig;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaSceneEnum;
import com.mlinyun.usercenterbackend.constant.captcha.CaptchaTypeEnum;
import com.mlinyun.usercenterbackend.constant.page.PageConstant;
import com.mlinyun.usercenterbackend.constant.table.BaseFields;
import com.mlinyun.usercenterbackend.constant.table.UserFields;
import com.mlinyun.usercenterbackend.constant.user.UserConstant;
import com.mlinyun.usercenterbackend.constant.user.UserGenderEnum;
import com.mlinyun.usercenterbackend.constant.user.UserRoleEnum;
import com.mlinyun.usercenterbackend.constant.user.UserStatusEnum;
import com.mlinyun.usercenterbackend.exception.BusinessException;
import com.mlinyun.usercenterbackend.exception.ThrowUtils;
import com.mlinyun.usercenterbackend.manager.CosManager;
import com.mlinyun.usercenterbackend.mapper.UserMapper;
import com.mlinyun.usercenterbackend.model.converter.UserConverter;
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
import com.mlinyun.usercenterbackend.service.CaptchaService;
import com.mlinyun.usercenterbackend.service.UserService;
import com.mlinyun.usercenterbackend.utils.PasswordUtils;
import com.qcloud.cos.model.PutObjectResult;
import com.qcloud.cos.model.ciModel.persistence.CIObject;
import com.qcloud.cos.model.ciModel.persistence.ProcessResults;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * 用户信息表 服务层实现.
 *
 * <p>
 * 该类主要用于实现用户信息表相关的业务逻辑，继承了 MyBatis Plus 提供的 ServiceImpl 类，简化了 CRUD 操作的实现
 * </p>
 */
@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    /**
     * 验证码服务.
     */
    private final CaptchaService captchaService;

    /**
     * 腾讯云 COS 配置.
     */
    private final CosClientConfig cosClientConfig;

    /**
     * 对象存储服务管理器.
     */
    private final CosManager cosManager;

    /**
     * 用户模型转换器.
     */
    private final UserConverter userConverter;

    private final FindByIndexNameSessionRepository<? extends Session> sessionRepository;

    /**
     * 构造函数，注入 CaptchaService.
     *
     * @param captchaService {@linkplain CaptchaService 验证码服务实例}
     * @param cosClientConfig {@linkplain CosClientConfig 腾讯云 COS 配置}
     * @param cosManager {@linkplain CosManager 对象存储服务管理器}
     * @param userConverter {@linkplain UserConverter 用户模型转换器}
     * @param sessionRepository {@linkplain FindByIndexNameSessionRepository} 会话仓库
     */
    @Autowired
    public UserServiceImpl(CaptchaService captchaService, CosClientConfig cosClientConfig, CosManager cosManager,
            UserConverter userConverter, FindByIndexNameSessionRepository<? extends Session> sessionRepository) {
        this.captchaService = captchaService;
        this.cosClientConfig = cosClientConfig;
        this.cosManager = cosManager;
        this.userConverter = userConverter;
        this.sessionRepository = sessionRepository;
    }

    // region 用户服务

    /**
     * 用户注册服务.
     *
     * @param userRegisterRequest {@linkplain UserRegisterRequest 用户注册请求体}
     * @return 注册成功的用户 ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public String userRegister(UserRegisterRequest userRegisterRequest) {
        // 1. 获取请求体中的参数
        String userAccount = userRegisterRequest.getUserAccount(); // 登陆账号
        String userPassword = userRegisterRequest.getUserPassword(); // 登陆密码
        String checkPassword = userRegisterRequest.getCheckPassword(); // 校验密码
        if (ObjectUtil.hasEmpty(userAccount, userPassword, checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }

        // 2. 查重校验：查询登录账号是否存在
        this.checkUniqueAndThrow(UserFields.USER_ACCOUNT, userAccount, UserConstant.ACCOUNT_EXIST_MSG);

        // 3. 执行核心注册逻辑（校验密码、加密密码、构建用户实体、插入数据库）
        return this.coreRegister(userAccount, null, null, userPassword, checkPassword);
    }

    /**
     * 邮箱注册服务.
     *
     * @param userEmailRegisterRequest {@linkplain UserEmailRegisterRequest 邮箱注册请求体}
     * @return 注册成功的用户 ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public String userEmailRegister(UserEmailRegisterRequest userEmailRegisterRequest) {
        // 1. 获取请求体中的参数
        String userEmail = userEmailRegisterRequest.getUserEmail();
        String captchaCode = userEmailRegisterRequest.getCaptchaCode();
        String userPassword = userEmailRegisterRequest.getUserPassword();
        String checkPassword = userEmailRegisterRequest.getCheckPassword();
        if (ObjectUtil.hasEmpty(userEmail, captchaCode, userPassword, checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }

        // 2. 校验邮箱验证码
        captchaService.verifyCaptchaOrThrow(CaptchaTypeEnum.EMAIL, CaptchaSceneEnum.REGISTER, userEmail, captchaCode);

        // 3. 查重校验：查询邮箱是否存在
        this.checkUniqueAndThrow(UserFields.USER_EMAIL, userEmail, UserConstant.EMAIL_EXIST_MSG);

        // 4. 执行核心注册逻辑（校验密码、加密密码、构建用户实体、插入数据库），用户账号默认使用邮箱地址
        return this.coreRegister(userEmail, userEmail, null, userPassword, checkPassword);
    }

    /**
     * 手机号注册服务.
     *
     * @param userPhoneRegisterRequest {@linkplain UserPhoneRegisterRequest 手机号注册请求体}
     * @return 注册成功的用户 ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public String userPhoneRegister(UserPhoneRegisterRequest userPhoneRegisterRequest) {
        // 获取请求体中的参数
        String userPhone = userPhoneRegisterRequest.getUserPhone();
        String captchaCode = userPhoneRegisterRequest.getCaptchaCode();
        String userPassword = userPhoneRegisterRequest.getUserPassword();
        String checkPassword = userPhoneRegisterRequest.getCheckPassword();
        if (ObjectUtil.hasEmpty(userPhone, captchaCode, userPassword, checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }

        // 2. 校验短信验证码
        captchaService.verifyCaptchaOrThrow(CaptchaTypeEnum.SMS, CaptchaSceneEnum.REGISTER, userPhone, captchaCode);

        // 3. 查重校验：查询手机号是否存在
        this.checkUniqueAndThrow(UserFields.USER_PHONE, userPhone, UserConstant.PHONE_EXIST_MSG);

        // 4. 执行核心注册逻辑（校验密码、加密密码、构建用户实体、插入数据库），用户账号默认使用手机号
        return this.coreRegister(userPhone, null, userPhone, userPassword, checkPassword);
    }

    /**
     * 用户注册核心注册逻辑.
     *
     * @param account 账号
     * @param email 邮箱 (可选)
     * @param phone 手机号 (可选)
     * @param password 密码
     * @param checkPwd 确认密码
     * @return 注册成功的用户 ID
     */
    private String coreRegister(String account, String email, String phone, String password, String checkPwd) {
        // 1. 校验两次密码一致
        ThrowUtils.throwIf(!password.equals(checkPwd), ErrorCode.PARAMS_ERROR, UserConstant.CREDENTIAL_NOT_MATCH_MSG);

        // 2. 校验密码强度（双重保险）
        boolean validStrong = PasswordUtils.isValidStrong(password);
        ThrowUtils.throwIf(!validStrong, ErrorCode.PARAMS_ERROR, UserConstant.CREDENTIAL_FORMAT_MSG);

        // 3. 密码加密
        String encryptedPassword = PasswordUtils.encrypt(password);

        // 4. 构建用户实体
        User newUser = buildNewUser(account, encryptedPassword);

        if (CharSequenceUtil.isNotBlank(email)) {
            newUser.setUserEmail(email);
            newUser.setEmailVerified(1); // 邮箱注册，邮箱视为已验证
        }
        if (CharSequenceUtil.isNotBlank(phone)) {
            newUser.setUserPhone(phone);
            newUser.setPhoneVerified(1); // 手机号注册，手机号视为已验证
        }

        // 5. 插入数据库
        boolean saveResult = this.save(newUser);
        ThrowUtils.throwIf(!saveResult, ErrorCode.OPERATION_ERROR, UserConstant.REGISTER_FAILED_MSG);

        return newUser.getId().toString();
    }

    /**
     * 内部查重逻辑拦截.
     *
     * @param field 查询的列名
     * @param value 查询的数据
     * @param errorMsg 重复抛出的异常信息
     */
    private void checkUniqueAndThrow(String field, String value, String errorMsg) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(field, value);
        long count = this.baseMapper.selectCount(queryWrapper);
        ThrowUtils.throwIf(count > 0, ErrorCode.PARAMS_ERROR, errorMsg);
    }

    /**
     * 构建新用户实体.
     *
     * @param userAccount 登陆账号
     * @param encryptedPassword 加密后的密码
     * @return 新用户实体
     */
    private User buildNewUser(String userAccount, String encryptedPassword) {
        User user = new User();
        user.setUserAccount(userAccount);
        user.setUserPassword(encryptedPassword);
        user.setUserName(userAccount); // 默认昵称与登录账号相同
        user.setUserRole(UserRoleEnum.USER); // 默认用户角色为普通用户
        // 设置默认的用户头像和简介
        user.setUserAvatar(UserConstant.AVATAR_DEFAULT_URL);
        user.setUserProfile(UserConstant.PROFILE_DEFAULT);
        return user;
    }

    /**
     * 用户登录服务.
     *
     * @param userLoginRequest {@linkplain UserLoginRequest 用户登录请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录成功的用户信息
     */
    @Override
    public UserLoginVo userLogin(UserLoginRequest userLoginRequest, HttpServletRequest request) {
        // 1. 获取请求体中的参数
        String userAccount = userLoginRequest.getUserAccount(); // 用户账号
        String userPassword = userLoginRequest.getUserPassword(); // 用户密码
        if (ObjectUtil.hasEmpty(userAccount, userPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }

        // 2. 根据账号查询用户
        User loginUser =
                this.getUserByFieldAndThrow(UserFields.USER_ACCOUNT, userAccount, UserConstant.ACCOUNT_NOT_EXIST_MSG);

        // 3. 验证密码
        // 获取数据库中当前用户存储的加密密码，并使用 PasswordUtils.verify 方法验证用户输入的密码是否正确
        boolean isPasswordMatch = PasswordUtils.verify(userPassword, loginUser.getUserPassword());
        ThrowUtils.throwIf(!isPasswordMatch, ErrorCode.PARAMS_ERROR, UserConstant.ACCOUNT_NOT_EXIST_MSG);

        // 4. 执行统一登录后续流程
        return doLoginAfterVerify(loginUser, request);
    }

    /**
     * 邮箱验证码登录服务.
     *
     * @param userEmailLoginRequest {@linkplain UserEmailLoginRequest 邮箱登录请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录成功的用户信息
     */
    @Override
    public UserLoginVo userEmailLogin(UserEmailLoginRequest userEmailLoginRequest, HttpServletRequest request) {
        // 1. 获取请求体中的参数
        String userEmail = userEmailLoginRequest.getUserEmail();
        String captchaCode = userEmailLoginRequest.getCaptchaCode();
        if (ObjectUtil.hasEmpty(userEmail, captchaCode)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }

        // 2. 校验验证码
        captchaService.verifyCaptchaOrThrow(CaptchaTypeEnum.EMAIL, CaptchaSceneEnum.LOGIN, userEmail, captchaCode);

        // 3. 根据邮箱查询用户
        User loginUser =
                this.getUserByFieldAndThrow(UserFields.USER_EMAIL, userEmail, UserConstant.EMAIL_NOT_EXIST_MSG);

        // 4. 执行统一登录后续流程
        return doLoginAfterVerify(loginUser, request);
    }

    /**
     * 手机号验证码登录服务.
     *
     * @param userPhoneLoginRequest {@linkplain UserPhoneLoginRequest 手机号登录请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录成功的用户信息
     */
    @Override
    public UserLoginVo userPhoneLogin(UserPhoneLoginRequest userPhoneLoginRequest, HttpServletRequest request) {
        // 1. 获取请求体中的参数
        String userPhone = userPhoneLoginRequest.getUserPhone();
        String captchaCode = userPhoneLoginRequest.getCaptchaCode();
        if (ObjectUtil.hasEmpty(userPhone, captchaCode)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }

        // 2. 校验验证码
        captchaService.verifyCaptchaOrThrow(CaptchaTypeEnum.SMS, CaptchaSceneEnum.LOGIN, userPhone, captchaCode);

        // 3. 根据手机号查询用户
        User loginUser =
                this.getUserByFieldAndThrow(UserFields.USER_PHONE, userPhone, UserConstant.PHONE_NOT_EXIST_MSG);

        // 4. 执行统一登录后续流程
        return doLoginAfterVerify(loginUser, request);
    }

    /**
     * 用户登录内部用户查询校验逻辑.
     *
     * @param field 查询的列名
     * @param value 查询的数据
     * @param errorMsg 未查询到数据抛出的异常信息
     * @return 查询到的用户实体
     */
    private User getUserByFieldAndThrow(String field, String value, String errorMsg) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(field, value);
        User user = this.baseMapper.selectOne(queryWrapper);
        if (user == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, errorMsg);
        }
        return user;
    }

    /**
     * 验证码登录通用后续流程（检查用户状态 → 记录 Session → 返回脱敏信息）.
     *
     * @param loginUser 已查询到的用户实体
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 脱敏后的用户登录信息
     */
    private UserLoginVo doLoginAfterVerify(User loginUser, HttpServletRequest request) {
        // 1. 判断用户是否被禁用
        Integer userStatus = loginUser.getUserStatus();
        boolean banned = UserStatusEnum.isBanned(userStatus);
        ThrowUtils.throwIf(banned, ErrorCode.FORBIDDEN_ERROR, UserConstant.ACCOUNT_BANNED_MSG);

        // 2. 轮换会话 ID，防止会话固定攻击
        renewSession(request);

        // 3. 记录用户登录状态
        HttpSession session = request.getSession();
        session.setAttribute(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, loginUser.getId().toString());
        UserLoginVo userLoginVo = this.getUserLoginVo(loginUser);
        session.setAttribute(UserConstant.USER_LOGIN_STATE, userLoginVo);

        // 4. 返回脱敏后的用户信息
        return userLoginVo;
    }

    /**
     * 轮换会话 ID，防止会话固定攻击.
     *
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     */
    private void renewSession(HttpServletRequest request) {
        try {
            request.changeSessionId();
        } catch (Exception e) {
            log.warn("changeSessionId 失败，尝试重建 Session", e);
            try {
                request.getSession(false).invalidate();
            } catch (IllegalStateException ex) {
                log.error("Session 重建失败，登录中止", ex);
                throw new BusinessException(ErrorCode.SYSTEM_ERROR, "会话安全操作失败");
            }
        }
    }

    /**
     * 获得登录后的用户信息.
     *
     * @param user 登录后的用户信息
     * @return 脱敏后的用户信息
     */
    private UserLoginVo getUserLoginVo(User user) {
        if (user == null) {
            return null;
        }
        return userConverter.toUserLoginVo(user);
    }

    /**
     * 清理用户会话，强制用户重新登录.
     *
     * @param userId 用户 ID
     */
    private void expireUserSessions(Long userId) {
        if (userId == null) {
            return;
        }
        try {
            Map<String, ? extends Session> sessions = sessionRepository.findByIndexNameAndIndexValue(
                    FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, userId.toString());
            for (String sessionId : sessions.keySet()) {
                sessionRepository.deleteById(sessionId);
            }
        } catch (Exception e) {
            log.warn("清理用户会话失败, userId={}", userId, e);
        }
    }

    /**
     * 用户绑定或换绑邮箱.
     *
     * @param userBindEmailRequest {@linkplain UserBindEmailRequest 绑定邮箱请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 用户绑定或换绑邮箱是否成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean userBindEmail(UserBindEmailRequest userBindEmailRequest, HttpServletRequest request) {
        // 1. 获取请求体中的参数
        String userEmail = userBindEmailRequest.getUserEmail();
        String captchaCode = userBindEmailRequest.getCaptchaCode();
        if (ObjectUtil.hasEmpty(userEmail, captchaCode)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");

        }

        // 2. 校验验证码（失败自动抛异常）
        captchaService.verifyCaptchaOrThrow(CaptchaTypeEnum.EMAIL, CaptchaSceneEnum.BIND_CHANGE, userEmail,
                captchaCode);

        // 3. 获取当前登录用户（可能会抛出未登录异常）
        UserLoginVo loginUser = this.getLoginUser(request);

        // 4. 判断新邮箱与当前用户绑定的邮箱是否相同，如果相同则抛出异常
        String loginUserEmail = loginUser.getUserEmail();
        ThrowUtils.throwIf(CharSequenceUtil.equals(loginUserEmail, userEmail), ErrorCode.PARAMS_ERROR,
                UserConstant.EMAIL_SAME_MSG);

        // 5. 判断该邮箱是否已被其他用户绑定
        checkUniqueAndThrow(UserFields.USER_EMAIL, userEmail, UserConstant.EMAIL_EXIST_MSG);

        // 6. 更新当前用户邮箱信息并返回结果
        return coreBindContactInfo(loginUser, userEmail, null, request);
    }

    /**
     * 用户绑定或换绑手机号.
     *
     * @param userBindPhoneRequest {@linkplain UserBindPhoneRequest 绑定手机号请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 用户绑定或换绑手机号是否成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean userBindPhone(UserBindPhoneRequest userBindPhoneRequest, HttpServletRequest request) {
        // 1. 获取请求体中的参数
        String userPhone = userBindPhoneRequest.getUserPhone();
        String captchaCode = userBindPhoneRequest.getCaptchaCode();
        if (ObjectUtil.hasEmpty(userPhone, captchaCode)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }

        // 2. 校验验证码（失败自动抛异常）
        captchaService.verifyCaptchaOrThrow(CaptchaTypeEnum.SMS, CaptchaSceneEnum.BIND_CHANGE, userPhone, captchaCode);

        // 3. 获取当前登录用户（可能会抛出未登录异常）
        UserLoginVo loginUser = this.getLoginUser(request);

        // 4. 判断新手机号与当前用户绑定的手机号是否相同，如果相同则抛出异常
        String loginUserPhone = loginUser.getUserPhone();
        ThrowUtils.throwIf(CharSequenceUtil.equals(loginUserPhone, userPhone), ErrorCode.PARAMS_ERROR,
                UserConstant.PHONE_SAME_MSG);

        // 5. 判断该手机号是否已被其他用户绑定
        checkUniqueAndThrow(UserFields.USER_PHONE, userPhone, UserConstant.PHONE_EXIST_MSG);

        // 6. 更新当前用户的手机信息并返回结果
        return coreBindContactInfo(loginUser, null, userPhone, request);
    }

    /**
     * 更新联系方式、Session 缓存并构建脱敏返回结果.
     *
     * @param loginUser 当前用户信息
     * @param email 新的邮箱（可选）
     * @param phone 新的手机（可选）
     * @param request HTTP 请求对象
     * @return 更新是否成功
     */
    private boolean coreBindContactInfo(UserLoginVo loginUser, String email, String phone, HttpServletRequest request) {
        User updateUser = new User();
        long userId = loginUser.getId();
        updateUser.setId(userId);
        // 修改或绑定邮箱/手机号都需要更新编辑时间
        updateUser.setEditTime(LocalDateTime.now());
        if (CharSequenceUtil.isNotBlank(email)) {
            updateUser.setUserEmail(email);
            updateUser.setEmailVerified(1); // 标记邮箱为已验证
        }
        if (CharSequenceUtil.isNotBlank(phone)) {
            updateUser.setUserPhone(phone);
            updateUser.setPhoneVerified(1); // 标记手机号已验证
        }
        // 执行更新
        boolean result = this.updateById(updateUser);
        ThrowUtils.throwIf(!result, ErrorCode.SYSTEM_ERROR, "绑定/换绑联系方式失败");

        // 重新从数据库获取最新的用户信息，再更新 Session，保证数据一致性
        UserLoginVo latesUserLoginVo = this.userConverter.toUserLoginVo(this.getById(userId));
        request.getSession().setAttribute(UserConstant.USER_LOGIN_STATE, latesUserLoginVo);

        return true;
    }

    /**
     * 获取登录用户信息.
     *
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 登录用户信息
     */
    @Override
    public UserLoginVo getLoginUser(HttpServletRequest request) {
        // 判断登录状态
        Object userObj = request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        if (!(userObj instanceof UserLoginVo currentUser) || currentUser.getId() == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        return currentUser;
    }

    /**
     * 用户注销服务.
     *
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否注销成功
     */
    @Override
    public boolean userLogout(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session == null) {
                return true;
            }
            session.invalidate();
            return true;
        } catch (IllegalStateException _) {
            return true;
        } catch (Exception e) {
            // 处理异常
            log.error("用户注销失败", e);
            return false;
        }
    }

    /**
     * 用户更新用户信息.
     *
     * @param userUpdateInfoRequest {@linkplain UserUpdateInfoRequest 用户更新信息请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否更新成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean userUpdateInfo(UserUpdateInfoRequest userUpdateInfoRequest, HttpServletRequest request) {
        // 1. 获取请求体中的参数
        Long updateUserId = userUpdateInfoRequest.getId();

        // 2. 获取当前登录用户（可能会抛出未登录异常）
        UserLoginVo loginUser = this.getLoginUser(request);

        // 3. 仅允许更新自己的信息
        Long userId = loginUser.getId();
        ThrowUtils.throwIf(!userId.equals(updateUserId), ErrorCode.NOT_AUTH_ERROR, "无权限更新他人信息");

        // 4. 获取最新的用户信息
        User latestUser = this.getById(userId);

        // 5. 只更新允许修改的字段，且不覆盖未传递的字段
        userConverter.updateUserFromRequest(userUpdateInfoRequest, latestUser);
        // 修改用户用户信息后需要更新编辑时间
        latestUser.setEditTime(LocalDateTime.now());

        // 6. 执行更新
        boolean updateResult = this.updateById(latestUser);
        ThrowUtils.throwIf(!updateResult, ErrorCode.SYSTEM_ERROR, "用户信息更新失败，数据库更新异常");

        // 7. 重新从数据库获取最新的用户信息，再更新 Session，保证数据一致性
        UserLoginVo latesUserLoginVo = this.userConverter.toUserLoginVo(this.getById(userId));
        request.getSession().setAttribute(UserConstant.USER_LOGIN_STATE, latesUserLoginVo);

        // 8. 返回更新结果
        return true;
    }

    /**
     * 用户更新密码.
     *
     * @param userUpdatePwdRequest {@linkplain UserUpdatePwdRequest 用户更新密码请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否更新成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean userUpdatePwd(UserUpdatePwdRequest userUpdatePwdRequest, HttpServletRequest request) {
        // 1. 参数校验（通过 @Valid 注解在 Controller 层已完成大部分校验）
        if (ObjectUtil.isEmpty(userUpdatePwdRequest)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户密码更新请求不能为空");
        }

        // 2. 获取当前登录用户（可能会抛出未登录异常）
        UserLoginVo loginUser = this.getLoginUser(request);

        // 3. 仅允许修改自己的密码
        Long userId = loginUser.getId();
        boolean result = userId.equals(userUpdatePwdRequest.getId());
        ThrowUtils.throwIf(!result, ErrorCode.NOT_AUTH_ERROR, "无权限更新他人密码");

        // 从数据库中获取用户信息（包含密码）
        User latestUser = this.getById(userId);

        // 4. 获取传递的参数
        String rawPassword = userUpdatePwdRequest.getRawPassword(); // 原始密码
        String newPassword = userUpdatePwdRequest.getNewPassword(); // 新的密码
        String checkPassword = userUpdatePwdRequest.getCheckPassword(); // 校验密码
        if (ObjectUtil.hasEmpty(rawPassword, newPassword, checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }

        // 5. 校验新密码是否符合要求
        // 校验密码强度（必须包含大写字母、小写字母、数字和特殊字符）（双重保险）
        boolean validStrong = PasswordUtils.isValidStrong(newPassword);
        ThrowUtils.throwIf(!validStrong, ErrorCode.PARAMS_ERROR, UserConstant.CREDENTIAL_FORMAT_MSG);

        // 6. 校验旧密码是否正确
        boolean isPasswordMatch = PasswordUtils.verify(rawPassword, latestUser.getUserPassword());
        ThrowUtils.throwIf(!isPasswordMatch, ErrorCode.PARAMS_ERROR, "原始密码错误");

        // 7. 判断新密码和校验密码是否一致，同时不能与原始密码相同
        ThrowUtils.throwIf(!newPassword.equals(checkPassword), ErrorCode.PARAMS_ERROR,
                UserConstant.CREDENTIAL_NOT_MATCH_MSG);
        ThrowUtils.throwIf(rawPassword.equals(newPassword), ErrorCode.PARAMS_ERROR, "新密码不能与原始密码相同");

        // 8. 加密新密码
        String encryptedNewPassword = PasswordUtils.encrypt(newPassword);

        // 9. 执行密码更新
        latestUser.setUserPassword(encryptedNewPassword);
        // 修改用户密码后需要更新编辑时间
        latestUser.setEditTime(LocalDateTime.now());
        boolean updateResult = this.updateById(latestUser);
        ThrowUtils.throwIf(!updateResult, ErrorCode.SYSTEM_ERROR, UserConstant.RESET_CREDENTIAL_FAILED_MSG);

        // 10. 密码更新后应主动使已有的所有会话失效
        this.userLogout(request);
        this.expireUserSessions(userId);

        // 11. 返回更新结果
        return true;
    }

    /**
     * 用户通过邮箱重置密码（忘记密码）.
     *
     * @param userEmailResetPwdRequest {@linkplain UserEmailResetPwdRequest 用户邮箱重置密码请求体}
     * @return 是否重置成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean userEmailResetPwd(UserEmailResetPwdRequest userEmailResetPwdRequest, HttpServletRequest request) {
        // 1. 获取请求体中的参数
        String userEmail = userEmailResetPwdRequest.getUserEmail();
        String captchaCode = userEmailResetPwdRequest.getCaptchaCode();
        String newPassword = userEmailResetPwdRequest.getNewPassword();
        String checkPassword = userEmailResetPwdRequest.getCheckPassword();
        if (ObjectUtil.hasEmpty(userEmail, captchaCode, newPassword, checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }

        // 2. 校验邮箱验证码
        captchaService.verifyCaptchaOrThrow(CaptchaTypeEnum.EMAIL, CaptchaSceneEnum.RESET_PWD, userEmail, captchaCode);

        // 3. 复用核心重置密码逻辑（校验密码、查询用户、检查用户状态、加密新密码、执行更新）
        return coreResetPwd(CaptchaTypeEnum.EMAIL, userEmail, newPassword, checkPassword,
                UserConstant.EMAIL_NOT_BOUND_MSG, request);
    }

    /**
     * 用户通过手机号重置密码（忘记密码）.
     *
     * @param userPhoneResetPwdRequest {@linkplain UserPhoneResetPwdRequest 用户手机重置密码请求体}
     * @return 是否重置成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean userPhoneResetPwd(UserPhoneResetPwdRequest userPhoneResetPwdRequest, HttpServletRequest request) {
        // 1. 获取请求体中的参数
        String userPhone = userPhoneResetPwdRequest.getUserPhone();
        String captchaCode = userPhoneResetPwdRequest.getCaptchaCode();
        String newPassword = userPhoneResetPwdRequest.getNewPassword();
        String checkPassword = userPhoneResetPwdRequest.getCheckPassword();
        if (ObjectUtil.hasEmpty(userPhone, captchaCode, newPassword, checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }

        // 2. 校验短信验证码
        captchaService.verifyCaptchaOrThrow(CaptchaTypeEnum.SMS, CaptchaSceneEnum.RESET_PWD, userPhone, captchaCode);

        // 3. 复用核心重置密码逻辑
        return coreResetPwd(CaptchaTypeEnum.SMS, userPhone, newPassword, checkPassword,
                UserConstant.PHONE_NOT_BOUND_MSG, request);
    }

    /**
     * 邮箱/手机号重置密码核心逻辑.
     *
     * @param type 验证码类型（邮箱或短信）
     * @param field 用户的联系方式（邮箱地址或手机号）
     * @param newPassword 新密码
     * @param checkPassword 确认密码
     * @param notBoundMsg 用户未绑定联系方式时的异常信息
     * @param request HTTP 请求对象
     * @return 是否重置成功
     */
    private boolean coreResetPwd(CaptchaTypeEnum type, String field, String newPassword, String checkPassword,
            String notBoundMsg, HttpServletRequest request) {
        // 1. 根据传入且已经过验证码核验的 field（邮箱或手机号）直接反查用户，而非依赖当前 Session 登录态中的用户信息，避免用户未登录或登录态过期导致无法重置密码
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        String column = CaptchaTypeEnum.EMAIL.equals(type) ? UserFields.USER_EMAIL : UserFields.USER_PHONE;
        User user = this.getOne(queryWrapper.eq(column, field));
        ThrowUtils.throwIf(ObjectUtil.isEmpty(user), ErrorCode.PARAMS_ERROR, notBoundMsg);

        // 2.校验新密码和确认密码是否一致
        ThrowUtils.throwIf(!newPassword.equals(checkPassword), ErrorCode.PARAMS_ERROR,
                UserConstant.CREDENTIAL_NOT_MATCH_MSG);

        // 3. 校验新密码强度（双重保险）
        boolean validStrong = PasswordUtils.isValidStrong(newPassword);
        ThrowUtils.throwIf(!validStrong, ErrorCode.PARAMS_ERROR, UserConstant.CREDENTIAL_FORMAT_MSG);

        // 4. 判断用户是否被禁用
        boolean banned = UserStatusEnum.isBanned(user.getUserStatus());
        ThrowUtils.throwIf(banned, ErrorCode.FORBIDDEN_ERROR, UserConstant.ACCOUNT_BANNED_MSG);

        // 5. 加密并在数据库中执行密码更新
        String encryptedNewPassword = PasswordUtils.encrypt(newPassword);
        User updateUser = new User();
        updateUser.setId(user.getId());
        updateUser.setUserPassword(encryptedNewPassword);
        // 修改用户密码后需要更新编辑时间
        updateUser.setEditTime(LocalDateTime.now());
        boolean updateResult = this.updateById(updateUser);
        ThrowUtils.throwIf(!updateResult, ErrorCode.SYSTEM_ERROR, UserConstant.RESET_CREDENTIAL_FAILED_MSG);

        // 6. 密码更新后应主动使已有的所有会话失效
        this.userLogout(request);
        this.expireUserSessions(user.getId());

        // 7. 返回更新结果
        return true;
    }

    /**
     * 用户上传或修改头像.
     *
     * @param file {@linkplain MultipartFile 头像文件}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 上传后的头像 URL
     */
    @Override
    public String userUploadAvatar(MultipartFile file, HttpServletRequest request) {
        // 1. 获取当前登录用户
        UserLoginVo loginUser = this.getLoginUser(request);
        Long userId = loginUser.getId();

        // 2. 执行核心上传逻辑（参数校验、上传文件、回写 URL）
        String avatarUrl = coreUploadAvatar(file, userId);

        // 3. 同步最新用户信息到 Session
        UserLoginVo latesUserLoginVo = this.userConverter.toUserLoginVo(this.getById(userId));
        request.getSession().setAttribute(UserConstant.USER_LOGIN_STATE, latesUserLoginVo);

        return avatarUrl;
    }

    /**
     * 用户头像上传核心逻辑（参数校验、上传文件、回写 URL）.
     *
     * @param file file {@linkplain MultipartFile 头像文件}
     * @param userId 用户 ID
     * @return 上传后的头像 URL
     */
    private String coreUploadAvatar(MultipartFile file, Long userId) {
        // 1. 参数校验
        ThrowUtils.throwIf(file == null || file.isEmpty(), ErrorCode.PARAMS_ERROR, UserConstant.AVATAR_FILE_EMPTY_MSG);
        // 2. 校验文件大小，以字节为单位
        ThrowUtils.throwIf(file.getSize() > UserConstant.AVATAR_MAX_FILE_SIZE, ErrorCode.PARAMS_ERROR,
                UserConstant.AVATAR_FILE_TOO_LARGE_MSG);

        // 3. 校验文件扩展名
        String fileSuffix = FileUtil.getSuffix(file.getOriginalFilename()); // 获取文件扩展名（不带点）
        // 允许上传的文件扩展名列表（小写）
        boolean extensionAllowed = UserConstant.AVATAR_ALLOWED_EXTENSIONS.contains(fileSuffix);
        ThrowUtils.throwIf(!extensionAllowed, ErrorCode.PARAMS_ERROR, UserConstant.AVATAR_FILE_TYPE_INVALID_MSG);

        // 4. 构造图片上传路径
        // 生成一个随机的 UUID 作为文件名的一部分，去掉其中的连字符
        String uuid = UUID.randomUUID().toString().replace("-", "");
        String objectKey = String.format(UserConstant.AVATAR_UPLOAD_PATH + "/%d/%s.%s", userId, uuid, fileSuffix);

        // 5. 上传文件到对象存储
        File tempFile = null;
        // 需要回写的头像 URL
        String avatarUrl;
        // 原始头像 URL
        String originalAvatarUrl = cosClientConfig.getHost() + "/" + objectKey;
        // 初始化压缩图 URL，默认为 null
        String compressedAvatarUrl = null;
        // 初始化缩略图 URL，默认为 null
        String thumbnailAvatarUrl = null;
        try {
            // 创建临时文件
            String tempFilePrefix = "user-center-avatar-" + userId + "-" + uuid;
            String tempFileSuffix = fileSuffix == null || fileSuffix.isBlank() ? null : "." + fileSuffix;
            tempFile = File.createTempFile(tempFilePrefix, tempFileSuffix);
            file.transferTo(tempFile);
            // 上传到对象存储并获取图片信息
            PutObjectResult putObjectResult = cosManager.putPictureObject(objectKey, tempFile);
            log.info("图片上传到对象存储成功, objectKey={}, ETag={}", objectKey, putObjectResult.getETag());
            // 获取处理结果对象，从中获取缩略图
            ProcessResults processResults = putObjectResult.getCiUploadResult().getProcessResults();
            List<CIObject> ciObjectList = processResults.getObjectList();
            if (CollUtil.isNotEmpty(ciObjectList)) {
                // 缩略图默认为压缩图
                CIObject thumbnailCiObject = ciObjectList.getFirst();
                compressedAvatarUrl = cosClientConfig.getHost() + "/" + ciObjectList.getFirst().getKey();
                // 如果处理结果中包含缩略图，则使用缩略图作为头像 URL（因为缩略图的尺寸更小，更适合作为头像）
                if (ciObjectList.size() > 1) {
                    thumbnailCiObject = ciObjectList.get(1);
                }
                // 通过 COS 配置的域名和压缩后的对象键构建压缩后的头像 URL
                thumbnailAvatarUrl = cosClientConfig.getHost() + "/" + thumbnailCiObject.getKey();
            }
            // 如果存在压缩图，则头像使用压缩图
            if (thumbnailAvatarUrl != null) {
                avatarUrl = thumbnailAvatarUrl;
            } else {
                // 如果不存在压缩图，则使用原图
                log.warn("图片处理结果中未找到压缩图，使用原图作为头像 URL, objectKey={}", objectKey);
                avatarUrl = originalAvatarUrl;
            }
        } catch (Exception e) {
            log.error("用户头像上传失败, userId={}", userId, e);
            throw new BusinessException(ErrorCode.OPERATION_ERROR, UserConstant.AVATAR_UPLOAD_FAILED_MSG);
        } finally {
            // 无论上传是否成功，都要删除临时文件，否则会导致资源泄漏
            this.deleteTempFile(tempFile);
        }

        // 6. 回写头像 URL 到数据库
        User updateUser = new User();
        updateUser.setId(userId);
        updateUser.setUserAvatar(avatarUrl);
        updateUser.setEditTime(LocalDateTime.now());
        boolean updateResult = this.updateById(updateUser);
        if (!updateResult) {
            // 清理 COS 中已上传的图片，避免垃圾数据
            try {
                // 删除原图
                cosManager.deleteObject(objectKey);
                // 删除压缩图（如果存在）
                if (compressedAvatarUrl != null) {
                    String compressedObjectKey = compressedAvatarUrl.replace(cosClientConfig.getHost() + "/", "");
                    cosManager.deleteObject(compressedObjectKey);
                }
                // 删除缩略图（如果存在）
                if (thumbnailAvatarUrl != null) {
                    String thumbnailObjectKey = thumbnailAvatarUrl.replace(cosClientConfig.getHost() + "/", "");
                    cosManager.deleteObject(thumbnailObjectKey);
                }
                log.info("用户头像上传失败，已删除 COS 中的图片, objectKey={}", objectKey);
            } catch (Exception e) {
                log.error("用户头像上传失败，数据库更新异常，删除 COS 中的图片失败, objectKey={}", objectKey, e);
            }
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "头像更新失败，数据库更新异常");
        }

        // 7. 返回头像 URL
        return avatarUrl;
    }

    /**
     * 删除临时文件.
     *
     * @param file 临时文件
     */
    public void deleteTempFile(File file) {
        if (file == null || !file.exists()) {
            return;
        }
        // 删除临时文件
        try {
            Files.delete(file.toPath());
        } catch (NoSuchFileException _) {
            // 文件本就不存在，无需处理
            log.warn("临时文件不存在，无需删除，文件路径 = {}", file.getAbsolutePath());
        } catch (IOException e) {
            // 涵盖 AccessDeniedException、FileSystemException 等所有 IO 异常
            log.error("临时文件删除失败，文件路径 = {}，原因：{}", file.getAbsolutePath(), e.getMessage());
        }
    }
    // endregion

    // region 用户管理服务

    /**
     * 管理员添加用户.
     *
     * @param adminAddUserRequest {@linkplain AdminAddUserRequest 管理员添加用户请求体}
     * @return 添加成功的用户 ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public String adminAddUser(AdminAddUserRequest adminAddUserRequest) {
        // 1. 获取请求体中必填的参数
        String userAccount = adminAddUserRequest.getUserAccount();
        String userPassword = adminAddUserRequest.getUserPassword();
        String checkPassword = adminAddUserRequest.getCheckPassword();
        // 注：这些校验应该在 DTO 中使用 @NotBlank 等注解完成（这里保留是为了双重保险）
        if (ObjectUtil.hasEmpty(userAccount, userPassword, checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "必填参数不能为空");
        }
        // 校验新密码是否符合要求
        // 校验密码强度（必须包含大写字母、小写字母、数字和特殊字符）（双重保险）
        boolean validStrong = PasswordUtils.isValidStrong(userPassword);
        ThrowUtils.throwIf(!validStrong, ErrorCode.PARAMS_ERROR, UserConstant.CREDENTIAL_FORMAT_MSG);
        // 校验登录密码和校验密码是否一致
        ThrowUtils.throwIf(!userPassword.equals(checkPassword), ErrorCode.PARAMS_ERROR,
                UserConstant.CREDENTIAL_NOT_MATCH_MSG);

        // 2. 检查账号是否已存在
        this.checkUniqueAndThrow(UserFields.USER_ACCOUNT, userAccount, UserConstant.ACCOUNT_EXIST_MSG);

        // 3. 密码加密（使用 Bcrypt 算法）
        String encryptedPassword = PasswordUtils.encrypt(userPassword);

        // 4. 构建新用户实体
        User newUser = userConverter.toUserFromAdminAdd(adminAddUserRequest);
        newUser.setUserPassword(encryptedPassword); // 设置加密后的密码
        // 如果未设置昵称，则使用登录账号作为默认昵称
        if (newUser.getUserName() == null) {
            newUser.setUserName(userAccount);
        }
        // 如果未设置头像，则使用默认头像
        if (newUser.getUserAvatar() == null) {
            newUser.setUserAvatar(UserConstant.AVATAR_DEFAULT_URL);
        }
        // 如果未设置简介，则使用默认简介
        if (newUser.getUserProfile() == null) {
            newUser.setUserProfile(UserConstant.PROFILE_DEFAULT);
        }
        // 如果未设置用户角色，则设置默认用户角色为普通用户
        if (newUser.getUserRole() == null) {
            newUser.setUserRole(UserRoleEnum.USER);
        }
        // 如果未设置性别，则默认设置为未知（可省略，因为 SQL 语句中 userGender 字段设置有默认值 2）
        if (newUser.getUserGender() == null) {
            newUser.setUserGender(UserGenderEnum.UNKNOWN.getValue());
        }

        // 5. 将用户插入到数据库中
        boolean saveResult = this.save(newUser);
        ThrowUtils.throwIf(!saveResult, ErrorCode.OPERATION_ERROR, "用户添加失败，请稍后再试");

        // 6. 返回新用户 ID
        return newUser.getId().toString();
    }

    /**
     * 管理员根据 id 获取用户信息.
     *
     * @param adminGetUserRequest {@linkplain GetOrDeleteRequest 通用获取或删除请求参数}
     * @return 用户信息
     */
    @Override
    public UserVo adminGetUserById(GetOrDeleteRequest adminGetUserRequest) {
        User user = this.getUserByIdAndThrow(adminGetUserRequest.getId());
        return userConverter.toUserVo(user);
    }

    /**
     * 管理员根据 id 删除用户.
     *
     * @param adminDeleteUserRequest {@linkplain GetOrDeleteRequest 通用获取或删除请求参数}
     * @return 是否删除成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean adminDeleteUserById(GetOrDeleteRequest adminDeleteUserRequest, HttpServletRequest request) {
        // 获取请求参数中的用户 ID
        Long userId = adminDeleteUserRequest.getId();
        // 获取当前登录用户信息
        UserLoginVo loginUser = this.getLoginUser(request);
        ThrowUtils.throwIf(loginUser.getId().equals(userId), ErrorCode.NOT_AUTH_ERROR, "管理员不能删除自己");
        // 通过用户 ID 检查用户是否存在
        this.getUserByIdAndThrow(userId);
        // 删除用户
        boolean deleteResult = this.removeById(userId);
        ThrowUtils.throwIf(!deleteResult, ErrorCode.OPERATION_ERROR, "用户删除失败，数据库删除异常");
        return true;
    }

    /**
     * 管理员更新用户信息.
     *
     * @param adminUpdateUserInfoRequest {@linkplain AdminUpdateUserInfoRequest 管理员更新用户信息请求体}
     * @return 是否更新成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean adminUpdateUserInfo(AdminUpdateUserInfoRequest adminUpdateUserInfoRequest) {
        // 通过用户 ID 检查用户是否存在
        User user = this.getUserByIdAndThrow(adminUpdateUserInfoRequest.getId());
        UserRoleEnum oldRole = user.getUserRole();
        // 只更新允许修改的字段，且不覆盖未传递的字段
        userConverter.updateUserFromAdminRequest(adminUpdateUserInfoRequest, user);
        // 执行更新
        boolean updateResult = this.updateById(user);
        ThrowUtils.throwIf(!updateResult, ErrorCode.OPERATION_ERROR, "用户信息更新失败，数据库更新异常");
        // 如果用户角色发生变化，则需要清理用户会话，强制用户重新登录，以更新权限信息
        boolean securityChanged = ObjectUtil.equals(oldRole, user.getUserRole());
        if (!securityChanged) {
            expireUserSessions(user.getId());
        }
        return true;
    }

    /**
     * 管理员分页获取用户信息.
     *
     * @param adminQueryUserRequest {@linkplain AdminQueryUserRequest 管理员查询用户请求体}
     * @return 分页的用户信息列表
     */
    @Override
    public Page<UserVo> adminGetUserInfoByPage(AdminQueryUserRequest adminQueryUserRequest) {
        int pageNum = adminQueryUserRequest.getPageNum();
        int pageSize = adminQueryUserRequest.getPageSize();
        Page<User> userPage =
                this.page(new Page<>(pageNum, pageSize), this.buildUserQueryWrapper(adminQueryUserRequest));
        // 将 User 实体转换为 UserVO 视图对象
        Page<UserVo> userVoPage = new Page<>(userPage.getCurrent(), userPage.getSize(), userPage.getTotal());
        List<UserVo> userVoList = userConverter.toUserVoList(userPage.getRecords());
        userVoPage.setRecords(userVoList);
        return userVoPage;
    }

    /**
     * 构建用户查询包装器.
     *
     * @param adminQueryUserRequest {@linkplain AdminQueryUserRequest 管理员查询用户请求体}
     * @return 用户查询包装器
     */
    private QueryWrapper<User> buildUserQueryWrapper(AdminQueryUserRequest adminQueryUserRequest) {
        // 获取查询参数（可能为 null）
        Long userId = adminQueryUserRequest.getId();
        String userAccount = adminQueryUserRequest.getUserAccount();
        String userPhone = adminQueryUserRequest.getUserPhone();
        String userEmail = adminQueryUserRequest.getUserEmail();
        Integer userStatus = adminQueryUserRequest.getUserStatus();
        String userName = adminQueryUserRequest.getUserName();
        String userProfile = adminQueryUserRequest.getUserProfile();
        String userRole = adminQueryUserRequest.getUserRole();
        Integer userGender = adminQueryUserRequest.getUserGender();
        LocalDateTime createTimeStart = adminQueryUserRequest.getCreateTimeStart();
        LocalDateTime createTimeEnd = adminQueryUserRequest.getCreateTimeEnd();

        // 构建查询包装器
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();

        // 精确查询
        queryWrapper.eq(ObjectUtil.isNotEmpty(userId), BaseFields.ID, userId)
                .eq(ObjectUtil.isNotEmpty(userAccount), UserFields.USER_ACCOUNT, userAccount)
                .eq(ObjectUtil.isNotEmpty(userRole), UserFields.USER_ROLE, userRole)
                .eq(ObjectUtil.isNotEmpty(userGender), UserFields.USER_GENDER, userGender)
                .eq(ObjectUtil.isNotEmpty(userPhone), UserFields.USER_PHONE, userPhone)
                .eq(ObjectUtil.isNotEmpty(userEmail), UserFields.USER_EMAIL, userEmail)
                .eq(ObjectUtil.isNotEmpty(userStatus), UserFields.USER_STATUS, userStatus);

        // 模糊查询
        queryWrapper.like(ObjectUtil.isNotEmpty(userName), UserFields.USER_NAME, userName)
                .like(ObjectUtil.isNotEmpty(userProfile), UserFields.USER_PROFILE, userProfile);

        // 时间范围查询
        queryWrapper.ge(ObjectUtil.isNotEmpty(createTimeStart), BaseFields.CREATE_TIME, createTimeStart)
                .le(ObjectUtil.isNotEmpty(createTimeEnd), BaseFields.CREATE_TIME, createTimeEnd);

        // 排序字段处理
        String sortField = adminQueryUserRequest.getSortField(); // 排序字段
        String sortOrder = adminQueryUserRequest.getSortOrder(); // 排序方式
        // 创建支持排序字段白名单
        Set<String> allowedSortFields = Set.of(BaseFields.ID, UserFields.USER_ACCOUNT, UserFields.USER_PHONE,
                UserFields.USER_EMAIL, UserFields.USER_STATUS, BaseFields.CREATE_TIME);

        if (ObjectUtil.isNotEmpty(sortField) && ObjectUtil.isNotEmpty(sortOrder)) {
            ThrowUtils.throwIf(!allowedSortFields.contains(sortField), ErrorCode.PARAMS_ERROR,
                    "不支持的排序字段: " + sortField);
            // 排序方式
            boolean isAsc = PageConstant.ASC.equals(sortOrder);
            queryWrapper.orderBy(true, isAsc, sortField);
        } else {
            // 默认按创建时间降序排序
            queryWrapper.orderByDesc(BaseFields.CREATE_TIME);
        }

        // 返回查询包装器
        return queryWrapper;
    }

    /**
     * 管理员重置用户密码.
     *
     * @param adminResetUserPwdRequest {@linkplain AdminResetUserPwdRequest 管理员重置用户密码请求体}
     * @return 是否重置成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean adminResetUserPassword(AdminResetUserPwdRequest adminResetUserPwdRequest) {
        // 检查用户是否存在
        User user = this.getUserByIdAndThrow(adminResetUserPwdRequest.getId());

        // 校验校验新密码是否符合要求
        String newPassword = adminResetUserPwdRequest.getNewPassword();
        // 校验密码强度（必须包含大写字母、小写字母、数字和特殊字符）（双重保险）
        if (!PasswordUtils.isValidStrong(newPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, UserConstant.CREDENTIAL_FORMAT_MSG);
        }

        // 加密新密码
        String encryptedNewPassword = PasswordUtils.encrypt(newPassword);

        // 执行密码更新
        User updateUser = new User();
        updateUser.setId(user.getId());
        updateUser.setUserPassword(encryptedNewPassword);
        boolean updateResult = this.updateById(updateUser);
        ThrowUtils.throwIf(!updateResult, ErrorCode.SYSTEM_ERROR, UserConstant.RESET_CREDENTIAL_FAILED_MSG);

        expireUserSessions(user.getId());

        // 返回重置结果
        return true;
    }

    /**
     * 管理员封禁或解封用户.
     *
     * @param adminBanUserRequest {@linkplain AdminBanUserRequest 管理员封禁或解封用户请求体}
     * @param request {@linkplain HttpServletRequest HTTP 请求对象}
     * @return 是否操作成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean adminBanOrUnbanUser(AdminBanUserRequest adminBanUserRequest, HttpServletRequest request) {
        // 1. 获取请求体中的参数
        Long userId = adminBanUserRequest.getId();
        Integer userStatus = adminBanUserRequest.getUserStatus();

        // 2. 获取当前登录用户
        UserLoginVo loginUser = this.getLoginUser(request);
        ThrowUtils.throwIf(loginUser.getId().equals(userId), ErrorCode.NOT_AUTH_ERROR, "管理员不能封禁或解封自己");

        // 3. 查询用户是否存在
        User user = this.getUserByIdAndThrow(userId);

        // 4. 检查当前用户状态是否与请求状态相同
        Integer currentUserStatus = user.getUserStatus();
        if (currentUserStatus != null && currentUserStatus.equals(userStatus)) {
            String statusDesc = UserStatusEnum.getStatusByValue(currentUserStatus);
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户已处于" + statusDesc + "状态，无需重复操作");
        }

        // 5. 执行封禁或解封操作
        User updateUser = new User();
        updateUser.setId(userId);
        updateUser.setUserStatus(userStatus);
        boolean updateResult = this.updateById(updateUser);
        ThrowUtils.throwIf(!updateResult, ErrorCode.OPERATION_ERROR, "用户封禁或解封失败，数据库更新异常");

        // 6. 如果是封禁用户，则主动使该用户的已有会话失效（强制用户退出登录）
        if (UserStatusEnum.isBanned(userStatus)) {
            expireUserSessions(userId);
        }

        // 7. 返回操作结果
        return true;
    }

    /**
     * 根据内部 ID 查找用户，抛出异常防御.
     *
     * @param id 用户 ID
     * @return 用户实体
     */
    private User getUserByIdAndThrow(Long id) {
        User user = this.getById(id);
        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, UserConstant.ACCOUNT_NOT_EXIST_MSG);
        }
        return user;
    }

    /**
     * 管理员上传或修改头像.
     *
     * @param file {@linkplain MultipartFile 头像文件}
     * @param userId 用户 ID
     * @return 上传后的头像 URL
     */
    @Override
    public String adminUploadAvatar(MultipartFile file, Long userId) {
        // 检查用户 ID 是否存在
        User user = this.getUserByIdAndThrow(userId);
        // 检查用户是否被禁用
        boolean banned = UserStatusEnum.isBanned(user.getUserStatus());
        ThrowUtils.throwIf(banned, ErrorCode.FORBIDDEN_ERROR, UserConstant.ACCOUNT_BANNED_MSG);
        // 执行核心上传逻辑（参数校验、上传文件、回写 URL）
        return coreUploadAvatar(file, userId);
    }
    // endregion

}

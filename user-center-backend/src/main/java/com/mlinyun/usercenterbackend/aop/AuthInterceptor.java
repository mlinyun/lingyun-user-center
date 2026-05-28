package com.mlinyun.usercenterbackend.aop;

import com.mlinyun.usercenterbackend.annotation.AuthCheck;
import com.mlinyun.usercenterbackend.common.ErrorCode;
import com.mlinyun.usercenterbackend.constant.user.UserRoleEnum;
import com.mlinyun.usercenterbackend.exception.BusinessException;
import com.mlinyun.usercenterbackend.model.vo.user.UserLoginVo;
import com.mlinyun.usercenterbackend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 权限校验切面类.
 *
 * <p>
 * 该类使用 AOP（面向切面编程）来实现权限校验的功能， 当方法上使用了 @AuthCheck 注解时，会自动进行权限校验。
 * </p>
 */
@Aspect
@Component
public class AuthInterceptor {

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
    public AuthInterceptor(UserService userService) {
        this.userService = userService;
    }

    /**
     * AOP环绕通知，用于处理带有AuthCheck注解的方法.
     *
     * @param joinPoint 切入点，表示被拦截的方法
     * @param authCheck {@linkplain AuthCheck 权限校验注解实例}
     * @return 方法执行的结果
     * @throws Throwable 可能抛出的异常
     */
    @Around("@annotation(authCheck)")
    public Object doInterceptor(ProceedingJoinPoint joinPoint, AuthCheck authCheck) throws Throwable {
        String mustRole = authCheck.mustRole();
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes == null) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "请求上下文不存在");
        }
        HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
        // 获取登录用户信息
        UserLoginVo loginUser = userService.getLoginUserInfo(request);
        // 判断是否需要权限校验
        UserRoleEnum mustRoleEnum = UserRoleEnum.getRoleEnumByValue(mustRole);
        // 如果不需要权限校验，则直接放行
        if (mustRoleEnum == null) {
            return joinPoint.proceed();
        }
        // 如果需要权限校验，则判断登录用户的角色是否符合要求
        // 获取登录用户的角色枚举
        UserRoleEnum loginUserRoleEnum = loginUser.getUserRole();
        if (loginUserRoleEnum == null) {
            throw new BusinessException(ErrorCode.NOT_AUTH_ERROR);
        }
        // 要求必须有管理员权限，但登录用户没有管理员权限，则抛出异常
        if (UserRoleEnum.ADMIN.equals(mustRoleEnum) && !UserRoleEnum.ADMIN.equals(loginUserRoleEnum)) {
            throw new BusinessException(ErrorCode.NOT_AUTH_ERROR);
        }
        // 通过权限校验，则直接放行
        return joinPoint.proceed();
    }

}

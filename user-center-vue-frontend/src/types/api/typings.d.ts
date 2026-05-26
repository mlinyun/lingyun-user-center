/**
 * API 接口类型定义模块.
 *
 * @description API 接口的响应类型定义
 * @module types/api/typings
 */

/** 导入基础 API 类型定义 */
import type { ApiResponse } from "@/types/http/response.ts";

export declare namespace Api {
    /** 通用类型 */
    namespace Common {
        /** 主键 ID 为雪花算法生成的 ID，用字符串表示 */
        type Id = string;

        /** 日期字符串格式：YYYY-MM-DD */
        type DateString = `${number}-${number}-${number}`;
        /** 时间字符串格式：HH:MM:SS */
        type TimeString = `${number}:${number}:${number}`;
        /** 日期时间字符串格式：YYYY-MM-DD HH:MM:SS */
        type DateTimeString = `${DateString} ${TimeString}`;

        interface BaseFields {
            /** 编辑时间 */
            editTime?: DateTimeString;
            /** 创建时间 */
            createTime?: DateTimeString;
            /** 更新时间 */
            updateTime?: DateTimeString;
        }

        /** 通用操作结果响应数据 */
        type OperationResultResponseData = boolean;
        /** 通用操作结果响应体结构 */
        type OperationResultResponse = ApiResponse<OperationResultResponseData>;

        /** 通用字符串响应数据 */
        type StringResponseData = string;
        /** 通用字符串响应体结构 */
        type StringResponse = ApiResponse<StringResponseData>;

        /** 排序方式 */
        type SortOrder = "ascend" | "descend";

        /** 分页参数 */
        interface PageRequest {
            /** 当前页码 */
            pageNum?: number;
            /** 每页记录数 */
            pageSize?: number;
            /** 排序字段 */
            sortField?: string;
            /** 排序方式 */
            sortOrder?: SortOrder;
        }

        /** 分页结果 */
        interface PageResult<T> {
            /** 数据列表 */
            records?: T[];
            /** 当前页码 */
            current?: number;
            /** 每页大小 */
            size?: number;
            /** 总页数 */
            pages?: number;
            /** 总记录数 */
            total?: number;
        }

        /** 获取或删除通用请求参数 */
        interface GetOrDeleteRequest {
            /** 主键 ID */
            id: Id;
        }
    }

    namespace Main {
        /** 健康检查响应体数据 */
        type HealthCheckResponseData = string;
        /** 健康检查完整响应体结构 */
        type HealthCheckResponse = ApiResponse<HealthCheckResponseData>;
    }

    namespace User {
        /** 用户角色（user: 普通用户 admin: 管理员） */
        type UserRole = "user" | "admin";
        /** 用户性别（0: 女 1: 男 2: 未知） */
        type UserGender = 0 | 1 | 2;
        /** 手机号/邮箱验证状态（0: 未验证 1: 已验证） */
        type VerificationStatus = 0 | 1;
        /** 用户状态（0: 正常 1: 封禁） */
        type UserStatus = 0 | 1;

        /** 用户注册请求体 */
        type UserRegisterRequest = {
            /** 登录账号 */
            userAccount: string;
            /** 登录密码 */
            userPassword: string;
            /** 校验密码 */
            checkPassword: string;
        };
        /** 邮箱注册请求体 */
        type UserEmailRegisterRequest = {
            /** 邮箱地址 */
            userEmail: string;
            /** 邮箱验证码 */
            captchaCode: string;
            /** 登录密码 */
            userPassword: string;
            /** 校验密码 */
            checkPassword: string;
        };
        /** 手机号注册请求体 */
        type UserPhoneRegisterRequest = {
            /** 手机号码 */
            userPhone: string;
            /** 短信验证码 */
            captchaCode: string;
            /** 登录密码 */
            userPassword: string;
            /** 确认密码 */
            checkPassword: string;
        };
        /** 用户注册响应体数据 */
        type UserRegisterResponseData = Common.Id;
        /** 用户注册完整响应体结构 */
        type UserRegisterResponse = ApiResponse<UserRegisterResponseData>;

        /** 用户登录请求体 */
        type UserLoginRequest = {
            /** 登录账号 */
            userAccount: string;
            /** 登录密码 */
            userPassword: string;
        };
        /** 邮箱验证码登录请求体 */
        type UserEmailLoginRequest = {
            /** 邮箱地址 */
            userEmail: string;
            /** 邮箱验证码 */
            captchaCode: string;
        };
        /** 手机号验证码登录请求体 */
        type UserPhoneLoginRequest = {
            /** 手机号码 */
            userPhone: string;
            /** 短信验证码 */
            captchaCode: string;
        };
        /** 用户登录视图对象 */
        interface UserLoginVo {
            /** 用户主键 ID */
            id: Common.Id;
            /** 登录账号 */
            userAccount: string;
            /** 用户昵称 */
            userName: string;
            /** 用户头像 URL */
            userAvatar: string;
            /** 用户简介 */
            userProfile: string;
            /** 用户角色 */
            userRole: UserRole;
            /** 性别（0女 1男 2未知） */
            userGender: UserGender;
            /** 手机号 */
            userPhone: string;
            /** 手机号是否已验证（0未验证 1已验证） */
            phoneVerified: VerificationStatus;
            /** 邮箱地址 */
            userEmail: string;
            /** 邮箱是否已验证（0未验证 1已验证） */
            emailVerified: VerificationStatus;
            /** 状态（0正常 1封禁） */
            userStatus: UserStatus;
            /** 创建时间 */
            createTime: Common.DateTimeString;
        }
        /** 用户登录响应体数据 */
        type UserLoginResponseData = UserLoginVo;
        /** 用户登录完整响应体结构 */
        type UserLoginResponse = ApiResponse<UserLoginResponseData>;

        /** 绑定/换绑邮箱请求体 */
        type UserBindEmailRequest = {
            /** 邮箱地址 */
            userEmail: string;
            /** 邮箱验证码 */
            captchaCode: string;
        };
        /** 绑定/换绑手机号请求体 */
        type UserBindPhoneRequest = {
            /** 手机号码 */
            userPhone: string;
            /** 短信验证码 */
            captchaCode: string;
        };

        /** 用户更新用户信息请求体 */
        type UserUpdateInfoRequest = {
            /** 用户主键 ID，使用雪花算法生成 */
            id: Common.Id;
            /** 用户昵称 */
            userName?: string;
            /** 用户头像 */
            userAvatar?: string;
            /** 用户简介 */
            userProfile?: string;
            /** 性别（0女 1男 2未知） */
            userGender?: UserGender;
        };

        /** 用户更新密码请求体 */
        type UserUpdatePwdRequest = {
            /** 用户主键 ID，使用雪花算法生成 */
            id: Common.Id;
            /** 原始密码 */
            rawPassword: string;
            /** 新的密码 */
            newPassword: string;
            /** 校验密码 */
            checkPassword: string;
        };
        /** 用户邮箱重置密码请求体 */
        type UserEmailResetPwdRequest = {
            /** 用户邮箱 */
            userEmail: string;
            /** 邮箱验证码 */
            captchaCode: string;
            /** 新的密码 */
            newPassword: string;
            /** 校验密码 */
            checkPassword: string;
        };
        /** 用户手机号重置密码请求体 */
        type UserPhoneResetPwdRequest = {
            /** 手机号 */
            userPhone: string;
            /** 短信验证码 */
            captchaCode: string;
            /** 新的密码 */
            newPassword: string;
            /** 校验密码 */
            checkPassword: string;
        };
    }

    namespace UserAdmin {
        /** 管理员添加用户请求体 */
        type AdminAddUserRequest = {
            /** 登录账号 */
            userAccount: string;
            /** 登录密码 */
            userPassword: string;
            /** 校验密码 */
            checkPassword: string;
            /** 用户昵称 */
            userName?: string;
            /** 用户头像 */
            userAvatar?: string;
            /** 用户简介 */
            userProfile?: string;
            /** 用户角色 */
            userRole?: User.UserRole;
            /** 性别（0女 1男 2未知） */
            userGender?: User.UserGender;
            /** 手机号 */
            userPhone?: string;
            /** 邮箱地址 */
            userEmail?: string;
        };
        /** 管理员添加用户响应体数据 */
        type AdminAddUserResponseData = Common.Id;
        /** 管理员添加用户完整响应体结构 */
        type AdminAddUserResponse = ApiResponse<AdminAddUserResponseData>;

        /** 用户视图对象 */
        interface UserVo extends Common.BaseFields {
            /** 用户主键 ID，使用雪花算法生成 */
            id: Common.Id;
            /** 登录账号，必须唯一 */
            userAccount: string;
            /** 用户昵称 */
            userName: string;
            /** 用户头像 URL */
            userAvatar: string;
            /** 用户简介 */
            userProfile: string;
            /** 用户角色 */
            userRole: User.UserRole;
            /** 性别（0女 1男 2未知） */
            userGender: User.UserGender;
            /** 手机号 */
            userPhone: string;
            /** 手机号是否已验证（0未验证 1已验证） */
            phoneVerified: User.VerificationStatus;
            /** 邮箱地址 */
            userEmail: string;
            /** 邮箱是否已验证（0未验证 1已验证） */
            emailVerified: User.VerificationStatus;
            /** 状态（0正常 1封禁） */
            userStatus: User.UserStatus;
        }
        /** 管理员根据 id 获取用户信息响应体数据 */
        type AdminGetUserResponseData = UserVo;
        /** 管理员根据 id 获取用户信息完整响应体结构 */
        type AdminGetUserResponse = ApiResponse<AdminGetUserResponseData>;

        /** 管理员更新用户信息请求体 */
        type AdminUpdateUserInfoRequest = {
            /** 用户主键 ID */
            id: Common.Id;
            /** 用户昵称 */
            userName?: string;
            /** 用户头像 */
            userAvatar?: string;
            /** 用户简介 */
            userProfile?: string;
            /** 用户角色 */
            userRole?: User.UserRole;
        };

        /** 管理员查询用户请求体 */
        interface AdminQueryUserRequest extends Common.PageRequest {
            /** 用户主键 ID */
            id?: Common.Id;
            /** 登录账号 */
            userAccount?: string;
            /** 用户昵称 */
            userName?: string;
            /** 用户简介 */
            userProfile?: string;
            /** 手机号 */
            userPhone?: string;
            /** 邮箱地址 */
            userEmail?: string;
            /** 状态（0正常 1封禁） */
            userStatus?: User.UserStatus;
        }
        /** 管理员分页获取用户列表响应数据 */
        type AdminQueryUserResponseData = Common.PageResult<UserVo>;
        /** 管理员分页获取用户列表完整响应体结构 */
        type AdminQueryUserResponse = ApiResponse<AdminQueryUserResponseData>;

        /** 管理员重置用户密码请求体 */
        type AdminResetUserPwdRequest = {
            /** 用户主键 ID */
            id: Common.Id;
            /** 新的密码 */
            newPassword: string;
        };

        /** 管理员封禁或解封用户请求体 */
        type AdminBanUserRequest = {
            /** 用户主键 ID */
            id: Common.Id;
            /** 状态（0正常 1封禁） */
            userStatus?: User.UserStatus;
        };
    }

    namespace Captcha {
        /** 验证码类型 */
        type CaptchaType = "EMAIL" | "SMS";
        /** 验证码场景 */
        type CaptchaScene = "REGISTER" | "LOGIN" | "RESET_PWD" | "BIND_CHANGE";

        /** 发送验证码请求体 */
        type SendCaptchaRequest = {
            /** 验证码类型: EMAIL / SMS */
            type: CaptchaType;
            /** 验证码场景: REGISTER / LOGIN / RESET_PWD / BIND_CHANGE */
            scene: CaptchaScene;
            /** 发送目标（邮箱地址或手机号） */
            target: string;
        };
    }
}

/**
 * 用户模块 API 接口定义
 *
 * @description 该模块包含用户相关的 API 接口定义，如用户注册、登录、获取用户信息等
 *
 * ## 主要功能
 * - 用户注册接口：支持账号注册、邮箱注册和手机号注册
 * - 用户登录接口：支持账号登录、邮箱验证码登录和手机号验证码登录
 * - 获取当前登录用户信息接口：获取当前登录用户的详细信息
 * - 用户注销接口：用户进行注销操作
 * - 更新用户信息接口：用户更新自己的信息，如用户名、简介等
 * - 更新用户密码接口：用户更新自己的登录密码
 * - 通过邮箱重置密码接口：用户通过邮箱验证码重置密码（忘记密码）
 * - 通过手机号重置密码接口：用户通过短信验证码重置密码（忘记密码）
 *
 * @module api/user-profile
 */
import { http } from "@/utils/request";
import type { AxiosResponse } from "axios";
import type { Api } from "@/types/api/typings";

/**
 * 用户注册 - 账号注册.
 * @name userRegister
 * @tags 用户模块
 * @description 用户注册接口，用户通过提供登录账号、密码和校验密码进行注册
 * @request POST `/user/register/account`
 * @param data 用户注册请求体，详见 {@linkcode Api.User.UserRegisterRequest}
 * @returns 用户注册响应结果，详见 {@linkcode Api.User.UserRegisterResponse}
 */
export const userRegister = (
    data: Api.User.UserRegisterRequest
): Promise<AxiosResponse<Api.User.UserRegisterResponse>> => {
    return http.post<Api.User.UserRegisterResponseData>("/user/register/account", data, {
        showSuccessMessage: true,
        successMessage: "用户注册成功",
    });
};

/**
 * 用户注册 - 邮箱注册.
 * @name userEmailRegister
 * @tags 用户模块
 * @description 邮箱注册接口，用户通过提供邮箱地址、邮箱验证码、登录密码和校验密码进行注册
 * @request POST `/user/register/email`
 * @param data 邮箱注册请求体，详见 {@linkcode Api.User.UserEmailRegisterRequest}
 * @returns 用户注册响应结果，详见 {@linkcode Api.User.UserRegisterResponse}
 */
export const userEmailRegister = (
    data: Api.User.UserEmailRegisterRequest
): Promise<AxiosResponse<Api.User.UserRegisterResponse>> => {
    return http.post<Api.User.UserRegisterResponseData>("/user/register/email", data, {
        showSuccessMessage: true,
        successMessage: "邮箱注册成功",
    });
};

/**
 * 用户注册 - 手机号注册.
 * @name userPhoneRegister
 * @tags 用户模块
 * @description 手机号注册接口，用户通过提供手机号码、短信验证码、登录密码和确认密码进行注册
 * @request POST `/user/register/phone`
 * @param data 手机号注册请求体，详见 {@linkcode Api.User.UserPhoneRegisterRequest}
 * @returns 用户注册响应结果，详见 {@linkcode Api.User.UserRegisterResponse}
 */
export const userPhoneRegister = (
    data: Api.User.UserPhoneRegisterRequest
): Promise<AxiosResponse<Api.User.UserRegisterResponse>> => {
    return http.post<Api.User.UserRegisterResponseData>("/user/register/phone", data, {
        showSuccessMessage: true,
        successMessage: "手机号注册成功",
    });
};

/**
 * 用户登录 - 账号登录.
 * @name userLogin
 * @tags 用户模块
 * @description 用户登录接口，用户通过提供登录账号和登录密码进行登录
 * @request POST `/user/login/account`
 * @param data 用户登录请求体，详见 {@linkcode Api.User.UserLoginRequest}
 * @returns 用户登录响应结果，详见 {@linkcode Api.User.UserLoginResponse}
 */
export const userLogin = (data: Api.User.UserLoginRequest): Promise<AxiosResponse<Api.User.UserLoginResponse>> => {
    return http.post<Api.User.UserLoginResponseData>("/user/login/account", data, {
        showSuccessMessage: true,
        successMessage: "登录成功",
    });
};

/**
 * 用户登录 - 邮箱验证码登录.
 * @name userEmailLogin
 * @tags 用户模块
 * @description 邮箱验证码登录接口，用户通过提供邮箱地址和邮箱验证码进行登录
 * @request POST `/user/login/email`
 * @param data 邮箱验证码登录请求体，详见 {@linkcode Api.User.UserEmailLoginRequest}
 * @returns 用户登录响应结果，详见 {@linkcode Api.User.UserLoginResponse}
 */
export const userEmailLogin = (
    data: Api.User.UserEmailLoginRequest
): Promise<AxiosResponse<Api.User.UserLoginResponse>> => {
    return http.post<Api.User.UserLoginResponseData>("/user/login/email", data, {
        showSuccessMessage: true,
        successMessage: "登录成功",
    });
};

/**
 * 用户登录 - 手机号验证码登录.
 * @name userPhoneLogin
 * @tags 用户模块
 * @description 手机号验证码登录接口，用户通过提供手机号码和短信验证码进行登录
 * @request POST `/user/login/phone`
 * @param data 手机号验证码登录请求体，详见 {@linkcode Api.User.UserPhoneLoginRequest}
 * @returns 用户登录响应结果，详见 {@linkcode Api.User.UserLoginResponse}
 */
export const userPhoneLogin = (
    data: Api.User.UserPhoneLoginRequest
): Promise<AxiosResponse<Api.User.UserLoginResponse>> => {
    return http.post<Api.User.UserLoginResponseData>("/user/login/phone", data, {
        showSuccessMessage: true,
        successMessage: "登录成功",
    });
};

/**
 * 绑定或换绑邮箱.
 * @name userBindEmail
 * @tags 用户模块
 * @description 绑定或换绑邮箱接口，用户通过提供邮箱地址和邮箱验证码进行绑定或换绑邮箱
 * @request POST `/user/bind/email`
 * @param data 绑定或换绑邮箱请求体，详见 {@linkcode Api.User.UserBindEmailRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const userBindEmail = (
    data: Api.User.UserBindEmailRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/user/bind/email", data, {
        showSuccessMessage: true,
        successMessage: "邮箱绑定成功",
    });
};

/**
 * 绑定或换绑手机号.
 * @name userBindPhone
 * @tags 用户模块
 * @description 绑定或换绑手机号接口，用户通过提供手机号码和短信验证码进行绑定或换绑手机号
 * @request POST `/user/bind/phone`
 * @param data 绑定或换绑手机号请求体，详见 {@linkcode Api.User.UserBindPhoneRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const userBindPhone = (
    data: Api.User.UserBindPhoneRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/user/bind/phone", data, {
        showSuccessMessage: true,
        successMessage: "手机号绑定成功",
    });
};

/**
 * 获取当前登录用户信息.
 * @name getLoginUserInfo
 * @tags 用户模块
 * @description 获取当前登录用户信息接口，用户通过调用该接口获取当前登录用户的详细信息
 * @request GET `/user/current`
 * @returns 当前登录用户信息响应结果，详见 {@linkcode Api.User.UserLoginResponse}
 */
export const getLoginUserInfo = (): Promise<AxiosResponse<Api.User.UserLoginResponse>> => {
    return http.get<Api.User.UserLoginResponseData>("/user/current", undefined, {
        showSuccessMessage: false,
    });
};

/**
 * 用户注销.
 * @name userLogout
 * @tags 用户模块
 * @description 用户注销接口，用户通过调用该接口进行注销
 * @request POST `/user/logout`
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const userLogout = (): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/user/logout", undefined, {
        showSuccessMessage: true,
        successMessage: "注销成功",
    });
};

/**
 * 更新用户信息.
 * @name userUpdateInfo
 * @tags 用户模块
 * @description 更新用户信息接口，用户通过提供用户主键 ID 和需要更新的用户信息字段进行更新
 * @request POST `/user/update-info`
 * @param data 更新用户信息请求体，详见 {@linkcode Api.User.UserUpdateInfoRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const userUpdateInfo = (
    data: Api.User.UserUpdateInfoRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/user/update-info", data, {
        showSuccessMessage: true,
        successMessage: "用户信息更新成功",
    });
};

/**
 * 更新用户密码.
 * @name userUpdatePwd
 * @tags 用户模块
 * @description 更新用户密码接口，用户通过提供用户主键 ID、原始密码、新密码和确认新密码进行更新密码操作
 * @request POST `/user/update-pwd`
 * @param data 更新用户密码请求体，详见 {@linkcode Api.User.UserUpdatePwdRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const userUpdatePwd = (
    data: Api.User.UserUpdatePwdRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/user/update-pwd", data, {
        showSuccessMessage: true,
        successMessage: "用户密码更新成功",
    });
};

/**
 * 通过邮箱重置密码.
 * @name userEmailResetPwd
 * @tags 用户模块
 * @description 通过邮箱验证码重置密码接口（忘记密码）
 * @request POST `/user/reset-pwd/email`
 * @param data 邮箱重置密码请求体，详见 {@linkcode Api.User.UserEmailResetPwdRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const userEmailResetPwd = (
    data: Api.User.UserEmailResetPwdRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/user/reset-pwd/email", data, {
        showSuccessMessage: true,
        successMessage: "密码重置成功",
    });
};

/**
 * 通过手机号重置密码.
 * @name userPhoneResetPwd
 * @tags 用户模块
 * @description 通过短信验证码重置密码接口（忘记密码）
 * @request POST `/user/reset-pwd/phone`
 * @param data 手机号重置密码请求体，详见 {@linkcode Api.User.UserPhoneResetPwdRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const userPhoneResetPwd = (
    data: Api.User.UserPhoneResetPwdRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/user/reset-pwd/phone", data, {
        showSuccessMessage: true,
        successMessage: "密码重置成功",
    });
};

/**
 * 用户上传或修改头像.
 * @name userUploadAvatar
 * @tags 用户模块
 * @description 用户上传或修改头像接口，用户通过上传头像文件来更新自己的头像
 * @request POST `/user/avatar`
 * @param file 头像文件
 * @returns 上传后的头像 URL，详见 {@linkcode Api.Common.StringResponse}
 */
export const userUploadAvatar = (file: File): Promise<AxiosResponse<Api.Common.StringResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    return http.post<Api.Common.StringResponseData>("/user/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        showSuccessMessage: true,
        successMessage: "头像上传成功",
    });
};

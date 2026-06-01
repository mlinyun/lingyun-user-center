// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 上传/修改头像 上传头像文件并更新当前登录用户的头像 POST /auth/avatar */
export async function userUploadAvatar(
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/user/avatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 绑定/换绑邮箱 用户绑定或换绑邮箱，需提供新邮箱及验证码 POST /auth/bind/email */
export async function userBindEmail(
  body: API.UserBindEmailRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/bind/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 绑定/换绑手机号 用户绑定或换绑手机号，需提供新手机号及短信验证码 POST /auth/bind/phone */
export async function userBindPhone(
  body: API.UserBindPhoneRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/bind/phone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取登录用户信息 获取登录用户信息接口 GET /auth/current */
export async function getLoginUserInfo(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserLoginVo>("/user/current", {
    method: "GET",
    ...(options || {}),
  });
}

/** 用户登录 通过账号和密码进行登录 POST /auth/login/account */
export async function userLogin(
  body: API.UserLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserLoginVo>("/user/login/account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 邮箱验证码登录 通过邮箱验证码登录，无需密码 POST /auth/login/email */
export async function userEmailLogin(
  body: API.UserEmailLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserLoginVo>("/user/login/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 手机号验证码登录 通过短信验证码登录，无需密码 POST /auth/login/phone */
export async function userPhoneLogin(
  body: API.UserPhoneLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserLoginVo>("/user/login/phone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户注销 用户注销接口 POST /auth/logout */
export async function userLogout(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>("/user/logout", {
    method: "POST",
    ...(options || {}),
  });
}

/** 用户注册 通过账号和密码进行注册 POST /auth/register/account */
export async function userRegister(
  body: API.UserRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/user/register/account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 邮箱注册 通过邮箱验证码注册 POST /auth/register/email */
export async function userEmailRegister(
  body: API.UserEmailRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/user/register/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 手机号注册 通过短信验证码注册 POST /auth/register/phone */
export async function userPhoneRegister(
  body: API.UserPhoneRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/user/register/phone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 通过邮箱重置密码 通过邮箱验证码验证身份后重置密码 POST /auth/reset-pwd/email */
export async function userResetPwd(
  body: API.UserEmailResetPwdRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/reset-pwd/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 通过手机号重置密码 通过短信验证码验证身份后重置密码 POST /auth/reset-pwd/phone */
export async function userPhoneResetPwd(
  body: API.UserPhoneResetPwdRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/reset-pwd/phone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户信息 更新用户信息接口 POST /auth/update-info */
export async function userUpdateInfo(
  body: API.UserUpdateInfoRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/update-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新密码 用户更新密码接口 POST /auth/update-pwd */
export async function userUpdatePwd(
  body: API.UserUpdatePwdRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/user/update-pwd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

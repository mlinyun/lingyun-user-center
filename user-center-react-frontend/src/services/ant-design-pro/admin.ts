// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 管理员添加用户 管理员添加用户接口 POST /admin/auth/add */
export async function adminAddUser(
  body: API.AdminAddUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/admin/user/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员上传或修改头像 管理员上传或修改头像接口 POST /admin/auth/avatar */
export async function adminUploadAvatar(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.adminUploadAvatarParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString>("/admin/user/avatar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员根据 id 删除用户 管理员根据 id 删除用户接口 POST /admin/auth/delete */
export async function adminDeleteUserById(
  body: API.GetOrDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/admin/user/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员根据 id 获取用户信息 管理员根据 id 获取用户信息接口 POST /admin/auth/get */
export async function adminGetUserById(
  body: API.GetOrDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserVo>("/admin/user/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员分页获取用户列表 管理员分页获取用户列表接口 POST /admin/auth/page */
export async function adminGetUserInfoByPage(
  body: API.AdminQueryUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageUserVo>("/admin/user/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员重置用户密码 管理员重置用户密码接口 POST /admin/auth/reset */
export async function adminResetUserPwd(
  body: API.AdminResetUserPwdRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/admin/user/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员封禁或解封用户 管理员封禁或解封用户接口 POST /admin/auth/status */
export async function adminBanOrUnbanUser(
  body: API.AdminBanUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/admin/user/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员更新用户信息 管理员更新用户信息接口 POST /admin/auth/update */
export async function adminUpdateUserInfo(
  body: API.AdminUpdateUserInfoRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/admin/user/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 用户管理模块 API 定义
 *
 * @description 该模块包含管理员对用户进行管理的相关 API 接口定义，如添加用户、获取用户信息、删除用户、更新用户信息、分页获取用户列表、重置用户密码和封禁/解封用户等
 *
 * ## 主要功能
 * - 管理员添加用户接口：管理员通过提供必要的用户信息来添加新用户
 * - 管理员根据 id 获取用户信息接口：管理员通过用户 ID 获取该用户的详细信息
 * - 管理员根据 id 删除用户接口：管理员通过用户 ID 删除该用户
 * - 管理员更新用户信息接口：管理员通过提供更新后的用户信息来更新该用户的信息
 * - 管理员分页获取用户列表接口：管理员通过提供分页查询参数来获取用户列表的分页结果
 * - 管理员重置用户密码接口：管理员通过提供用户 ID 来重置该用户的登录密码
 * - 管理员封禁/解封用户接口：管理员通过提供用户 ID 和操作类型来封禁或解封该用户
 *
 * @module api/user-admin
 */
import { http } from "@/utils/request";
import type { AxiosResponse } from "axios";
import type { Api } from "@/types/api/typings";

/**
 * 管理员添加用户.
 * @name adminAddUser
 * @tags 用户管理模块
 * @description 管理员添加用户接口
 * @request POST `/admin/user/add`
 * @param data 管理员添加用户请求体，详见 {@linkcode Api.UserAdmin.AdminAddUserRequest}
 * @returns 添加成功的用户 ID，详见 {@linkcode Api.UserAdmin.AdminAddUserResponse}
 */
export const adminAddUser = (
    data: Api.UserAdmin.AdminAddUserRequest
): Promise<AxiosResponse<Api.UserAdmin.AdminAddUserResponse>> => {
    return http.post<Api.UserAdmin.AdminAddUserResponseData>("/admin/user/add", data, {
        showSuccessMessage: true,
        successMessage: "添加用户成功",
    });
};

/**
 * 管理员根据 id 获取用户信息.
 * @name adminGetUserById
 * @tags 用户管理模块
 * @description 管理员根据 id 获取用户信息接口
 * @request POST `/admin/user/get`
 * @param data 获取用户信息参数，详见 {@linkcode Api.Common.GetOrDeleteRequest}
 * @returns 获取到的用户信息，详见 {@linkcode Api.UserAdmin.AdminGetUserResponse}
 */
export const adminGetUserById = (
    data: Api.Common.GetOrDeleteRequest
): Promise<AxiosResponse<Api.UserAdmin.AdminGetUserResponse>> => {
    return http.post<Api.UserAdmin.AdminGetUserResponseData>("/admin/user/get", data, {
        showSuccessMessage: false,
    });
};

/**
 * 管理员根据 id 删除用户.
 * @name adminDeleteUserById
 * @tags 用户管理模块
 * @description 管理员根据 id 删除用户接口
 * @request POST `/admin/user/delete`
 * @param data 删除用户参数，详见 {@linkcode Api.Common.GetOrDeleteRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const adminDeleteUserById = (
    data: Api.Common.GetOrDeleteRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/admin/user/delete", data, {
        showSuccessMessage: true,
        successMessage: "删除用户成功",
    });
};

/**
 * 管理员更新用户信息.
 * @name adminUpdateUserInfo
 * @tags 用户管理模块
 * @description 管理员更新用户信息接口
 * @request POST `/admin/user/update`
 * @param data 管理员更新用户信息请求体，详见 {@linkcode Api.UserAdmin.AdminUpdateUserInfoRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const adminUpdateUserInfo = (
    data: Api.UserAdmin.AdminUpdateUserInfoRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/admin/user/update", data, {
        showSuccessMessage: true,
        successMessage: "更新用户信息成功",
    });
};

/**
 * 管理员分页获取用户列表.
 * @name adminGetUserInfoByPage
 * @tags 用户管理模块
 * @description 管理员分页获取用户列表接口
 * @request POST `/admin/user/page`
 * @param data 管理员查询用户请求体，详见 {@linkcode Api.UserAdmin.AdminQueryUserRequest}
 * @returns 用户列表分页结果，详见 {@linkcode Api.UserAdmin.AdminQueryUserResponse}
 */
export const adminGetUserInfoByPage = (
    data: Api.UserAdmin.AdminQueryUserRequest
): Promise<AxiosResponse<Api.UserAdmin.AdminQueryUserResponse>> => {
    return http.post<Api.UserAdmin.AdminQueryUserResponseData>("/admin/user/page", data, {
        showSuccessMessage: false,
    });
};

/**
 * 管理员重置用户密码.
 * @name adminResetUserPwd
 * @tags 用户管理模块
 * @description 管理员重置用户密码接口
 * @request POST `/admin/user/reset`
 * @param data 管理员重置用户密码请求体，详见 {@linkcode Api.UserAdmin.AdminResetUserPwdRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const adminResetUserPwd = (
    data: Api.UserAdmin.AdminResetUserPwdRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/admin/user/reset", data, {
        showSuccessMessage: true,
        successMessage: "重置密码成功",
    });
};

/**
 * 管理员封禁或解封用户.
 * @name adminBanOrUnbanUser
 * @tags 用户管理模块
 * @description 管理员封禁或解封用户接口
 * @request POST `/admin/user/status`
 * @param data 管理员封禁或解封用户请求体，详见 {@linkcode Api.UserAdmin.AdminBanUserRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const adminBanOrUnbanUser = (
    data: Api.UserAdmin.AdminBanUserRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/admin/user/status", data, {
        showSuccessMessage: true,
        successMessage: "操作成功",
    });
};

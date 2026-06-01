import { message } from "antd";
import { useState } from "react";
import { BusinessCode } from "@/constants/code";
import {
  adminAddUser,
  adminBanOrUnbanUser,
  adminDeleteUserById,
  adminGetUserById,
  adminGetUserInfoByPage,
  adminResetUserPwd,
  adminUpdateUserInfo,
  adminUploadAvatar,
} from "@/services/ant-design-pro/admin";
import { userUploadAvatar } from "@/services/ant-design-pro/user";

/**
 * 用户操作 Hook.
 *
 * 封装管理员用户 CRUD 操作和头像上传逻辑。
 * 统一处理提交/加载/上传状态、业务码判断和异常处理。
 */
export const useUserOperations = () => {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * 管理员添加用户.
   */
  const handleAdminAddUser = async (
    payload: API.AdminAddUserRequest,
  ): Promise<boolean> => {
    setSubmitting(true);
    try {
      const response = await adminAddUser(payload);
      return response.code === BusinessCode.SUCCESS && response.success;
    } catch (error) {
      console.log("管理员添加用户失败", error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 管理员重置用户密码.
   */
  const handleAdminResetUserPwd = async (
    payload: API.AdminResetUserPwdRequest,
  ): Promise<boolean> => {
    setSubmitting(true);
    try {
      const response = await adminResetUserPwd(payload);
      return response.code === BusinessCode.SUCCESS && response.success;
    } catch (error) {
      console.log("管理员重置用户密码失败", error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 管理员分页获取用户列表.
   */
  const handleAdminGetUserInfoByPage = async (
    payload: API.AdminQueryUserRequest,
  ): Promise<API.PageUserVo | null> => {
    setLoading(true);
    try {
      const response = await adminGetUserInfoByPage(payload);
      if (
        response.code === BusinessCode.SUCCESS &&
        response.success &&
        response.data
      ) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.log("管理员分页获取用户列表失败", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 管理员根据 id 获取用户信息.
   */
  const handleAdminGetUserById = async (
    userId: number,
  ): Promise<API.UserVo | null> => {
    try {
      const response = await adminGetUserById({ id: userId });
      if (
        response.code === BusinessCode.SUCCESS &&
        response.success &&
        response.data
      ) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.log("管理员根据 id 获取用户信息失败", error);
      return null;
    }
  };

  /**
   * 管理员更新用户信息.
   */
  const handleAdminUpdateUserInfo = async (
    payload: API.AdminUpdateUserInfoRequest,
  ): Promise<boolean> => {
    setSubmitting(true);
    try {
      const response = await adminUpdateUserInfo(payload);
      return response.code === BusinessCode.SUCCESS && response.success;
    } catch (error) {
      console.log("管理员更新用户信息失败", error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 管理员禁用或解禁用户.
   */
  const handleAdminBanOrUnbanUser = async (
    payload: API.AdminBanUserRequest,
  ): Promise<boolean> => {
    try {
      const response = await adminBanOrUnbanUser(payload);
      return response.code === BusinessCode.SUCCESS && response.success;
    } catch (error) {
      console.log("管理员禁用或解禁用户失败", error);
      return false;
    }
  };

  /**
   * 管理员删除用户.
   */
  const handleAdminDeleteUser = async (userId: number): Promise<boolean> => {
    try {
      const response = await adminDeleteUserById({ id: userId });
      return response.code === BusinessCode.SUCCESS && response.success;
    } catch (error) {
      console.log("管理员删除用户失败", error);
      return false;
    }
  };

  /**
   * 处理头像上传.
   *
   * @param file 用户选择的头像文件对象
   * @param userId 当前用户的 ID（管理员为其他用户上传时提供）
   */
  const handleAvatarUpload = async (
    file: File,
    userId?: number,
  ): Promise<string | null> => {
    if (!file) {
      return null;
    }

    const isImage = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ].includes(file.type);
    if (!isImage) {
      message.error("只支持 JPG、JPEG、PNG、WEBP、GIF 格式的图片！");
      return null;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2MB！");
      return null;
    }

    setUploading(true);
    try {
      const response =
        userId !== undefined
          ? await adminUploadAvatar({ userId }, {})
          : await userUploadAvatar({});
      if (
        response.code === BusinessCode.SUCCESS &&
        response.success &&
        response.data
      ) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("头像上传失败:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    submitting,
    uploading,
    loading,
    handleAdminAddUser,
    handleAdminResetUserPwd,
    handleAdminGetUserInfoByPage,
    handleAdminGetUserById,
    handleAdminUpdateUserInfo,
    handleAdminBanOrUnbanUser,
    handleAdminDeleteUser,
    handleAvatarUpload,
  };
};

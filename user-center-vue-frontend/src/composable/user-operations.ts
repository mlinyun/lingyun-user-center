import { ref } from "vue";
import {
    adminAddUser,
    adminBanOrUnbanUser,
    adminDeleteUserById,
    adminGetUserById,
    adminGetUserInfoByPage,
    adminResetUserPwd,
    adminUpdateUserInfo,
    adminUploadAvatar,
} from "@/api/user-admin.ts";
import type { Api } from "@/types/api/typings";
import { BusinessCode } from "@/constants";
import { messageUtils } from "@/utils/message";
import { userUploadAvatar } from "@/api/user.ts";

/**
 * 用户操作组合式函数.
 */
export const useUserOperations = () => {
    /**
     * 提交状态控制.
     */
    const submitting = ref<boolean>(false);

    /**
     * 上传状态控制.
     */
    const uploading = ref<boolean>(false);

    /**
     * 加载状态控制.
     */
    const loading = ref<boolean>(false);

    /**
     * 管理员添加用户.
     *
     * @param payload 管理员添加用户请求体，详见 {@linkcode Api.UserAdmin.AdminAddUserRequest}
     */
    const handleAdminAddUser = async (payload: Api.UserAdmin.AdminAddUserRequest) => {
        submitting.value = true;
        try {
            const { data } = await adminAddUser(payload);
            return data.code === BusinessCode.SUCCESS && data.success;
        } catch (error) {
            console.log("管理员添加用户失败", error);
            return false;
        } finally {
            submitting.value = false;
        }
    };

    /**
     * 管理员重置用户密码.
     *
     * @param payload 管理员重置用户密码请求体，详见 {@linkcode Api.UserAdmin.AdminResetUserPwdRequest}
     */
    const handleAdminResetUserPwd = async (payload: Api.UserAdmin.AdminResetUserPwdRequest) => {
        submitting.value = true;
        try {
            const { data } = await adminResetUserPwd(payload);
            return data.code === BusinessCode.SUCCESS && data.success;
        } catch (error) {
            console.log("管理员重置用户密码失败", error);
            return false;
        } finally {
            submitting.value = false;
        }
    };

    /**
     * 管理员分页获取用户列表.
     *
     * @param payload 管理员查询用户请求体，详见 {@linkcode Api.UserAdmin.AdminQueryUserRequest}
     */
    const handleAdminGetUserInfoByPage = async (payload: Api.UserAdmin.AdminQueryUserRequest) => {
        loading.value = true;
        try {
            const { data } = await adminGetUserInfoByPage(payload);
            if (data.code === BusinessCode.SUCCESS && data.success) {
                return data.data;
            } else {
                return null;
            }
        } catch (error) {
            console.log("管理员分页获取用户列表失败", error);
            return null;
        } finally {
            loading.value = false;
        }
    };

    /**
     * 管理员根据 id 获取用户信息
     *
     * @param userId 用户 ID
     */
    const handleAdminGetUserById = async (userId: string) => {
        try {
            const { data } = await adminGetUserById({ id: userId });
            if (data.code === BusinessCode.SUCCESS && data.success) {
                return data.data;
            } else {
                return null;
            }
        } catch (error) {
            console.log("管理员根据 id 获取用户信息失败", error);
            return null;
        }
    };

    /**
     * 管理员更新用户信息.
     *
     * @param payload
     */
    const handleAdminUpdateUserInfo = async (payload: Api.UserAdmin.AdminUpdateUserInfoRequest) => {
        submitting.value = true;
        try {
            const { data } = await adminUpdateUserInfo(payload);
            return data.code === BusinessCode.SUCCESS && data.success;
        } catch (error) {
            console.log("管理员更新用户信息失败", error);
            return false;
        } finally {
            submitting.value = false;
        }
    };

    /**
     * 管理员禁用或解禁用户.
     *
     * @param payload 管理员禁用或解禁用户请求体，详见 {@linkcode Api.UserAdmin.AdminBanUserRequest}
     */
    const handleAdminBanOrUnbanUser = async (payload: Api.UserAdmin.AdminBanUserRequest) => {
        try {
            const { data } = await adminBanOrUnbanUser(payload);
            return data.code === BusinessCode.SUCCESS && data.success;
        } catch (error) {
            console.log("管理员禁用或解禁用户失败", error);
            return false;
        }
    };

    /**
     * 管理员删除用户.
     *
     * @param userId 用户 ID
     */
    const handleAdminDeleteUser = async (userId: string) => {
        try {
            const { data } = await adminDeleteUserById({ id: userId });
            return data.code === BusinessCode.SUCCESS && data.success;
        } catch (error) {
            console.log("管理员删除用户失败", error);
            return false;
        }
    };

    /**
     * 处理头像上传.
     *
     * @param file 用户选择的头像文件对象
     * @param userId 当前用户的 ID
     */
    const handleAvatarUpload = async (file: File, userId?: string) => {
        if (!file) {
            return null;
        }

        const isImage = ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type);
        if (!isImage) {
            messageUtils.error("只支持 JPG、PNG、GIF 格式的图片！");
            return null;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            messageUtils.error("图片大小不能超过 2MB！");
            return null;
        }

        uploading.value = true;
        try {
            const { data } = userId ? await adminUploadAvatar(file, userId) : await userUploadAvatar(file);
            if (data.code === BusinessCode.SUCCESS && data.success) {
                return data.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("头像上传失败:", error);
            return null;
        } finally {
            uploading.value = false;
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

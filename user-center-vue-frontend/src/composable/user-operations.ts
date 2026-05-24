import { ref } from "vue";
import { adminAddUser } from "@/api/user-admin.ts";
import type { Api } from "@/types/api/typings";
import { BusinessCode } from "@/constants";

/**
 * 用户操作组合式函数.
 */
export const useUserOperations = () => {
    /**
     * 提交状态控制
     */
    const submitting = ref(false);

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
    return { submitting, handleAdminAddUser };
};

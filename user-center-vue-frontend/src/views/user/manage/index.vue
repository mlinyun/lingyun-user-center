<script setup lang="ts">
/**
 * 用户管理页面.
 */
import { ref } from "vue";
import CreateUserModal from "@views/user/manage/modules/create-user-modal.vue";
import { PlusOutlined, TeamOutlined } from "@ant-design/icons-vue";
import ResetPasswordModal from "@views/user/manage/modules/reset-password-modal.vue";
import type { Api } from "@/types/api/typings";
import ViewUserDrawer from "@views/user/manage/modules/view-user-drawer.vue";
import EditUserModal from "@views/user/manage/modules/edit-user-modal.vue";
import UserTable from "@views/user/manage/modules/user-table.vue";

defineOptions({ name: "UserManage" });

const createUserModalVisible = ref<boolean>(false);
const resetPasswordModalVisible = ref<boolean>(false);
const viewDrawerVisible = ref<boolean>(false);
const editModalVisible = ref<boolean>(false);
const resetPasswordUser = ref<Api.UserAdmin.UserVo | null>(null);
const viewingUser = ref<Api.UserAdmin.UserVo | null>(null);
const editingUser = ref<Api.UserAdmin.UserVo | null>(null);

const refreshTable = () => {};

/**
 * 关闭抽屉并清除正在查看的用户信息
 */
const closeDrawer = () => {
    viewDrawerVisible.value = false;
    viewingUser.value = null;
};

/**
 * 处理查看用户详情的请求，打开抽屉并显示用户信息
 *
 * @param user 用户信息
 */
const handleViewUser = (user: Api.UserAdmin.UserVo) => {
    viewingUser.value = user;
    viewDrawerVisible.value = true;
};

/**
 * 处理编辑用户信息的请求，打开模态框并显示用户信息
 *
 * @param user 用户信息
 */
const handleEditUser = (user: Api.UserAdmin.UserVo) => {
    editingUser.value = user;
    editModalVisible.value = true;
};

/**
 * 处理重置用户密码的请求，打开模态框并显示用户信息
 *
 * @param user 用户信息
 */
const handleResetPwd = (user: Api.UserAdmin.UserVo) => {
    resetPasswordUser.value = user;
    resetPasswordModalVisible.value = true;
};
</script>

<template>
    <a-layout id="user-manage">
        <a-space class="manage-content" direction="vertical" size="large">
            <a-card :bordered="false" class="overview-card">
                <div class="overview-header">
                    <a-space size="middle">
                        <TeamOutlined class="overview-icon" />
                        <div>
                            <h2 class="overview-title">用户管理</h2>
                            <p class="overview-subtitle">集中管理平台用户账号、权限与安全状态</p>
                        </div>
                    </a-space>
                    <a-button type="primary" @click="createUserModalVisible = true">
                        <PlusOutlined /> 新建用户
                    </a-button>
                </div>
            </a-card>
            <a-card :bordered="true" class="search-card"> 搜索框架 </a-card>
            <a-card :bordered="true">
                <user-table @view="handleViewUser" @edit="handleEditUser" @reset="handleResetPwd" />
            </a-card>
            <create-user-modal v-model:visible="createUserModalVisible" @success="refreshTable" />
            <view-user-drawer v-model:visible="viewDrawerVisible" :user="viewingUser" @close="closeDrawer" />
            <edit-user-modal v-model:visible="editModalVisible" :user="editingUser" @success="refreshTable" />
            <reset-password-modal
                v-model:visible="resetPasswordModalVisible"
                :user="resetPasswordUser"
                @success="refreshTable"
            />
        </a-space>
    </a-layout>
</template>

<style scoped>
#user-manage {
    height: 100%;
    background: rgb(255 255 255 / 80%);
}

.manage-content {
    width: 100%;
}

.overview-card {
    background: linear-gradient(135deg, rgb(22 119 255 / 12%) 0%, rgb(47 84 235 / 8%) 100%);
    border-radius: 12px;
    box-shadow: 0 12px 40px -20px rgb(47 84 235 / 45%);
}

.overview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.overview-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: rgb(0 0 0 / 85%);
}

.overview-subtitle {
    margin: 4px 0 0;
    color: rgb(0 0 0 / 45%);
}

.overview-icon {
    font-size: 32px;
    color: #1677ff;
}
</style>

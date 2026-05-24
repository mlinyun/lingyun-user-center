<script setup lang="ts">
/**
 * 用户管理页面.
 */
import { ref } from "vue";
import CreateUserModal from "@views/user/manage/modules/create-user-modal.vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import ResetPasswordModal from "@views/user/manage/modules/reset-password-modal.vue";
import type { Api } from "@/types/api/typings";
import ViewUserDrawer from "@views/user/manage/modules/view-user-drawer.vue";

defineOptions({ name: "UserManage" });

const createUserModalVisible = ref<boolean>(false);
const resetPasswordModalVisible = ref<boolean>(false);
const viewDrawerVisible = ref<boolean>(false);
const resetPasswordUser = ref<Api.UserAdmin.UserVo | null>(null);
const viewingUser = ref<Api.UserAdmin.UserVo | null>(null);

const refreshTable = () => {};

const closeDrawer = () => {
    viewDrawerVisible.value = false;
    viewingUser.value = null;
};
</script>

<template>
    <a-layout id="user-manage">
        <a-layout-content class="manage-content">
            <div>用户管理页面</div>
            <a-button type="primary" @click="createUserModalVisible = true"> <PlusOutlined /> 新建用户</a-button>
            <create-user-modal v-model:visible="createUserModalVisible" @success="refreshTable" />
            <a-button type="primary" @click="resetPasswordModalVisible = true"> <PlusOutlined /> 重置密码</a-button>
            <reset-password-modal
                v-model:visible="resetPasswordModalVisible"
                :user="resetPasswordUser"
                @success="refreshTable"
            />
            <a-button type="primary" @click="viewDrawerVisible = true"> <PlusOutlined /> 用户详情</a-button>
            <view-user-drawer v-model:visible="viewDrawerVisible" :user="viewingUser" @close="closeDrawer" />
        </a-layout-content>
    </a-layout>
</template>

<style scoped>
#user-manage {
    height: 100%;
    background: rgb(255 255 255 / 80%);
}
</style>

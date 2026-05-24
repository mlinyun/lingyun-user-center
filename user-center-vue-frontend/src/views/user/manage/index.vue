<script setup lang="ts">
/**
 * 用户管理页面.
 */
import { ref } from "vue";
import CreateUserModal from "@views/user/manage/modules/create-user-modal.vue";
import { PlusOutlined } from "@ant-design/icons-vue";

defineOptions({ name: "UserManage" });

const createModalVisible = ref(false);

const refreshTable = () => {};
</script>

<template>
    <a-layout id="user-manage">
        <a-layout-content class="manage-content">
            <div>用户管理页面</div>
            <a-button type="primary" @click="createModalVisible = true"> <PlusOutlined /> 新建用户</a-button>
            <create-user-modal v-model:visible="createModalVisible" @success="refreshTable" />
        </a-layout-content>
    </a-layout>
</template>

<style scoped>
#user-manage {
    height: 100%;
    background: rgb(255 255 255 / 80%);
}
</style>

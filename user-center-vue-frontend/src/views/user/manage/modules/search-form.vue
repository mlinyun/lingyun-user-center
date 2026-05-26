<script setup lang="ts">
/**
 * 搜索表单组件.
 */
import { reactive, ref } from "vue";
import type { FormInstance } from "ant-design-vue";
import { USER_ROLE, USER_STATUS } from "@/constants/user.ts";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import type { Api } from "@/types/api/typings";

defineOptions({ name: "SearchForm" });

const emit = defineEmits<{
    (event: "search", value: typeof searchForm): void;
}>();

const loading = ref<boolean>(false);

// 搜索表单引用
const searchFormRef = ref<FormInstance>();
// 搜索表单数据
const searchForm = reactive<Api.UserAdmin.SearchForm>({
    userAccount: "",
    userName: "",
    userRole: undefined,
    userStatus: undefined,
    userGender: undefined,
    userPhone: "",
    userEmail: "",
    createTimeRange: undefined,
});

const handleSearch = () => {
    emit("search", searchForm);
};

const handleReset = () => {
    searchForm.userAccount = "";
    searchForm.userName = "";
    searchForm.userRole = undefined;
    searchForm.userStatus = undefined;
    searchForm.userGender = undefined;
    searchForm.userPhone = "";
    searchForm.userEmail = "";
    searchForm.createTimeRange = undefined;
    searchFormRef.value?.resetFields();
    searchFormRef.value?.clearValidate();
    emit("search", searchForm);
};
</script>

<template>
    <a-form ref="searchFormRef" :model="searchForm" layout="vertical">
        <a-row :gutter="[8, 8]">
            <a-col :lg="6" :md="8" :sm="12" :xs="24">
                <a-form-item label="用户账号">
                    <a-input v-model:value="searchForm.userAccount" allow-clear placeholder="请输入用户账号" />
                </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :sm="12" :xs="24">
                <a-form-item label="用户昵称">
                    <a-input v-model:value="searchForm.userName" allow-clear placeholder="支持模糊查询" />
                </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :sm="12" :xs="24">
                <a-form-item label="用户角色">
                    <a-select v-model:value="searchForm.userRole" allow-clear placeholder="请选择角色">
                        <a-select-option :value="USER_ROLE.USER">普通用户</a-select-option>
                        <a-select-option :value="USER_ROLE.ADMIN">管理员</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :sm="12" :xs="24">
                <a-form-item label="账号状态">
                    <a-select v-model:value="searchForm.userStatus" allow-clear placeholder="请选择账号状态">
                        <a-select-option :value="USER_STATUS.NORMAL">正常</a-select-option>
                        <a-select-option :value="USER_STATUS.BANNED">封禁</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :sm="12" :xs="24">
                <a-form-item label="性别">
                    <a-select v-model:value="searchForm.userGender" allow-clear placeholder="请选择性别">
                        <a-select-option :value="0">女</a-select-option>
                        <a-select-option :value="1">男</a-select-option>
                        <a-select-option :value="2">未知</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :sm="12" :xs="24">
                <a-form-item label="手机号码">
                    <a-input v-model:value="searchForm.userPhone" allow-clear placeholder="请输入手机号码" />
                </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :sm="12" :xs="24">
                <a-form-item label="邮箱地址">
                    <a-input v-model:value="searchForm.userEmail" allow-clear placeholder="请输入邮箱地址" />
                </a-form-item>
            </a-col>
            <a-col :lg="6" :md="12" :xs="24">
                <a-form-item label="创建时间">
                    <a-range-picker
                        v-model:value="searchForm.createTimeRange"
                        format="YYYY-MM-DD HH:mm"
                        show-time
                        style="width: 100%"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <div class="search-actions">
            <a-space>
                <a-button :loading="loading" type="primary" @click="handleSearch"><SearchOutlined /> 查询</a-button>
                <a-button :disabled="loading" @click="handleReset"><ReloadOutlined /> 重置</a-button>
            </a-space>
        </div>
    </a-form>
</template>

<style scoped>
.search-actions {
    display: flex;
    justify-content: flex-end;
}
</style>

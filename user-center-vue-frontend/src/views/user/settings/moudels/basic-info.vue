<script setup lang="ts">
/**
 * 基本信息卡片
 */
import { UserOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";
import { storeToRefs } from "pinia";
import { reactive, ref, watch } from "vue";
import type { Api } from "@/types/api/typings";
import type { FormInstance } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { messageUtils } from "@/utils/message";
import { formDataValidate } from "@/utils/form/form-data-validate.ts";
import { userUpdateInfo } from "@/api/user.ts";
import { BusinessCode } from "@/constants";

defineOptions({ name: "BasicInfo" });

const authStore = useAuthStore();
// storeToRefs 解构后仍保持响应性
const { user: loginUser } = storeToRefs(authStore);

const labelCol = { span: 0 };
const wrapperCol = { span: 24 };

// 提交按钮状态
const submitting = ref(false);

// 更新基本信息表单引用
const updateInfoFormRef = ref<FormInstance>();

// 更新基本信息表单数据
const updateInfoForm = reactive<Api.User.UserUpdateInfoRequest>({
    id: "",
    userName: "",
    userProfile: "",
    userGender: undefined,
});

// 表单验证规则
const FormRules: Record<string, Rule[]> = {
    userName: [{ max: 20, message: "昵称长度不超过 20 个字符" }],
    userProfile: [{ max: 200, message: "简介长度不超过 200 个字符" }],
};

/**
 * 处理更新基本信息的请求
 */
const handleUpdateInfo = async () => {
    if (!loginUser.value?.id) {
        messageUtils.error("用户信息不存在");
        return;
    }
    // 表单数据验证
    const validated = await formDataValidate(updateInfoFormRef.value!);
    if (!validated) {
        return;
    }
    submitting.value = true;
    try {
        updateInfoForm.id = loginUser.value.id;
        const { data } = await userUpdateInfo(updateInfoForm);
        if (data.code === BusinessCode.SUCCESS && data.success) {
            // 更新成功后刷新用户信息以显示最新的基本信息
            await authStore.refreshCurrentUser();
        }
    } catch (error) {
        console.error("更新基本信息失败:", error);
    } finally {
        submitting.value = false;
    }
};

// 监听登录用户信息变化，自动填充表单中的基本信息字段
watch(
    () => loginUser.value,
    (user) => {
        if (!user) {
            return;
        }
        updateInfoForm.id = user.id || "";
        updateInfoForm.userName = user.userName || "";
        updateInfoForm.userProfile = user.userProfile || "";
        updateInfoForm.userGender = user.userGender;
    },
    { immediate: true }
);
</script>

<template>
    <a-card :bordered="true">
        <template #title>
            <a-space>
                <UserOutlined class="card-icon" />
                <span class="card-title">基本信息</span>
            </a-space>
        </template>
        <a-form
            ref="updateInfoFormRef"
            layout="vertical"
            :model="updateInfoForm"
            @finish="handleUpdateInfo"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
            <a-form-item label="昵称" name="userName" :rules="FormRules.userName">
                <a-input v-model:value="updateInfoForm.userName" placeholder="请输入昵称" size="large" allow-clear />
            </a-form-item>
            <a-form-item label="性别" name="userGender">
                <a-select v-model:value="updateInfoForm.userGender" placeholder="请选择性别" size="large" allow-clear>
                    <a-select-option :value="0">女</a-select-option>
                    <a-select-option :value="1">男</a-select-option>
                    <a-select-option :value="2">未知</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="简介" name="userProfile" :rules="FormRules.userProfile">
                <a-textarea
                    v-model:value="updateInfoForm.userProfile"
                    placeholder="介绍一下自己"
                    size="large"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                    allow-clear
                />
            </a-form-item>
            <a-button type="primary" html-type="submit" size="large" block :loading="submitting">
                修改基本信息
            </a-button>
        </a-form>
    </a-card>
</template>

<style scoped>
.card-icon {
    font-size: 16px;
    color: var(--ant-color-primary);
}

.card-title {
    font-size: 16px;
    font-weight: 600;
}
</style>

<script setup lang="ts">
/**
 * 重置密码模态框组件.
 */
import { useUserOperations } from "@/composable/user-operations.ts";
import type { Api } from "@/types/api/typings";
import { KeyOutlined, LockOutlined } from "@ant-design/icons-vue";
import { reactive, ref, watch } from "vue";
import type { FormInstance } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PWD_REGEX } from "@/constants";
import { messageUtils } from "@/utils/message";
import { formDataValidate } from "@/utils/form/form-data-validate.ts";

defineOptions({ name: "ResetPasswordModal" });

const props = defineProps<{
    visible: boolean;
    user: Api.UserAdmin.UserVo | null;
}>();

const emit = defineEmits<{
    (event: "update:visible", value: boolean): void;
    (event: "success"): void;
}>();

// 管理员重置用户密码表单引用
const resetPwdFormRef = ref<FormInstance>();

// 管理员重置用户密码表单引用
const resetPwdForm = reactive<Api.UserAdmin.AdminResetUserPwdRequest>({
    id: "",
    newPassword: "",
});

// 表单验证规则
const FormRules: Record<string, Rule[]> = {
    newPassword: [
        { required: true, message: "密码是必填项!", trigger: "blur" },
        { min: PASSWORD_MIN_LENGTH, message: `密码长度不小于 ${PASSWORD_MIN_LENGTH} 位!`, trigger: "blur" },
        { max: PASSWORD_MAX_LENGTH, message: `密码长度不大于 ${PASSWORD_MAX_LENGTH} 位!`, trigger: "blur" },
        { pattern: PWD_REGEX, message: "密码需包含大小写字母、数字和特殊字符", trigger: "blur" },
    ],
};

const userOperations = useUserOperations();

const handleCancel = () => {
    emit("update:visible", false);
};

const handleSubmit = async () => {
    if (!props.user?.id || userOperations.submitting.value) {
        messageUtils.error("用户信息不存在或正在提交中");
        return;
    }
    // 表单数据验证
    const validated = await formDataValidate(resetPwdFormRef.value!);
    if (!validated) {
        messageUtils.error("请修正表单中的错误后再提交");
        return;
    }
    try {
        const resetUserPwdResult = await userOperations.handleAdminResetUserPwd(resetPwdForm);
        if (resetUserPwdResult) {
            emit("success");
            emit("update:visible", false);
            resetForm();
        }
    } catch (error) {
        console.error("重置密码失败:", error);
    }
};

/**
 * 重置表单数据和验证状态
 */
const resetForm = () => {
    resetPwdFormRef.value?.resetFields();
    resetPwdFormRef.value?.clearValidate();
};

watch(
    () => props.visible,
    (visible) => {
        if (visible) {
            resetPwdForm.id = props.user?.id || "";
        } else {
            resetForm();
        }
    }
);
</script>

<template>
    <a-modal
        :confirm-loading="userOperations.submitting.value"
        :mask-closable="false"
        :open="props.visible"
        destroy-on-close
        title="重置用户密码"
        width="450px"
        @cancel="handleCancel"
        @ok="handleSubmit"
    >
        <div class="modal-header-card">
            <a-space>
                <KeyOutlined class="header-icon" />
                <div class="header-text">
                    <strong>为用户重置密码</strong>
                    <span>重置后请及时将新密码告知用户并督促尽快修改</span>
                </div>
            </a-space>
        </div>

        <a-alert
            v-if="props.user"
            :message="`当前操作账号：${props.user.userAccount}`"
            class="info-alert"
            description="重置后密码将立即生效，请谨慎操作。"
            show-icon
            type="warning"
        />

        <a-form ref="resetPwdFormRef" :model="resetPwdForm" :rules="FormRules" autocomplete="off" layout="vertical">
            <a-form-item label="新密码" name="newPassword">
                <a-input-password
                    v-model:value="resetPwdForm.newPassword"
                    size="large"
                    allow-clear
                    placeholder="请输入新的登录密码"
                >
                    <template #prefix><LockOutlined /> </template>
                </a-input-password>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped>
.modal-header-card {
    padding: 16px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #fff1b8 0%, #ffe58f 100%);
    border: 1px solid #ffd666;
    border-radius: 12px;
}

.header-icon {
    font-size: 24px;
    color: #fa8c16;
}

.header-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: rgb(0 0 0 / 65%);
}

.info-alert {
    margin-bottom: 16px;
    border-radius: 8px;
}
</style>

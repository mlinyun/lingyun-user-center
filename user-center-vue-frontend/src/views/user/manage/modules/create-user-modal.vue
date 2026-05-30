<script setup lang="ts">
/**
 * 创建用户模态框组件.
 */
import { ref, reactive, watch, toRaw, computed } from "vue";
import {
    PlusOutlined,
    UserOutlined,
    KeyOutlined,
    PhoneOutlined,
    LockOutlined,
    MailOutlined,
    SafetyOutlined,
    TeamOutlined,
    WomanOutlined,
    ManOutlined,
} from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import type { Api } from "@/types/api/typings";
import type { Rule } from "ant-design-vue/es/form";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PHONE_REGEX, PWD_REGEX } from "@/constants";
import { ACCOUNT_REGEX } from "@/constants/validation.ts";
import { useUserOperations } from "@/composable/user-operations.ts";

defineOptions({ name: "CreateUserModal" });

const props = defineProps<{
    visible: boolean;
}>();

const emit = defineEmits<{
    (event: "update:visible", value: boolean): void;
    (event: "success"): void;
}>();

const labelCol = { span: 6 };
const wrapperCol = { span: 16 };

// 管理员创建用户表单引用
const createUserFormRef = ref<FormInstance>();

// 管理员创建用户表单数据
const createUserForm = reactive<Api.UserAdmin.AdminAddUserRequest>({
    userAccount: "",
    userPassword: "",
    checkPassword: "",
    userName: "",
    userProfile: "",
    userRole: "user",
    userGender: 2,
    userPhone: "",
    userEmail: "",
});

// 表单验证规则
const FormRules: Record<string, Rule[]> = {
    userAccount: [
        { required: true, message: "登录账号是必填项!", trigger: "blur" },
        { min: 4, message: "账号长度不小于 4 位!", trigger: "blur" },
        { max: 16, message: "账号长度不大于 16 位!", trigger: "blur" },
        { pattern: ACCOUNT_REGEX, message: "账号只能包含字母、数字和下划线", trigger: "blur" },
    ],
    userPassword: [
        { required: true, message: "登录密码是必填项!", trigger: "blur" },
        { min: PASSWORD_MIN_LENGTH, message: `密码长度不小于 ${PASSWORD_MIN_LENGTH} 位!`, trigger: "blur" },
        { max: PASSWORD_MAX_LENGTH, message: `密码长度不大于 ${PASSWORD_MAX_LENGTH} 位!`, trigger: "blur" },
        { pattern: PWD_REGEX, message: "密码需包含大小写字母、数字和特殊字符", trigger: "blur" },
    ],
    checkPassword: [
        { required: true, message: "请确认登录密码!", trigger: "blur" },
        {
            validator: (_rule, value) => {
                if (value !== createUserForm.userPassword) {
                    return Promise.reject("两次输入的密码不一致!");
                }
                return Promise.resolve();
            },
            trigger: "blur",
        },
    ],
    userName: [{ max: 20, message: "昵称长度不超过 20 个字符", trigger: "blur" }],
    userProfile: [{ max: 200, message: "简介长度不超过 200 个字符", trigger: "blur" }],
    userEmail: [{ type: "email", message: "邮箱格式不正确!", trigger: "blur" }],
    userPhone: [{ pattern: PHONE_REGEX, message: "手机号格式不正确!", trigger: "blur" }],
};

const userOperations = useUserOperations();

const handleCancel = () => {
    emit("update:visible", false);
};

const handleSubmit = async () => {
    // 这里不对表单数据进行校验，允许部分字段为空
    try {
        // 构建管理员创建用户请求对象（过滤掉空值字段）
        const payload: Api.UserAdmin.AdminAddUserRequest = Object.fromEntries(
            Object.entries(toRaw(createUserForm)).filter(
                ([, value]) => value !== null && value !== undefined && value !== ""
            )
        ) as Api.UserAdmin.AdminAddUserRequest;
        const adminAddUserResult = await userOperations.handleAdminAddUser(payload);
        if (adminAddUserResult) {
            emit("success");
            emit("update:visible", false);
            resetForm();
        }
    } catch (error) {
        console.error("创建用户失败:", error);
    }
};

const passwordStrength = ref(0);

const passwordStrengthColor = computed(() => {
    if (passwordStrength.value < 40) return "#ff4d4f";
    if (passwordStrength.value < 70) return "#faad14";
    return "#52c41a";
});

const passwordStrengthText = computed(() => {
    if (passwordStrength.value < 40) return "弱";
    if (passwordStrength.value < 70) return "中";
    return "强";
});

const passwordStrengthStyle = computed(() => ({
    width: `${Math.max(passwordStrength.value, 10)}%`,
    backgroundColor: passwordStrengthColor.value,
}));

const calculatePasswordStrength = (password: string): number => {
    if (!password) {
        return 0;
    }
    let strength = 0;
    if (password.length >= 8) {
        strength += 25;
    }
    if (password.length >= 12) {
        strength += 25;
    }
    if (/[a-z]/.test(password)) {
        strength += 12.5;
    }
    if (/[A-Z]/.test(password)) {
        strength += 12.5;
    }
    if (/\d/.test(password)) {
        strength += 12.5;
    }
    if (/[~`!@#$%^&*()\-_=+[\]{}\\|;:'",<.>/?]/.test(password)) {
        strength += 12.5;
    }
    return Math.min(strength, 100);
};

/**
 * 重置表单数据和验证状态
 * 关闭模态框时调用，确保每次打开都是一个干净的表单
 */
const resetForm = () => {
    passwordStrength.value = 0;
    createUserFormRef.value?.resetFields();
    createUserFormRef.value?.clearValidate();
};

watch(
    () => createUserForm.userPassword,
    (value) => {
        passwordStrength.value = calculatePasswordStrength(value);
    }
);

watch(
    () => props.visible,
    (visible) => {
        if (!visible) {
            resetForm();
        }
    }
);
</script>

<template>
    <a-modal
        :confirm-loading="userOperations.submitting.value"
        :mask-closable="false"
        :ok-button-props="{ loading: userOperations.submitting.value }"
        :open="props.visible"
        destroy-on-close
        title="添加新用户"
        width="600px"
        @cancel="handleCancel"
        @ok="handleSubmit"
    >
        <div class="modal-header-card">
            <a-space>
                <PlusOutlined class="header-icon" />
                <div class="header-text">
                    <strong>创建新用户账号</strong>
                    <span>请填写账号信息并为新用户设置初始密码</span>
                </div>
            </a-space>
        </div>

        <a-form
            ref="createUserFormRef"
            layout="horizontal"
            :model="createUserForm"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            autocomplete="off"
            :rules="FormRules"
        >
            <div class="section">
                <a-divider orientation="left">
                    <a-space>
                        <KeyOutlined />
                        <span>账号信息</span>
                    </a-space>
                </a-divider>
                <a-form-item label="登录账号" name="userAccount" :rules="FormRules.userAccount">
                    <a-input
                        v-model:value="createUserForm.userAccount"
                        allow-clear
                        class="rounded-input"
                        placeholder="请输入登录账号"
                    >
                        <template #prefix><UserOutlined /></template>
                    </a-input>
                </a-form-item>
            </div>

            <div class="section">
                <a-divider orientation="left">
                    <a-space>
                        <LockOutlined />
                        <span>密码设置</span>
                    </a-space>
                </a-divider>
                <a-form-item label="登录密码" name="userPassword" :rules="FormRules.userPassword">
                    <a-input-password
                        v-model:value="createUserForm.userPassword"
                        allow-clear
                        class="rounded-input"
                        placeholder="请输入登录密码"
                    >
                        <template #prefix><LockOutlined /></template>
                    </a-input-password>
                </a-form-item>
                <div v-if="passwordStrength > 0" class="password-strength">
                    <a-space>
                        <span>密码强度：</span>
                        <a-tag :color="passwordStrengthColor">{{ passwordStrengthText }}</a-tag>
                    </a-space>
                    <div class="strength-bar">
                        <div :style="passwordStrengthStyle" class="strength-fill"></div>
                    </div>
                </div>
                <a-form-item label="确认密码" name="checkPassword" :rules="FormRules.checkPassword">
                    <a-input-password
                        v-model:value="createUserForm.checkPassword"
                        allow-clear
                        class="rounded-input"
                        placeholder="请再次输入密码"
                    >
                        <template #prefix><SafetyOutlined /></template>
                    </a-input-password>
                </a-form-item>
            </div>

            <div class="section">
                <a-divider orientation="left">
                    <a-space>
                        <UserOutlined />
                        <span>基本信息</span>
                    </a-space>
                </a-divider>
                <a-form-item label="用户昵称" name="userName" :rules="FormRules.userName">
                    <a-input
                        v-model:value="createUserForm.userName"
                        allow-clear
                        class="rounded-input"
                        placeholder="请输入用户昵称"
                    >
                        <template #prefix><UserOutlined /></template>
                    </a-input>
                </a-form-item>
                <a-form-item label="用户角色" name="userRole">
                    <a-radio-group v-model:value="createUserForm.userRole">
                        <a-radio value="user"><TeamOutlined /> 普通用户</a-radio>
                        <a-radio value="admin"><SafetyOutlined /> 管理员</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="性别" name="userGender">
                    <a-radio-group v-model:value="createUserForm.userGender">
                        <a-radio :value="0"><WomanOutlined style="color: #eb2f96" /> 女</a-radio>
                        <a-radio :value="1"><ManOutlined style="color: #1890ff" /> 男</a-radio>
                        <a-radio :value="2"><UserOutlined style="color: rgb(0 0 0 / 25%)" /> 未知</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="手机号码" name="userPhone" :rules="FormRules.userPhone">
                    <a-input
                        v-model:value="createUserForm.userPhone"
                        allow-clear
                        class="rounded-input"
                        placeholder="请输入手机号码"
                    >
                        <template #prefix><PhoneOutlined /> </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="邮箱地址" name="userEmail" :rules="FormRules.userEmail">
                    <a-input
                        v-model:value="createUserForm.userEmail"
                        allow-clear
                        class="rounded-input"
                        placeholder="请输入邮箱地址"
                    >
                        <template #prefix><MailOutlined /></template>
                    </a-input>
                </a-form-item>
                <a-form-item label="个人简介" name="userProfile" :rules="FormRules.userProfile">
                    <a-textarea
                        v-model:value="createUserForm.userProfile"
                        :maxlength="200"
                        :rows="3"
                        placeholder="请输入个人简介"
                        show-count
                        allow-clear
                    />
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>

<style scoped>
.modal-header-card {
    padding: 16px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
    border: 1px solid #b7eb8f;
    border-radius: 12px;
}

.header-icon {
    font-size: 24px;
    color: #389e0d;
}

.header-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: rgb(0 0 0 / 65%);
}

.section {
    margin-bottom: 24px;
}

.rounded-input :deep(.ant-input),
.rounded-input :deep(.ant-input-affix-wrapper) {
    border-radius: 8px;
}

.password-strength {
    margin: -8px 0 16px 25%;
    color: rgb(0 0 0 / 65%);
}

.strength-bar {
    height: 4px;
    margin-top: 8px;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 2px;
}

.strength-fill {
    height: 100%;
    transition:
        width 0.3s ease,
        background-color 0.3s ease;
}
</style>

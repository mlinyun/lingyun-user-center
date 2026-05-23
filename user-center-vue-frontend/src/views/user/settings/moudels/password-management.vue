<script setup lang="ts">
/**
 * 密码管理卡片
 */
import { useAuthStore } from "@/stores/auth.ts";
import { storeToRefs } from "pinia";
import { reactive, ref, watch } from "vue";
import { BusinessCode, CODE_REGEX, PHONE_REGEX, PWD_REGEX } from "@/constants";
import { LockOutlined, SafetyOutlined, MailOutlined, MobileOutlined, CodeOutlined } from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import type { Api } from "@/types/api/typings";
import type { Rule } from "ant-design-vue/es/form";
import { messageUtils } from "@/utils/message";
import { userEmailResetPwd, userPhoneResetPwd, userUpdatePwd } from "@/api/user.ts";
import { formDataValidate } from "@/utils/form/form-data-validate.ts";
import { useCaptchaSender } from "@/composable/send-captcha.ts";

defineOptions({ name: "PasswordManagement" });

const authStore = useAuthStore();
// storeToRefs 解构后仍保持响应性
const { user: loginUser } = storeToRefs(authStore);

const labelCol = { span: 0 };
const wrapperCol = { span: 24 };

// 更新密码表单引用
const updatePwdFormRef = ref<FormInstance>();
// 更新密码表单数据
const updatePwdForm = reactive<Api.User.UserUpdatePwdRequest>({
    id: "",
    rawPassword: "",
    newPassword: "",
    checkPassword: "",
});
// 通过邮箱重置密码表单引用
const resetEmailFormRef = ref<FormInstance>();
// 通过邮箱重置密码表单数据
const resetEmailForm = reactive<Api.User.UserEmailResetPwdRequest>({
    userEmail: "",
    captchaCode: "",
    newPassword: "",
    checkPassword: "",
});
// 通过手机号码重置密码表单引用
const resetPhoneFormRef = ref<FormInstance>();
// 通过手机号码重置密码表单数据
const resetPhoneForm = reactive<Api.User.UserPhoneResetPwdRequest>({
    userPhone: "",
    captchaCode: "",
    newPassword: "",
    checkPassword: "",
});

// 提交按钮状态
const submitting = reactive({
    updatePwdBtn: false,
    resetEmailBtn: false,
    resetPhoneBtn: false,
});

// 表单验证规则
const FormRules: Record<string, Rule[]> = {
    userPassword: [
        { required: true, message: "密码是必填项!", trigger: "blur" },
        { min: 8, message: "密码长度不小于 8 位!", trigger: "blur" },
        { max: 16, message: "密码长度不大于 16 位!", trigger: "blur" },
        { pattern: PWD_REGEX, message: "密码需包含大小写字母、数字和特殊字符", trigger: "blur" },
    ],
    userEmail: [
        { required: true, message: "邮箱地址是必填项!", trigger: "blur" },
        { type: "email", message: "邮箱格式不正确!", trigger: "blur" },
    ],
    userPhone: [
        { required: true, message: "手机号是必填项!", trigger: "blur" },
        { pattern: PHONE_REGEX, message: "手机号格式不正确!", trigger: "blur" },
    ],
    captchaCode: [
        { required: true, message: "验证码是必填项!", trigger: "blur" },
        // 验证码格式为 6 位数字
        { pattern: CODE_REGEX, message: "验证码格式不正确!", trigger: "blur" },
    ],
};

/**
 * 验证确认密码是否与新密码一致
 *
 * @param targetForm 需要验证的表单对象，包含 newPassword 字段
 * @returns 验证函数，返回 Promise 对象
 */
const validatePasswordConfirm = (targetForm: { newPassword: string }) => {
    return (_rule: unknown, value: string) => {
        if (!value) {
            return Promise.reject(new Error("请再次输入新密码"));
        }
        if (value !== targetForm.newPassword) {
            return Promise.reject(new Error("两次输入的密码不一致"));
        }
        return Promise.resolve();
    };
};

/**
 * 处理原密码修改
 */
const handleUpdatePwd = async () => {
    if (!loginUser.value?.id) {
        messageUtils.error("用户信息不存在！");
        return;
    }
    // 表单数据验证
    const validated = await formDataValidate(updatePwdFormRef.value!);
    if (!validated) {
        return;
    }
    submitting.updatePwdBtn = true;
    try {
        updatePwdForm.id = loginUser.value.id;
        const { data } = await userUpdatePwd(updatePwdForm);
        if (data.code === BusinessCode.SUCCESS && data.success) {
            // 清空表单数据
            updatePwdForm.rawPassword = "";
            updatePwdForm.newPassword = "";
            updatePwdForm.checkPassword = "";
            // 强制刷新当前用户信息
            await authStore.refreshCurrentUser();
        }
    } catch (error) {
        console.log("原密码重置用户密码失败！", error);
    } finally {
        submitting.updatePwdBtn = false;
    }
};

// 邮箱验证码发送器实例
const emailCaptchaSender = useCaptchaSender(
    "EMAIL",
    "RESET_PWD",
    () => resetEmailForm.userEmail,
    "请输入邮箱地址以获取验证码"
);

/**
 * 处理通过邮箱重置密码
 */
const handleResetPwdByEmail = async () => {
    // 表单数据验证
    const validated = await formDataValidate(resetEmailFormRef.value!);
    if (!validated) {
        return;
    }
    submitting.resetEmailBtn = true;
    try {
        const { data } = await userEmailResetPwd(resetEmailForm);
        if (data.code === BusinessCode.SUCCESS && data.success) {
            // 清空表单数据
            resetEmailForm.captchaCode = "";
            resetEmailForm.newPassword = "";
            resetEmailForm.checkPassword = "";
            // 强制刷新当前用户信息
            await authStore.refreshCurrentUser();
        }
    } catch (error) {
        console.log("邮箱重置用户密码失败！", error);
    } finally {
        submitting.resetEmailBtn = false;
    }
};

// 手机号验证码发送器实例
const phoneCaptchaSender = useCaptchaSender(
    "SMS",
    "RESET_PWD",
    () => resetPhoneForm.userPhone,
    "请输入手机号以获取验证码"
);

/**
 * 处理通过手机号重置密码
 */
const handleResetPwdByPhone = async () => {
    // 表单数据验证
    const validated = await formDataValidate(resetPhoneFormRef.value!);
    if (!validated) {
        return;
    }
    submitting.resetPhoneBtn = true;
    try {
        const { data } = await userPhoneResetPwd(resetPhoneForm);
        if (data.code === BusinessCode.SUCCESS && data.success) {
            // 清空表单数据
            resetPhoneForm.captchaCode = "";
            resetPhoneForm.newPassword = "";
            resetPhoneForm.checkPassword = "";
            // 强制刷新当前用户信息
            await authStore.refreshCurrentUser();
        }
    } catch (error) {
        console.log("手机号重置用户密码失败！", error);
    } finally {
        submitting.resetPhoneBtn = false;
    }
};

// 监听登录用户信息变化，自动填充表单中的邮箱和手机号字段
watch(
    () => loginUser.value,
    (user) => {
        if (!user) {
            return;
        }

        updatePwdForm.id = user.id || "";
        if (user.userEmail) {
            resetEmailForm.userEmail = user.userEmail;
        }
        if (user.userPhone) {
            resetPhoneForm.userPhone = user.userPhone;
        }
    },
    { immediate: true }
);
</script>

<template>
    <a-card :bordered="true">
        <template #title>
            <a-space>
                <LockOutlined class="card-icon" />
                <span class="card-title">密码管理</span>
            </a-space>
        </template>
        <a-alert
            message="密码安全建议"
            description="密码需 8-20 位且包含大小写字母、数字和特殊字符，建议定期更换密码以保障账号安全。"
            type="info"
            show-icon
            class="pwd-alert"
        >
            <template #icon>
                <SafetyOutlined />
            </template>
        </a-alert>
        <a-tabs size="small">
            <a-tab-pane key="raw" tab="原密码修改">
                <a-form
                    ref="updatePwdFormRef"
                    layout="vertical"
                    :model="updatePwdForm"
                    @finish="handleUpdatePwd"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-item label="当前密码" name="rawPassword" :rules="FormRules.userPassword">
                        <a-input-password
                            v-model:value="updatePwdForm.rawPassword"
                            size="large"
                            placeholder="请输入当前密码"
                            allow-clear
                        >
                            <template #prefix><LockOutlined /></template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item label="新密码" name="newPassword" :rules="FormRules.userPassword">
                        <a-input-password
                            v-model:value="updatePwdForm.newPassword"
                            size="large"
                            placeholder="请输入新密码"
                            allow-clear
                        >
                            <template #prefix><LockOutlined /></template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item
                        label="确认新密码"
                        name="checkPassword"
                        :rules="[
                            { required: true, message: '请确认新密码' },
                            { validator: validatePasswordConfirm(updatePwdForm) },
                        ]"
                    >
                        <a-input-password
                            v-model:value="updatePwdForm.checkPassword"
                            size="large"
                            placeholder="请再次输入新密码"
                            allow-clear
                        >
                            <template #prefix><LockOutlined /></template>
                        </a-input-password>
                    </a-form-item>
                    <a-button type="primary" html-type="submit" size="large" block :loading="submitting.updatePwdBtn">
                        更新密码
                    </a-button>
                </a-form>
            </a-tab-pane>
            <a-tab-pane key="email" tab="邮箱重置">
                <a-form
                    ref="resetEmailFormRef"
                    layout="vertical"
                    :model="resetEmailForm"
                    @finish="handleResetPwdByEmail"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-item label="邮箱" name="userEmail" :rules="FormRules.userEmail">
                        <a-input
                            v-model:value="resetEmailForm.userEmail"
                            :disabled="resetEmailForm.userEmail !== ''"
                            size="large"
                            placeholder="请输入邮箱地址"
                            allow-clear
                        >
                            <template #prefix><MailOutlined /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item label="验证码" name="captchaCode" :rules="FormRules.captchaCode">
                        <a-space-compact size="large" block>
                            <a-input
                                v-model:value="resetEmailForm.captchaCode"
                                size="large"
                                placeholder="请输入验证码"
                                allow-clear
                            >
                                <template #prefix><CodeOutlined /></template>
                            </a-input>
                            <a-button
                                :disabled="emailCaptchaSender.countdown.value > 0"
                                :loading="emailCaptchaSender.sending.value"
                                @click="emailCaptchaSender.send()"
                                size="large"
                            >
                                {{
                                    emailCaptchaSender.countdown.value > 0
                                        ? `${emailCaptchaSender.countdown.value}秒后重试`
                                        : "获取验证码"
                                }}
                            </a-button>
                        </a-space-compact>
                    </a-form-item>
                    <a-form-item label="新密码" name="newPassword" :rules="FormRules.userPassword">
                        <a-input-password
                            v-model:value="resetEmailForm.newPassword"
                            size="large"
                            placeholder="请输入新密码"
                            allow-clear
                        >
                            <template #prefix><LockOutlined /></template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item
                        label="确认新密码"
                        name="checkPassword"
                        :rules="[
                            { required: true, message: '请确认新密码' },
                            { validator: validatePasswordConfirm(resetEmailForm) },
                        ]"
                    >
                        <a-input-password
                            v-model:value="resetEmailForm.checkPassword"
                            size="large"
                            placeholder="请再次输入新密码"
                            allow-clear
                        >
                            <template #prefix><LockOutlined /></template>
                        </a-input-password>
                    </a-form-item>
                    <a-button type="primary" html-type="submit" size="large" block :loading="submitting.resetEmailBtn">
                        通过邮箱重置密码
                    </a-button>
                </a-form>
            </a-tab-pane>
            <a-tab-pane key="phone" tab="手机号重置">
                <a-form
                    ref="resetPhoneFormRef"
                    layout="vertical"
                    :model="resetPhoneForm"
                    @finish="handleResetPwdByPhone"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-item label="手机号" name="userPhone" :rules="FormRules.userPhone">
                        <a-input
                            v-model:value="resetPhoneForm.userPhone"
                            :disabled="resetPhoneForm.userPhone !== ''"
                            size="large"
                            placeholder="请输入手机号"
                            allow-clear
                        >
                            <template #prefix><MobileOutlined /></template>/>
                        </a-input>
                    </a-form-item>
                    <a-form-item label="验证码" name="captchaCode" :rules="FormRules.captchaCode">
                        <a-space-compact size="large" block>
                            <a-input
                                v-model:value="resetPhoneForm.captchaCode"
                                size="large"
                                placeholder="请输入验证码"
                                allow-clear
                            >
                                <template #prefix><CodeOutlined /></template>
                            </a-input>
                            <a-button
                                :disabled="phoneCaptchaSender.countdown.value > 0"
                                :loading="phoneCaptchaSender.sending.value"
                                @click="phoneCaptchaSender.send()"
                                size="large"
                            >
                                {{
                                    phoneCaptchaSender.countdown.value > 0
                                        ? `${phoneCaptchaSender.countdown.value}秒后重试`
                                        : "获取验证码"
                                }}
                            </a-button>
                        </a-space-compact>
                    </a-form-item>
                    <a-form-item label="新密码" name="newPassword" :rules="FormRules.userPassword">
                        <a-input-password
                            v-model:value="resetPhoneForm.newPassword"
                            size="large"
                            placeholder="请输入新密码"
                            allow-clear
                        >
                            <template #prefix><LockOutlined /></template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item
                        label="确认新密码"
                        name="checkPassword"
                        :rules="[
                            { required: true, message: '请确认新密码' },
                            { validator: validatePasswordConfirm(resetPhoneForm) },
                        ]"
                    >
                        <a-input-password
                            v-model:value="resetPhoneForm.checkPassword"
                            size="large"
                            placeholder="请再次输入新密码"
                            allow-clear
                        >
                            <template #prefix><LockOutlined /></template>
                        </a-input-password>
                    </a-form-item>
                    <a-button type="primary" html-type="submit" size="large" block :loading="submitting.resetPhoneBtn">
                        通过手机号重置密码
                    </a-button>
                </a-form>
            </a-tab-pane>
        </a-tabs>
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

.pwd-alert {
    margin-bottom: 16px;
}
</style>

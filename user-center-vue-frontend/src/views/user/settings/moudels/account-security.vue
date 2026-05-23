<script setup lang="ts">
/**
 * 账户安全设置卡片
 */
import { CodeOutlined, MailOutlined, MobileOutlined, SafetyOutlined } from "@ant-design/icons-vue";
import { BusinessCode, CODE_REGEX, PHONE_REGEX } from "@/constants";
import type { Rule } from "ant-design-vue/es/form";
import { reactive, ref, watch } from "vue";
import type { FormInstance } from "ant-design-vue";
import type { Api } from "@/types/api/typings";
import { useAuthStore } from "@/stores/auth.ts";
import { storeToRefs } from "pinia";
import { formDataValidate } from "@/utils/form/form-data-validate.ts";
import { userBindEmail, userBindPhone } from "@/api/user.ts";
import { useCaptchaSender } from "@/composable/send-captcha.ts";

defineOptions({ name: "AccountSecurity" });

const authStore = useAuthStore();
// storeToRefs 解构后仍保持响应性
const { user: loginUser } = storeToRefs(authStore);

const labelCol = { span: 0 };
const wrapperCol = { span: 24 };

// 绑定/换绑邮箱表单引用
const bindEmailFormRef = ref<FormInstance>();
// 绑定/换绑邮箱表单数据
const bindEmailForm = reactive<Api.User.UserBindEmailRequest>({
    userEmail: "",
    captchaCode: "",
});
// 绑定/换绑手机号表单引用
const bindPhoneFormRef = ref<FormInstance>();
// 绑定/换绑手机号表单数据
const bindPhoneForm = reactive<Api.User.UserBindPhoneRequest>({
    userPhone: "",
    captchaCode: "",
});

// 表单验证规则
const FormRules: Record<string, Rule[]> = {
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

// 提交按钮状态
const submitting = reactive({
    bindEmailBtn: false,
    bindPhoneBtn: false,
});

// 邮箱验证码发送器实例
const emailCaptchaSender = useCaptchaSender(
    "EMAIL",
    "BIND_CHANGE",
    () => bindEmailForm.userEmail,
    "请输入邮箱地址以获取验证码"
);

// 手机号验证码发送器实例
const phoneCaptchaSender = useCaptchaSender(
    "SMS",
    "BIND_CHANGE",
    () => bindPhoneForm.userPhone,
    "请输入手机号以获取验证码"
);

/**
 * 处理绑定/换绑邮箱
 */
const handleBindEmail = async () => {
    // 表单数据验证
    const validated = await formDataValidate(bindEmailFormRef.value!);
    if (!validated) {
        return;
    }
    submitting.bindEmailBtn = true;
    try {
        const { data } = await userBindEmail(bindEmailForm);
        if (data.code === BusinessCode.SUCCESS && data.success) {
            bindEmailForm.captchaCode = "";
            // 强制刷新用户信息以获取最新的邮箱绑定状态
            await authStore.refreshCurrentUser();
        }
    } catch (error) {
        console.error("绑定/换绑邮箱失败:", error);
    } finally {
        submitting.bindEmailBtn = false;
    }
};

/**
 * 处理绑定/换绑手机号
 */
const handleBindPhone = async () => {
    // 表单数据验证
    const validated = await formDataValidate(bindPhoneFormRef.value!);
    if (!validated) {
        return;
    }
    submitting.bindPhoneBtn = true;
    try {
        const { data } = await userBindPhone(bindPhoneForm);
        if (data.code === BusinessCode.SUCCESS && data.success) {
            bindEmailForm.captchaCode = "";
            // 强制刷新用户信息以获取最新的手机号绑定状态
            await authStore.refreshCurrentUser();
        }
    } catch (error) {
        console.error("绑定/换绑手机号失败:", error);
    } finally {
        submitting.bindPhoneBtn = false;
    }
};

// 监听登录用户信息变化，自动填充表单中的邮箱和手机号字段
watch(
    () => loginUser.value,
    (user) => {
        if (!user) {
            return;
        }
        if (user.userEmail) {
            bindEmailForm.userEmail = user.userEmail;
        }
        if (user.userPhone) {
            bindPhoneForm.userPhone = user.userPhone;
        }
    },
    { immediate: true }
);
</script>

<template>
    <a-card :bordered="true">
        <template #title>
            <a-space>
                <SafetyOutlined class="card-icon" />
                <span class="card-title">账号安全</span>
            </a-space>
        </template>
        <div class="security-level">
            <a-typography-title :level="5" class="security-title">安全等级</a-typography-title>
        </div>
        <a-divider />
        <a-tabs size="small">
            <a-tab-pane key="email" tab="邮箱绑定">
                <a-form
                    ref="bindEmailFormRef"
                    layout="vertical"
                    :model="bindEmailForm"
                    @finish="handleBindEmail"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                >
                    <a-form-item label="邮箱" name="userEmail" :rules="FormRules.userEmail">
                        <a-input
                            v-model:value="bindEmailForm.userEmail"
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
                                v-model:value="bindEmailForm.captchaCode"
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
                    <a-button type="primary" html-type="submit" size="large" block :loading="submitting.bindEmailBtn">
                        绑定/换绑邮箱
                    </a-button>
                </a-form>
            </a-tab-pane>
            <a-tab-pane key="phone" tab="手机号绑定">
                <a-form ref="bindPhoneFormRef" layout="vertical" :model="bindPhoneForm" @finish="handleBindPhone">
                    <a-form-item label="手机号" name="userPhone" :rules="FormRules.userPhone">
                        <a-input
                            v-model:value="bindPhoneForm.userPhone"
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
                                v-model:value="bindPhoneForm.captchaCode"
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
                    <a-button type="primary" html-type="submit" size="large" block :loading="submitting.bindPhoneBtn">
                        绑定/换绑手机号
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

.security-level {
    margin-bottom: 24px;
    text-align: center;
}

.security-title {
    margin-bottom: 16px !important;
}
</style>

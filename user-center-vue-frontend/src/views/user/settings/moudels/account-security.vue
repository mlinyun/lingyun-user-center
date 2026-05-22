<script setup lang="ts">
/**
 * 账户安全设置卡片
 */
import { CodeOutlined, MailOutlined, MobileOutlined, SafetyOutlined } from "@ant-design/icons-vue";
import { BusinessCode, CODE_REGEX, PHONE_REGEX } from "@/constants";
import type { Rule } from "ant-design-vue/es/form";
import { reactive, ref, computed, watch, onBeforeUnmount } from "vue";
import type { FormInstance } from "ant-design-vue";
import type { Api } from "@/types/api/typings";
import { useCaptchaCooldown } from "@/utils/captcha/captcha-cooldown.ts";
import { useAuthStore } from "@/stores/auth.ts";
import { storeToRefs } from "pinia";
import { createSendCaptchaHandler } from "@/utils/captcha/send-captcha.ts";
import { formDataValidate } from "@/utils/form/form-data-validate.ts";
import { userBindEmail, userBindPhone } from "@/api/user.ts";

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

// 验证码发送状态
const sendingCaptcha = reactive({
    emailCaptcha: false,
    phoneCaptcha: false,
});

// 邮箱验证码冷却机制实例
const bindEmailCooldown = useCaptchaCooldown();

// 手机号验证码冷却机制实例
const bindPhoneCooldown = useCaptchaCooldown();

// 计算属性，获取邮箱验证码冷却倒计时
const bindEmailCountdown = computed(() => bindEmailCooldown.countdown.value);

// 计算属性，获取手机号验证码冷却倒计时
const bindPhoneCountdown = computed(() => bindPhoneCooldown.countdown.value);

/**
 * 发送绑定/换绑邮箱的验证码
 */
const sendCaptchaForBindEmail = async () => {
    sendingCaptcha.emailCaptcha = true;
    createSendCaptchaHandler("EMAIL", "BIND_CHANGE", () => bindEmailForm.userEmail, "请输入邮箱地址以获取验证码")()
        .then(() => {
            bindEmailCooldown.start();
        })
        .finally(() => {
            sendingCaptcha.emailCaptcha = false;
        });
};

/**
 * 发送绑定/换绑手机号的验证码
 */
const sendCaptchaForBindPhone = async () => {
    sendingCaptcha.phoneCaptcha = true;
    createSendCaptchaHandler("SMS", "BIND_CHANGE", () => bindPhoneForm.userPhone, "请输入手机号以获取验证码")()
        .then(() => {
            bindPhoneCooldown.start();
        })
        .finally(() => {
            sendingCaptcha.phoneCaptcha = false;
        });
};

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

// 组件卸载前清除验证码冷却定时器，避免内存泄漏
onBeforeUnmount(() => {
    bindEmailCooldown.stop();
    bindPhoneCooldown.stop();
});
</script>

<template>
    <a-card :bordered="true">
        <template #title>
            <a-space>
                <SafetyOutlined class="card-icon" />
                <span class="card-title">账号安全</span>
            </a-space>
        </template>
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
                                :disabled="bindEmailCountdown > 0"
                                :loading="sendingCaptcha.emailCaptcha"
                                @click="sendCaptchaForBindEmail"
                                size="large"
                            >
                                {{ bindEmailCountdown > 0 ? `${bindEmailCountdown}秒后重试` : "获取验证码" }}
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
                                :disabled="bindPhoneCountdown > 0"
                                :loading="sendingCaptcha.phoneCaptcha"
                                @click="sendCaptchaForBindPhone"
                                size="large"
                            >
                                {{ bindPhoneCountdown > 0 ? `${bindPhoneCountdown}秒后重试` : "获取验证码" }}
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
</style>

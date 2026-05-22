<script setup lang="ts">
import { ref, reactive, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { userRegister, userEmailRegister, userPhoneRegister } from "@/api/user";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons-vue";
import type { Api } from "@/types/api/typings";
import type { Rule } from "ant-design-vue/es/form";
import { ROUTES } from "@/constants/routes.ts";
import type { AxiosResponse } from "axios";
import { BusinessCode, CODE_REGEX, PHONE_REGEX, PWD_REGEX } from "@/constants";
import { createSendCaptchaHandler } from "@/utils/captcha/send-captcha.ts";
import type { FormInstance } from "ant-design-vue";
import { useCaptchaCooldown } from "@/utils/captcha/captcha-cooldown.ts";

/**
 * 用户注册页面.
 */
defineOptions({ name: "UserRegister" });

const router = useRouter();

const labelCol = { span: 0 };
const wrapperCol = { span: 24 };

// 当前激活的注册方式
const activeKey = ref("account");

// 账号注册表单引用
const accountFormRef = ref<FormInstance>();
// 账号注册表单数据
const accountForm = reactive<Api.User.UserRegisterRequest>({
    userAccount: "",
    userPassword: "",
    checkPassword: "",
});

// 邮箱注册表单引用
const emailFormRef = ref<FormInstance>();
// 邮箱注册表单数据
const emailForm = reactive<Api.User.UserEmailRegisterRequest>({
    userEmail: "",
    captchaCode: "",
    userPassword: "",
    checkPassword: "",
});

// 手机号注册表单引用
const phoneFormRef = ref<FormInstance>();
// 手机号注册表单数据
const phoneForm = reactive<Api.User.UserPhoneRegisterRequest>({
    userPhone: "",
    captchaCode: "",
    userPassword: "",
    checkPassword: "",
});

type SubmitState = {
    accountBtn: boolean;
    emailBtn: boolean;
    phoneBtn: boolean;
};

// 提交按钮状态
const submitting = reactive<SubmitState>({
    accountBtn: false,
    emailBtn: false,
    phoneBtn: false,
});

// 验证码发送状态
const sendingCaptcha = reactive({
    emailCaptcha: false,
    phoneCaptcha: false,
});

// 表单验证规则
const FormRules: Record<string, Rule[]> = {
    userAccount: [
        { required: true, message: "登录账号是必填项!", trigger: "blur" },
        { min: 4, message: "账号长度不小于 4 位!", trigger: "blur" },
        { max: 16, message: "账号长度不大于 16 位!", trigger: "blur" },
    ],
    userPassword: [
        { required: true, message: "登录密码是必填项!", trigger: "blur" },
        { min: 8, message: "密码长度不小于 8 位!", trigger: "blur" },
        { max: 16, message: "密码长度不大于 16 位!", trigger: "blur" },
        { pattern: PWD_REGEX, message: "密码需包含大小写字母、数字和特殊字符", trigger: "blur" },
    ],
    checkPassword: [
        { required: true, message: "请确认登录密码!", trigger: "blur" },
        {
            validator: (_rule, value) => {
                if (value !== accountForm.userPassword) {
                    return Promise.reject("两次输入的密码不一致!");
                }
                return Promise.resolve();
            },
            trigger: "blur",
        },
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

type RegisterApiFunction<TRequest> = (data: TRequest) => Promise<AxiosResponse<Api.User.UserRegisterResponse>>;

const createSubmitHandler =
    <TRequest>(
        apiFn: RegisterApiFunction<TRequest>,
        formData: TRequest,
        submitState: SubmitState,
        submitKey: keyof SubmitState
    ) =>
    async () => {
        submitState[submitKey] = true;
        try {
            const { data } = await apiFn(formData);
            if (data.code === BusinessCode.SUCCESS && data.success) {
                await router.push({ name: ROUTES.LOGIN.name });
            }
        } catch (error) {
            console.log(`注册异常：${error}`);
        } finally {
            submitState[submitKey] = false;
        }
    };

/**
 * 处理账号注册提交
 */
const handleAccountSubmit = async () => {
    await accountFormRef.value?.validate();
    await createSubmitHandler(userRegister, accountForm, submitting, "accountBtn")();
};

/**
 * 处理邮箱注册提交
 */
const handleEmailSubmit = async () => {
    emailForm.checkPassword = emailForm.userPassword;
    // 表单校验
    await emailFormRef.value?.validate();
    await createSubmitHandler(userEmailRegister, emailForm, submitting, "emailBtn")();
};

/**
 * 处理手机号注册提交
 */
const handlePhoneSubmit = async () => {
    phoneForm.checkPassword = phoneForm.userPassword;
    await phoneFormRef.value?.validate();
    await createSubmitHandler(userPhoneRegister, phoneForm, submitting, "phoneBtn")();
};

// 邮箱验证码冷却机制实例
const emailCaptchaCooldown = useCaptchaCooldown();

// 手机号验证码冷却机制实例
const phoneCaptchaCooldown = useCaptchaCooldown();

// 计算属性，获取邮箱验证码冷却倒计时
const emailCaptchaCountdown = computed(() => emailCaptchaCooldown.countdown.value);

// 计算属性，获取手机号验证码冷却倒计时
const phoneCaptchaCountdown = computed(() => phoneCaptchaCooldown.countdown.value);

/**
 * 发送邮箱验证码
 */
const sendEmailCaptcha = async () => {
    sendingCaptcha.emailCaptcha = true;
    createSendCaptchaHandler("EMAIL", "REGISTER", () => emailForm.userEmail, "请输入邮箱地址以获取验证码")()
        .then(() => {
            emailCaptchaCooldown.start();
        })
        .finally(() => {
            sendingCaptcha.emailCaptcha = false;
        });
};

/**
 * 发送手机号验证码
 */
const sendPhoneCaptcha = async () => {
    sendingCaptcha.phoneCaptcha = true;
    createSendCaptchaHandler("SMS", "REGISTER", () => phoneForm.userPhone, "请输入手机号以获取验证码")()
        .then(() => {
            phoneCaptchaCooldown.start();
        })
        .finally(() => {
            sendingCaptcha.phoneCaptcha = false;
        });
};

// 组件卸载前清除验证码冷却定时器，避免内存泄漏
onBeforeUnmount(() => {
    emailCaptchaCooldown.start();
    phoneCaptchaCooldown.start();
});
</script>

<template>
    <div id="user-register">
        <a-card :bordered="false" class="register-card" title="注册新账号">
            <template #extra>
                <div class="register-footer">
                    <span>已有账号？</span>
                    <router-link :to="ROUTES.LOGIN.path">立即登录</router-link>
                </div>
            </template>
            <a-tabs v-model:activeKey="activeKey" centered>
                <!-- 账号注册 -->
                <a-tab-pane key="account" tab="账号密码">
                    <a-form
                        ref="accountFormRef"
                        :model="accountForm"
                        @finish="handleAccountSubmit"
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                    >
                        <a-form-item name="userAccount" :rules="FormRules.userAccount">
                            <a-input
                                v-model:value="accountForm.userAccount"
                                size="large"
                                placeholder="请输入登录账号"
                                allow-clear
                            >
                                <template #prefix><UserOutlined /></template>
                            </a-input>
                        </a-form-item>
                        <a-form-item name="userPassword" :rules="FormRules.userPassword">
                            <a-input-password
                                v-model:value="accountForm.userPassword"
                                size="large"
                                placeholder="请输入登录密码"
                                allow-clear
                            >
                                <template #prefix><LockOutlined /></template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item name="checkPassword" :rules="FormRules.checkPassword">
                            <a-input-password
                                v-model:value="accountForm.checkPassword"
                                size="large"
                                placeholder="请输入确认密码"
                                allow-clear
                            >
                                <template #prefix><LockOutlined /></template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                type="primary"
                                html-type="submit"
                                size="large"
                                block
                                :loading="submitting.accountBtn"
                            >
                                注册
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-tab-pane>

                <!-- 邮箱注册 -->
                <a-tab-pane key="email" tab="邮箱注册">
                    <a-form
                        ref="emailFormRef"
                        :model="emailForm"
                        @finish="handleEmailSubmit"
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                    >
                        <a-form-item name="userEmail" :rules="FormRules.userEmail">
                            <a-input
                                v-model:value="emailForm.userEmail"
                                size="large"
                                placeholder="请输入邮箱地址"
                                allow-clear
                            >
                                <template #prefix><MailOutlined /></template>
                            </a-input>
                        </a-form-item>
                        <a-form-item name="captchaCode" :rules="FormRules.captchaCode">
                            <div class="captcha-wrapper">
                                <a-input
                                    v-model:value="emailForm.captchaCode"
                                    size="large"
                                    placeholder="请输入验证码"
                                    allow-clear
                                >
                                    <template #prefix><SafetyCertificateOutlined /></template>
                                </a-input>
                                <a-button
                                    size="large"
                                    :disabled="emailCaptchaCountdown > 0"
                                    :loading="sendingCaptcha.emailCaptcha"
                                    @click="sendEmailCaptcha"
                                >
                                    {{ emailCaptchaCountdown > 0 ? `${emailCaptchaCountdown}秒后重试` : "获取验证码" }}
                                </a-button>
                            </div>
                        </a-form-item>
                        <a-form-item name="userPassword" :rules="FormRules.userPassword">
                            <a-input-password
                                v-model:value="emailForm.userPassword"
                                size="large"
                                placeholder="请输入账号密码"
                                allow-clear
                            >
                                <template #prefix><LockOutlined /></template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                type="primary"
                                html-type="submit"
                                size="large"
                                block
                                :loading="submitting.emailBtn"
                            >
                                注册
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-tab-pane>

                <!-- 手机号注册 -->
                <a-tab-pane key="phone" tab="手机号注册">
                    <a-form
                        ref="phoneFormRef"
                        :model="phoneForm"
                        @finish="handlePhoneSubmit"
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                    >
                        <a-form-item name="userPhone" :rules="FormRules.userPhone">
                            <a-input
                                v-model:value="phoneForm.userPhone"
                                size="large"
                                placeholder="请输入手机号"
                                allow-clear
                            >
                                <template #prefix><MobileOutlined /></template>
                            </a-input>
                        </a-form-item>
                        <a-form-item name="captchaCode" :rules="FormRules.captchaCode">
                            <div class="captcha-wrapper">
                                <a-input
                                    v-model:value="phoneForm.captchaCode"
                                    size="large"
                                    placeholder="请输入验证码"
                                    allow-clear
                                >
                                    <template #prefix><SafetyCertificateOutlined /></template>
                                </a-input>
                                <a-button
                                    size="large"
                                    :disabled="phoneCaptchaCountdown > 0"
                                    :loading="sendingCaptcha.phoneCaptcha"
                                    @click="sendPhoneCaptcha"
                                >
                                    {{ phoneCaptchaCountdown > 0 ? `${phoneCaptchaCountdown}秒后重试` : "获取验证码" }}
                                </a-button>
                            </div>
                        </a-form-item>
                        <a-form-item name="userPassword" :rules="FormRules.userPassword">
                            <a-input-password
                                v-model:value="phoneForm.userPassword"
                                size="large"
                                placeholder="请输入账号密码"
                                allow-clear
                            >
                                <template #prefix><LockOutlined /></template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                type="primary"
                                html-type="submit"
                                size="large"
                                block
                                :loading="submitting.phoneBtn"
                            >
                                注册
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
            </a-tabs>
        </a-card>
    </div>
</template>

<style scoped>
#user-register {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.register-card {
    min-width: 420px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.captcha-wrapper {
    display: flex;
    gap: 8px;
}

.captcha-wrapper .ant-input-affix-wrapper {
    flex: 1;
}

.register-footer {
    text-align: center;
}
</style>

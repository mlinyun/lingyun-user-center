<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { userRegister, userEmailRegister, userPhoneRegister } from "@/api/user";
import { sendCaptcha } from "@/api/captcha";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons-vue";
import type { Api } from "@/types/api/typings";
import type { Rule } from "ant-design-vue/es/form";
import { SYSTEM_LOGO, SYSTEM_TITLE, SYSTEM_SUBTITLE } from "@/constants/system";
import { ROUTES } from "@/constants/routes.ts";
import type { AxiosResponse } from "axios";
import { CODE_REGEX, PHONE_REGEX, PWD_REGEX } from "@/constants";

/**
 * 用户注册页面.
 */
defineOptions({ name: "UserRegister" });

const router = useRouter();
// 当前激活的注册方式
const activeKey = ref("account");
// 提交状态
const submitting = ref(false);

const labelCol = { span: 0 };
const wrapperCol = { span: 24 };

// 账号注册表单引用
const accountFormRef = ref();
// 账号注册表单数据
const accountForm = reactive<Api.User.UserRegisterRequest>({
    userAccount: "",
    userPassword: "",
    checkPassword: "",
});

// 邮箱注册表单引用
const emailFormRef = ref();
// 邮箱注册表单数据
const emailForm = reactive<Api.User.UserEmailRegisterRequest>({
    userEmail: "",
    captchaCode: "",
    userPassword: "",
    checkPassword: "",
});

// 手机号注册表单引用
const phoneFormRef = ref();
// 手机号注册表单数据
const phoneForm = reactive<Api.User.UserPhoneRegisterRequest>({
    userPhone: "",
    captchaCode: "",
    userPassword: "",
    checkPassword: "",
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
    <TRequest>(apiFn: RegisterApiFunction<TRequest>, formData: TRequest) =>
    async () => {
        submitting.value = true;
        try {
            const { data } = await apiFn(formData);
            if (data.code === 20000 && data.success) {
                message.success(data.message);
                void router.push({ name: ROUTES.LOGIN.name });
            } else {
                message.error(data.message || "注册失败，请稍后再试！");
            }
        } catch (error) {
            console.log(`注册异常：${error}`);
            message.error("注册失败，请稍后再试！");
        } finally {
            submitting.value = false;
        }
    };

const handleAccountSubmit = createSubmitHandler(userRegister, accountForm);
const handleEmailSubmit = () => {
    emailForm.checkPassword = emailForm.userPassword;
    createSubmitHandler(userEmailRegister, emailForm)();
};
const handlePhoneSubmit = () => {
    phoneForm.checkPassword = phoneForm.userPassword;
    createSubmitHandler(userPhoneRegister, phoneForm)();
};

type CaptchaType = Api.Captcha.SendCaptchaRequest["type"];

const createSendCaptchaHandler =
    (type: CaptchaType, getTarget: () => string, emptyWarning: string) => async (): Promise<void> => {
        const target = getTarget();
        if (!target) {
            message.warning(emptyWarning);
            return;
        }
        try {
            const captchaRequest: Api.Captcha.SendCaptchaRequest = {
                type,
                scene: "REGISTER",
                target,
            };
            const { data } = await sendCaptcha(captchaRequest);
            if (data.code === 20000 && data.success) {
                message.success("验证码发送成功");
            } else {
                message.error(data.message || "验证码发送失败，请稍后再试！");
            }
        } catch (error) {
            console.error(`发送验证码异常：${error}`);
            message.error("验证码发送失败，请稍后再试！");
        }
    };

const sendEmailCaptcha = createSendCaptchaHandler("EMAIL", () => emailForm.userEmail, "请输入邮箱地址");

const sendPhoneCaptcha = createSendCaptchaHandler("SMS", () => phoneForm.userPhone, "请输入手机号");
</script>

<template>
    <div id="user-register">
        <div class="register-container">
            <div class="register-header">
                <div class="logo-title">
                    <img :src="SYSTEM_LOGO" alt="logo" class="logo" />
                    <h1 class="title">{{ SYSTEM_TITLE }}</h1>
                </div>
                <p class="subtitle">{{ SYSTEM_SUBTITLE }}</p>
            </div>

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
                                <a-input v-model:value="accountForm.userAccount" size="large" placeholder="登录账号">
                                    <template #prefix><UserOutlined /></template>
                                </a-input>
                            </a-form-item>
                            <a-form-item name="userPassword" :rules="FormRules.userPassword">
                                <a-input-password
                                    v-model:value="accountForm.userPassword"
                                    size="large"
                                    placeholder="登录密码"
                                >
                                    <template #prefix><LockOutlined /></template>
                                </a-input-password>
                            </a-form-item>
                            <a-form-item name="checkPassword" :rules="FormRules.checkPassword">
                                <a-input-password
                                    v-model:value="accountForm.checkPassword"
                                    size="large"
                                    placeholder="确认密码"
                                >
                                    <template #prefix><LockOutlined /></template>
                                </a-input-password>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" html-type="submit" size="large" block :loading="submitting">
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
                                <a-input v-model:value="emailForm.userEmail" size="large" placeholder="邮箱地址">
                                    <template #prefix><MailOutlined /></template>
                                </a-input>
                            </a-form-item>
                            <a-form-item name="captchaCode" :rules="FormRules.captchaCode">
                                <div class="captcha-wrapper">
                                    <a-input v-model:value="emailForm.captchaCode" size="large" placeholder="验证码">
                                        <template #prefix><SafetyCertificateOutlined /></template>
                                    </a-input>
                                    <a-button size="large" @click="sendEmailCaptcha">获取验证码</a-button>
                                </div>
                            </a-form-item>
                            <a-form-item name="userPassword" :rules="FormRules.userPassword">
                                <a-input-password
                                    v-model:value="emailForm.userPassword"
                                    size="large"
                                    placeholder="密码"
                                >
                                    <template #prefix><LockOutlined /></template>
                                </a-input-password>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" html-type="submit" size="large" block :loading="submitting">
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
                                <a-input v-model:value="phoneForm.userPhone" size="large" placeholder="手机号">
                                    <template #prefix><MobileOutlined /></template>
                                </a-input>
                            </a-form-item>
                            <a-form-item name="captchaCode" :rules="FormRules.captchaCode">
                                <div class="captcha-wrapper">
                                    <a-input v-model:value="phoneForm.captchaCode" size="large" placeholder="验证码">
                                        <template #prefix><SafetyCertificateOutlined /></template>
                                    </a-input>
                                    <a-button size="large" @click="sendPhoneCaptcha">获取验证码</a-button>
                                </div>
                            </a-form-item>
                            <a-form-item name="userPassword" :rules="FormRules.userPassword">
                                <a-input-password
                                    v-model:value="phoneForm.userPassword"
                                    size="large"
                                    placeholder="密码"
                                >
                                    <template #prefix><LockOutlined /></template>
                                </a-input-password>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" html-type="submit" size="large" block :loading="submitting">
                                    注册
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </a-tab-pane>
                </a-tabs>
            </a-card>
        </div>
    </div>
</template>

<style scoped>
#user-register {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

.register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 600px;
}

.register-header {
    width: 100%;
    margin-bottom: 32px;
    text-align: center;
}

.register-header .logo-title {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
}

.register-header .logo-title .logo {
    width: 48px;
    height: 48px;
}

.register-header .logo-title .title {
    margin-bottom: 0.25em;
    font-size: 28px;
    font-weight: 600;
    color: #001529;
    white-space: nowrap;
}

.register-header .subtitle {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: #8c8c8c;
}

.register-card {
    width: 90%;
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

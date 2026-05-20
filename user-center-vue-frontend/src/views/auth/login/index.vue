<script setup lang="ts">
/**
 * 用户登录页面.
 */
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "@/constants/routes.ts";
import {
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
} from "@ant-design/icons-vue";
import type { Api } from "@/types/api/typings";
import { BusinessCode, CODE_REGEX, PHONE_REGEX, PWD_REGEX } from "@/constants";
import type { Rule } from "ant-design-vue/es/form";
import type { AxiosResponse } from "axios";
import { messageUtils } from "@/utils/message";
import { userEmailLogin, userLogin, userPhoneLogin } from "@/api/user.ts";
import { useAuthStore } from "@/stores/auth.ts";
import { sendCaptcha } from "@/api/captcha.ts";

defineOptions({ name: "UserLogin" });

const router = useRouter();
const authStore = useAuthStore();

// 当前激活的登录方式
const activeKey = ref("account");
// 提交状态
const submitting = ref(false);

const labelCol = { span: 0 };
const wrapperCol = { span: 24 };

// 账号注册表单引用
const accountFormRef = ref();
// 账号注册表单数据
const accountForm = reactive<Api.User.UserLoginRequest>({
    userAccount: "",
    userPassword: "",
});

// 邮箱注册表单引用
const emailFormRef = ref();
// 邮箱注册表单数据
const emailForm = reactive<Api.User.UserEmailLoginRequest>({
    userEmail: "",
    captchaCode: "",
});

// 手机号注册表单引用
const phoneFormRef = ref();
// 手机号注册表单数据
const phoneForm = reactive<Api.User.UserPhoneLoginRequest>({
    userPhone: "",
    captchaCode: "",
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

type LoginApiFunction<TRequest> = (data: TRequest) => Promise<AxiosResponse<Api.User.UserLoginResponse>>;

const createSubmitHandler =
    <TRequest>(apiFn: LoginApiFunction<TRequest>, formData: TRequest) =>
    async () => {
        submitting.value = true;
        try {
            const { data } = await apiFn(formData);
            if (data.code === BusinessCode.SUCCESS && data.success) {
                const userLoginVo = data.data;
                authStore.markAuthenticated(userLoginVo);
                // 路由跳转到上次的页面或者首页
                const queryRoute = router.currentRoute.value.query.redirect as string;
                const redirectPath = queryRoute || ROUTES.HOME.path;
                await router.push({ path: redirectPath });
            }
        } catch (error) {
            console.log(`登录异常：${error}`);
        } finally {
            submitting.value = false;
        }
    };

const handleAccountSubmit = createSubmitHandler(userLogin, accountForm);
const handleEmailSubmit = createSubmitHandler(userEmailLogin, emailForm);
const handlePhoneSubmit = createSubmitHandler(userPhoneLogin, phoneForm);

type CaptchaType = Api.Captcha.SendCaptchaRequest["type"];

const createSendCaptchaHandler =
    (type: CaptchaType, getTarget: () => string, emptyWarning: string) => async (): Promise<void> => {
        const target = getTarget();
        if (!target) {
            messageUtils.warning(emptyWarning);
            return;
        }
        try {
            const captchaRequest: Api.Captcha.SendCaptchaRequest = {
                type,
                scene: "LOGIN",
                target,
            };
            await sendCaptcha(captchaRequest);
        } catch (error) {
            console.error(`发送验证码异常：${error}`);
        }
    };

const sendEmailCaptcha = createSendCaptchaHandler("EMAIL", () => emailForm.userEmail, "请输入邮箱地址以获取验证码");
const sendPhoneCaptcha = createSendCaptchaHandler("SMS", () => phoneForm.userPhone, "请输入手机号以获取验证码");
</script>

<template>
    <div id="user-login">
        <a-card :bordered="false" class="login-card" title="登录新账号">
            <template #extra>
                <div class="login-footer">
                    <span>还没有账号？</span>
                    <router-link :to="ROUTES.REGISTER.path">立即注册</router-link>
                </div>
            </template>
            <a-tabs v-model:activeKey="activeKey" centered>
                <!-- 账号登录 -->
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
                        <a-form-item>
                            <a-button type="primary" html-type="submit" size="large" block :loading="submitting">
                                登录
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-tab-pane>

                <!-- 邮箱登录 -->
                <a-tab-pane key="email" tab="邮箱登录">
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
                        <a-form-item>
                            <a-button type="primary" html-type="submit" size="large" block :loading="submitting">
                                登录
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-tab-pane>

                <!-- 手机号登录 -->
                <a-tab-pane key="phone" tab="手机号登录">
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
                        <a-form-item>
                            <a-button type="primary" html-type="submit" size="large" block :loading="submitting">
                                登录
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
            </a-tabs>
        </a-card>
    </div>
</template>

<style scoped>
#user-login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.login-card {
    min-width: 400px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.captcha-wrapper {
    display: flex;
    gap: 8px;
}

.captcha-wrapper .ant-input-affix-wrapper {
    flex: 1;
}

.login-footer {
    text-align: center;
}
</style>

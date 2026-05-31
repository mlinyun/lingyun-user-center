<script setup lang="ts">
/**
 * 用户登录页面.
 */
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "@/constants/routes.ts";
import { getSafeAuthRedirect } from "@/utils/redirect/auth-redirect";
import {
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
} from "@ant-design/icons-vue";
import type { Api } from "@/types/api/typings";
import {
    BusinessCode,
    CODE_REGEX,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    PHONE_REGEX,
    PWD_REGEX,
} from "@/constants";
import type { Rule } from "ant-design-vue/es/form";
import type { AxiosResponse } from "axios";
import { userEmailLogin, userLogin, userPhoneLogin, userEmailResetPwd, userPhoneResetPwd } from "@/api/user.ts";
import { useAuthStore } from "@/stores/auth.ts";
import type { FormInstance } from "ant-design-vue";
import { useCaptchaSender } from "@/composable/send-captcha.ts";

defineOptions({ name: "UserLogin" });

const router = useRouter();
const authStore = useAuthStore();

const labelCol = { span: 0 };
const wrapperCol = { span: 24 };

// 当前激活的登录方式
const activeKey = ref("account");

// 账号注册表单引用
const accountFormRef = ref<FormInstance>();
// 账号注册表单数据
const accountForm = reactive<Api.User.UserLoginRequest>({
    userAccount: "",
    userPassword: "",
});

// 邮箱注册表单引用
const emailFormRef = ref<FormInstance>();
// 邮箱注册表单数据
const emailForm = reactive<Api.User.UserEmailLoginRequest>({
    userEmail: "",
    captchaCode: "",
});

// 手机号注册表单引用
const phoneFormRef = ref<FormInstance>();
// 手机号注册表单数据
const phoneForm = reactive<Api.User.UserPhoneLoginRequest>({
    userPhone: "",
    captchaCode: "",
});

type SubmitState = {
    accountBtn: boolean;
    emailBtn: boolean;
    phoneBtn: boolean;
    emailResetBtn: boolean;
    phoneResetBtn: boolean;
};

// 提交状态
const submitting = reactive<SubmitState>({
    accountBtn: false,
    emailBtn: false,
    phoneBtn: false,
    emailResetBtn: false,
    phoneResetBtn: false,
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
        { min: PASSWORD_MIN_LENGTH, message: `密码长度不小于 ${PASSWORD_MIN_LENGTH} 位!`, trigger: "blur" },
        { max: PASSWORD_MAX_LENGTH, message: `密码长度不大于 ${PASSWORD_MAX_LENGTH} 位!`, trigger: "blur" },
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
    <TRequest>(
        apiFn: LoginApiFunction<TRequest>,
        formData: TRequest,
        submitState: SubmitState,
        submitKey: keyof SubmitState
    ) =>
    async () => {
        submitState[submitKey] = true;
        try {
            const { data } = await apiFn(formData);
            if (data.code === BusinessCode.SUCCESS && data.success) {
                const userLoginVo = data.data;
                authStore.markAuthenticated(userLoginVo);
                // 路由跳转到上次的页面或者首页
                const redirectPath = getSafeAuthRedirect(router.currentRoute.value.query.redirect);
                await router.push(redirectPath);
            }
        } catch (error) {
            console.log(`登录异常：${error}`);
        } finally {
            submitState[submitKey] = false;
        }
    };

/**
 * 处理账号登录提交
 */
const handleAccountSubmit = async () => {
    await accountFormRef.value?.validate();
    await createSubmitHandler(userLogin, accountForm, submitting, "accountBtn")();
};

/**
 * 处理邮箱登录提交
 */
const handleEmailSubmit = async () => {
    await emailFormRef.value?.validate();
    await createSubmitHandler(userEmailLogin, emailForm, submitting, "emailBtn")();
};

/**
 * 处理手机号登录提交
 */
const handlePhoneSubmit = async () => {
    await phoneFormRef.value?.validate();
    await createSubmitHandler(userPhoneLogin, phoneForm, submitting, "phoneBtn")();
};

// 邮箱验证码发送器实例（登录）
const emailCaptchaSender = useCaptchaSender("EMAIL", "LOGIN", () => emailForm.userEmail, "请输入邮箱地址以获取验证码");

// 手机号验证码发送器实例（登录）
const phoneCaptchaSender = useCaptchaSender("SMS", "LOGIN", () => phoneForm.userPhone, "请输入手机号以获取验证码");

// ========== 忘记密码弹窗相关 ==========
// 控制弹窗显示
const showResetModal = ref(false);
const resetActiveKey = ref("email");

// 重置 - 邮箱表单
const emailResetFormRef = ref<FormInstance>();
const emailResetForm = reactive<{ userEmail: string; captchaCode: string; newPassword: string; checkPassword: string }>(
    {
        userEmail: "",
        captchaCode: "",
        newPassword: "",
        checkPassword: "",
    }
);

// 重置 - 手机表单
const phoneResetFormRef = ref<FormInstance>();
const phoneResetForm = reactive<{ userPhone: string; captchaCode: string; newPassword: string; checkPassword: string }>(
    {
        userPhone: "",
        captchaCode: "",
        newPassword: "",
        checkPassword: "",
    }
);

// 验证码发送器（重置场景）
const emailResetCaptchaSender = useCaptchaSender(
    "EMAIL",
    "RESET_PWD",
    () => emailResetForm.userEmail,
    "请输入邮箱地址以获取验证码"
);
const phoneResetCaptchaSender = useCaptchaSender(
    "SMS",
    "RESET_PWD",
    () => phoneResetForm.userPhone,
    "请输入手机号以获取验证码"
);

// 重置表单校验规则
const emailResetRules: Record<string, Rule[]> = {
    userEmail: FormRules.userEmail!,
    captchaCode: FormRules.captchaCode!,
    newPassword: FormRules.userPassword!,
    checkPassword: [
        { required: true, message: "请确认新密码!", trigger: "blur" },
        {
            validator: (_rule, value) => {
                if (value !== emailResetForm.newPassword) {
                    return Promise.reject("两次输入的密码不一致!");
                }
                return Promise.resolve();
            },
            trigger: "blur",
        },
    ],
};

const phoneResetRules: Record<string, Rule[]> = {
    userPhone: FormRules.userPhone!,
    captchaCode: FormRules.captchaCode!,
    newPassword: FormRules.userPassword!,
    checkPassword: [
        { required: true, message: "请确认新密码!", trigger: "blur" },
        {
            validator: (_rule, value) => {
                if (value !== phoneResetForm.newPassword) {
                    return Promise.reject("两次输入的密码不一致!");
                }
                return Promise.resolve();
            },
            trigger: "blur",
        },
    ],
};

// 处理邮箱重置提交
const handleEmailResetSubmit = async () => {
    await emailResetFormRef.value?.validate();
    submitting.emailResetBtn = true;
    try {
        const payload = {
            userEmail: emailResetForm.userEmail,
            captchaCode: emailResetForm.captchaCode,
            newPassword: emailResetForm.newPassword,
            checkPassword: emailResetForm.checkPassword,
        } as Api.User.UserEmailResetPwdRequest;

        const { data } = await userEmailResetPwd(payload);
        if (data.code === BusinessCode.SUCCESS && data.success) {
            showResetModal.value = false;
            // 清理表单
            emailResetForm.userEmail = "";
            emailResetForm.captchaCode = "";
            emailResetForm.newPassword = "";
            emailResetForm.checkPassword = "";
        }
    } catch (error) {
        console.log(`重置密码异常：${error}`);
    } finally {
        submitting.emailResetBtn = false;
    }
};

// 处理手机号重置提交
const handlePhoneResetSubmit = async () => {
    await phoneResetFormRef.value?.validate();
    submitting.phoneResetBtn = true;
    try {
        const payload = {
            userPhone: phoneResetForm.userPhone,
            captchaCode: phoneResetForm.captchaCode,
            newPassword: phoneResetForm.newPassword,
            checkPassword: phoneResetForm.checkPassword,
        } as Api.User.UserPhoneResetPwdRequest;

        const { data } = await userPhoneResetPwd(payload);
        if (data.code === BusinessCode.SUCCESS && data.success) {
            showResetModal.value = false;
            phoneResetForm.userPhone = "";
            phoneResetForm.captchaCode = "";
            phoneResetForm.newPassword = "";
            phoneResetForm.checkPassword = "";
        }
    } catch (error) {
        console.log(`重置密码异常：${error}`);
    } finally {
        submitting.phoneResetBtn = false;
    }
};
</script>

<template>
    <div id="user-login">
        <a-card :bordered="false" class="login-card" title="登录新账号">
            <template #extra>
                <div class="login-footer">
                    <span>还没有账号？</span>
                    <router-link :to="ROUTES.REGISTER.path">立即注册</router-link>
                    <span style="margin: 0 8px">|</span>
                    <a @click="showResetModal = true">忘记密码</a>
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
                        <a-form-item>
                            <a-button
                                type="primary"
                                html-type="submit"
                                size="large"
                                block
                                :loading="submitting.accountBtn"
                            >
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
                                    :disabled="emailCaptchaSender.countdown.value > 0"
                                    :loading="emailCaptchaSender.sending.value"
                                    @click="emailCaptchaSender.send()"
                                >
                                    {{
                                        emailCaptchaSender.countdown.value > 0
                                            ? `${emailCaptchaSender.countdown.value}秒后重试`
                                            : "获取验证码"
                                    }}
                                </a-button>
                            </div>
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                type="primary"
                                html-type="submit"
                                size="large"
                                block
                                :loading="submitting.emailBtn"
                            >
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
                                    :disabled="phoneCaptchaSender.countdown.value > 0"
                                    :loading="phoneCaptchaSender.sending.value"
                                    @click="phoneCaptchaSender.send()"
                                >
                                    {{
                                        phoneCaptchaSender.countdown.value > 0
                                            ? `${phoneCaptchaSender.countdown.value}秒后重试`
                                            : "获取验证码"
                                    }}
                                </a-button>
                            </div>
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                type="primary"
                                html-type="submit"
                                size="large"
                                block
                                :loading="submitting.phoneBtn"
                            >
                                登录
                            </a-button>
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
            </a-tabs>
        </a-card>
        <!-- 忘记密码弹窗 -->
        <a-modal
            v-model:visible="showResetModal"
            title="重置密码"
            :destroyOnClose="true"
            :footer="null"
            width="520px"
            @cancel="() => (showResetModal = false)"
        >
            <a-tabs v-model:activeKey="resetActiveKey" centered>
                <a-tab-pane key="email" tab="邮箱重置">
                    <a-form
                        ref="emailResetFormRef"
                        :model="emailResetForm"
                        @finish="handleEmailResetSubmit"
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                    >
                        <a-form-item name="userEmail" :rules="emailResetRules.userEmail">
                            <a-input
                                v-model:value="emailResetForm.userEmail"
                                size="large"
                                placeholder="请输入邮箱地址"
                                allow-clear
                            >
                                <template #prefix><MailOutlined /></template>
                            </a-input>
                        </a-form-item>

                        <a-form-item name="captchaCode" :rules="emailResetRules.captchaCode">
                            <div class="captcha-wrapper">
                                <a-input
                                    v-model:value="emailResetForm.captchaCode"
                                    size="large"
                                    placeholder="请输入验证码"
                                    allow-clear
                                >
                                    <template #prefix><SafetyCertificateOutlined /></template>
                                </a-input>
                                <a-button
                                    size="large"
                                    :disabled="emailResetCaptchaSender.countdown.value > 0"
                                    :loading="emailResetCaptchaSender.sending.value"
                                    @click="emailResetCaptchaSender.send()"
                                >
                                    {{
                                        emailResetCaptchaSender.countdown.value > 0
                                            ? `${emailResetCaptchaSender.countdown.value}秒后重试`
                                            : "获取验证码"
                                    }}
                                </a-button>
                            </div>
                        </a-form-item>

                        <a-form-item name="newPassword" :rules="emailResetRules.newPassword">
                            <a-input-password
                                v-model:value="emailResetForm.newPassword"
                                size="large"
                                placeholder="请输入新密码"
                                allow-clear
                            >
                                <template #prefix><LockOutlined /></template>
                            </a-input-password>
                        </a-form-item>

                        <a-form-item name="checkPassword" :rules="emailResetRules.checkPassword">
                            <a-input-password
                                v-model:value="emailResetForm.checkPassword"
                                size="large"
                                placeholder="确认新密码"
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
                                :loading="submitting.emailResetBtn"
                                >确定</a-button
                            >
                        </a-form-item>
                    </a-form>
                </a-tab-pane>

                <a-tab-pane key="phone" tab="手机号重置">
                    <a-form
                        ref="phoneResetFormRef"
                        :model="phoneResetForm"
                        @finish="handlePhoneResetSubmit"
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                    >
                        <a-form-item name="userPhone" :rules="phoneResetRules.userPhone">
                            <a-input
                                v-model:value="phoneResetForm.userPhone"
                                size="large"
                                placeholder="请输入手机号"
                                allow-clear
                            >
                                <template #prefix><MobileOutlined /></template>
                            </a-input>
                        </a-form-item>

                        <a-form-item name="captchaCode" :rules="phoneResetRules.captchaCode">
                            <div class="captcha-wrapper">
                                <a-input
                                    v-model:value="phoneResetForm.captchaCode"
                                    size="large"
                                    placeholder="请输入验证码"
                                    allow-clear
                                >
                                    <template #prefix><SafetyCertificateOutlined /></template>
                                </a-input>
                                <a-button
                                    size="large"
                                    :disabled="phoneResetCaptchaSender.countdown.value > 0"
                                    :loading="phoneResetCaptchaSender.sending.value"
                                    @click="phoneResetCaptchaSender.send()"
                                >
                                    {{
                                        phoneResetCaptchaSender.countdown.value > 0
                                            ? `${phoneResetCaptchaSender.countdown.value}秒后重试`
                                            : "获取验证码"
                                    }}
                                </a-button>
                            </div>
                        </a-form-item>

                        <a-form-item name="newPassword" :rules="phoneResetRules.newPassword">
                            <a-input-password
                                v-model:value="phoneResetForm.newPassword"
                                size="large"
                                placeholder="请输入新密码"
                                allow-clear
                            >
                                <template #prefix><LockOutlined /></template>
                            </a-input-password>
                        </a-form-item>

                        <a-form-item name="checkPassword" :rules="phoneResetRules.checkPassword">
                            <a-input-password
                                v-model:value="phoneResetForm.checkPassword"
                                size="large"
                                placeholder="确认新密码"
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
                                :loading="submitting.phoneResetBtn"
                                >确定</a-button
                            >
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
            </a-tabs>
        </a-modal>
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
    min-width: 430px;
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

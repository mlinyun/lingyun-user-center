<script setup lang="ts">
/**
 * 账户安全设置卡片
 */
import {
    CodeOutlined,
    MailOutlined,
    MobileOutlined,
    SafetyOutlined,
    CheckCircleOutlined,
    WarningOutlined,
} from "@ant-design/icons-vue";
import { BusinessCode, CODE_REGEX, PHONE_REGEX } from "@/constants";
import type { Rule } from "ant-design-vue/es/form";
import { computed, reactive, ref, watch } from "vue";
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

// 计算账号安全信息
const securityInfo = computed(() => {
    let score = 20;
    let levelText = "较低";
    let color = "#ff4d4f";
    const tips: string[] = [];

    if (loginUser.value?.userEmail) {
        score += 20;
    } else {
        tips.push("绑定邮箱可以提升账号安全性");
    }

    if (loginUser.value?.userPhone) {
        score += 20;
    } else {
        tips.push("绑定手机号可以提升账号安全性");
    }

    if (loginUser.value?.userAvatar) {
        score += 15;
    } else {
        tips.push("头像还没选好？上传一张专属图片，让个人主页更生动吧");
    }

    if (loginUser.value?.userProfile) {
        score += 15;
    } else {
        tips.push("个人简介可以让别人更了解你，快来写一句自我介绍吧");
    }

    if (loginUser.value?.userGender !== undefined && loginUser.value?.userGender !== 2) {
        score += 10;
    } else {
        tips.push("完善性别信息可以让系统更好地为你推荐内容");
    }

    if (score > 100) {
        score = 100;
    }

    if (score > 90) {
        levelText = "极高";
        color = "#52c41a";
    } else if (score >= 70) {
        levelText = "高";
        color = "#6469c4";
    } else if (score > 50) {
        levelText = "中等";
        color = "#b15b8a";
    }

    return { score, levelText, color, tips };
});

// 计算账号状态信息
const accountStatus = computed(() => [
    {
        label: "邮箱验证",
        verified: loginUser.value?.emailVerified,
    },
    {
        label: "手机验证",
        verified: loginUser.value?.phoneVerified,
    },
]);

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
            <a-progress type="circle" :size="100" :percent="securityInfo.score" :stroke-color="securityInfo.color">
                <template #format>
                    <div :style="{ color: securityInfo.color }" class="progress-content">
                        <div class="progress-score">{{ securityInfo.score }}</div>
                        <div class="progress-level">
                            {{ securityInfo.levelText }}
                        </div>
                    </div>
                </template>
            </a-progress>
        </div>
        <div class="security-tips">
            <a-typography-text class="security-tip-title" strong>
                <a-space>
                    <CheckCircleOutlined v-if="securityInfo.score >= 80" style="color: #52c41a" />
                    <WarningOutlined v-else style="color: #faad14" />
                    {{ securityInfo.score >= 80 ? "账号安全性良好" : "建议完善信息" }}
                </a-space>
            </a-typography-text>
            <div v-if="securityInfo.tips.length" class="security-tip-tags">
                <a-tag v-for="tip in securityInfo.tips" :key="tip" color="blue">
                    {{ tip }}
                </a-tag>
            </div>
        </div>
        <a-divider />
        <div class="security-status">
            <a-typography-text class="status-label" type="secondary"> 账号状态 </a-typography-text>
            <a-space :size="8" direction="vertical" :style="{ width: '100%' }">
                <div v-for="item in accountStatus" :key="item.label" class="status-item">
                    <span>{{ item.label }}</span>
                    <a-tag :color="item.verified ? 'success' : 'default'">
                        {{ item.verified ? "已验证" : "未设置" }}
                    </a-tag>
                </div>
            </a-space>
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

.progress-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.progress-score {
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
}

.progress-level {
    font-size: 12px;
    color: var(--ant-color-text-tertiary);
}

.security-tips {
    text-align: center;
}

.security-tip-title {
    display: block;
    margin-bottom: 12px;
    font-size: 13px;
}

.security-tip-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    justify-content: center;
}

.status-label {
    display: block;
    margin-bottom: 12px;
    font-size: 12px;
}

.status-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
}
</style>

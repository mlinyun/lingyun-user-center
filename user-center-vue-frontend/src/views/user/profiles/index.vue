<script setup lang="ts">
/**
 * 用户个人资料页面
 */
import { useAuthStore } from "@/stores/auth.ts";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed } from "vue";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons-vue";
import GenderDisplay from "@views/user/profiles/modules/gender-display.vue";
import { formatDateTime } from "@/utils/date";

defineOptions({ name: "UserProfiles" });

const loading = ref(false);
const authStore = useAuthStore();
// storeToRefs 解构后仍保持响应性
const { user: loginUser } = storeToRefs(authStore);

onMounted(async () => {
    // 如果没有用户信息，强制刷新当前用户信息
    if (!loginUser.value) {
        loading.value = true;
        try {
            await authStore.refreshCurrentUser();
        } catch (error) {
            loading.value = false;
            console.log("刷新用户信息失败:", error);
        } finally {
            loading.value = false;
        }
    }
});

/**
 * 计算账号使用天数
 */
const accountDays = computed((): number => {
    if (!loginUser.value?.createTime) {
        return 0;
    }
    const now = new Date();
    const create = new Date(loginUser.value.createTime);
    const diffTime = Math.abs(now.getTime() - create.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
</script>

<template>
    <a-layout id="user-profiles">
        <a-spin :spinning="loading" tip="加载中...">
            <a-row :gutter="[24, 24]" class="profiles-content">
                <!-- 左侧：用户基本信息 -->
                <a-col :md="8" :xs="24" class="profiles-content-left">
                    <a-card class="profiles-card">
                        <!-- 用户头像 -->
                        <div class="avatar-wrapper">
                            <a-avatar :size="120" :src="loginUser?.userAvatar">
                                <template #icon>
                                    <UserOutlined />
                                </template>
                            </a-avatar>
                        </div>
                        <!-- 用户名和账号 -->
                        <a-typography-title :level="3" class="username">
                            {{ loginUser?.userName || "未设置昵称" }}
                        </a-typography-title>
                        <div class="user-account">
                            <a-typography-text type="secondary"> @{{ loginUser?.userAccount }} </a-typography-text>
                        </div>
                        <!-- 角色标签 -->
                        <div class="role-wrapper">
                            <a-tag :color="loginUser?.userRole === 'admin' ? 'gold' : 'blue'">
                                {{ loginUser?.userRole === "admin" ? "管理员" : "普通用户" }}
                            </a-tag>
                        </div>
                        <!-- 用户简介 -->
                        <div v-if="loginUser?.userProfile" class="user-profile">
                            <a-typography-text class="profile-text" type="secondary">
                                {{ loginUser.userProfile }}
                            </a-typography-text>
                        </div>
                        <!-- 用户统计信息 -->
                        <div class="user-stats">
                            <!-- 用户ID -->
                            <div class="stat-item stat-item-border">
                                <div class="stat-icon">🆔</div>
                                <div class="stat-content">
                                    <a-typography-text class="stat-label" type="secondary"> 用户 ID </a-typography-text>
                                    <a-typography-text :code="true" :copyable="true" class="stat-value">
                                        {{ loginUser?.id || "-" }}
                                    </a-typography-text>
                                </div>
                            </div>

                            <!-- 账号使用天数 -->
                            <div class="stat-item">
                                <div class="stat-icon">📅</div>
                                <div class="stat-content">
                                    <a-typography-text class="stat-label" type="secondary">
                                        账号使用天数
                                    </a-typography-text>
                                    <a-typography-text class="days-number">
                                        {{ accountDays }}
                                    </a-typography-text>
                                    <a-typography-text class="stat-label" type="secondary"> 天 </a-typography-text>
                                </div>
                            </div>
                        </div>
                    </a-card>
                </a-col>
                <!-- 右侧：用户详细信息 -->
                <a-col :md="16" :xs="24" class="profiles-content-right">
                    <!-- 账号信息 -->
                    <a-card :bordered="true" class="info-card">
                        <template #title>
                            <a-space>
                                <UserOutlined class="card-icon" />
                                <a-typography-text strong>账号信息</a-typography-text>
                            </a-space>
                        </template>
                        <a-descriptions :column="2" bordered>
                            <a-descriptions-item label="登录账号">
                                <a-typography-text :copyable="true">
                                    {{ loginUser?.userAccount || "-" }}
                                </a-typography-text>
                            </a-descriptions-item>
                            <a-descriptions-item label="用户昵称">
                                {{ loginUser?.userName || "未设置" }}
                            </a-descriptions-item>
                            <a-descriptions-item label="用户角色">
                                <a-tag :color="loginUser?.userRole === 'admin' ? 'gold' : 'blue'">
                                    {{ loginUser?.userRole === "admin" ? "管理员" : "普通用户" }}
                                </a-tag>
                            </a-descriptions-item>
                            <a-descriptions-item label="性别">
                                <gender-display :gender="loginUser?.userGender" />
                            </a-descriptions-item>
                        </a-descriptions>
                    </a-card>

                    <!-- 联系方式 -->
                    <a-card :bordered="true" class="info-card">
                        <template #title>
                            <a-space>
                                <PhoneOutlined class="card-icon" />
                                <a-typography-text strong>联系方式</a-typography-text>
                            </a-space>
                        </template>
                        <a-descriptions :column="2" bordered>
                            <a-descriptions-item label="邮箱地址">
                                <a-space v-if="loginUser?.userEmail">
                                    <MailOutlined class="contact-icon" />
                                    <a-typography-text :copyable="true">
                                        {{ loginUser.userEmail }}
                                    </a-typography-text>
                                </a-space>
                                <a-typography-text v-else type="secondary">未设置</a-typography-text>
                            </a-descriptions-item>
                            <a-descriptions-item label="手机号码">
                                <a-space v-if="loginUser?.userPhone">
                                    <PhoneOutlined class="contact-icon" />
                                    <a-typography-text :copyable="true">
                                        {{ loginUser.userPhone }}
                                    </a-typography-text>
                                </a-space>
                                <a-typography-text v-else type="secondary">未设置</a-typography-text>
                            </a-descriptions-item>
                        </a-descriptions>
                    </a-card>

                    <!-- 系统信息 -->
                    <a-card :bordered="true" class="info-card">
                        <template #title>
                            <a-space>
                                <span style="font-size: 16px">⏰</span>
                                <a-typography-text strong>系统信息</a-typography-text>
                            </a-space>
                        </template>
                        <a-descriptions :column="2" bordered>
                            <a-descriptions-item label="账号创建时间">
                                {{ formatDateTime(loginUser?.createTime) }}
                            </a-descriptions-item>
                        </a-descriptions>
                    </a-card>
                </a-col>
            </a-row>
        </a-spin>
    </a-layout>
</template>

<style scoped>
#user-profiles {
    height: 100%;
    background: rgb(255 255 255 / 80%);
}

.avatar-wrapper {
    margin-bottom: 24px;
    text-align: center;
}

.avatar-wrapper :deep(.ant-avatar) {
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px #d9d9d9;
}

.username {
    margin-bottom: 8px !important;
    text-align: center;
}

.user-account {
    text-align: center;
}

.role-wrapper {
    margin-top: 16px;
    margin-bottom: 24px;
    text-align: center;
}

.user-profile {
    padding: 16px;
    margin-bottom: 24px;
    text-align: center;
    background: #fafafa;
    border-radius: 8px;
}

.profile-text {
    font-size: 13px;
    line-height: 1.6;
}

.user-stats {
    padding: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 3%);
}

.stat-item {
    display: flex;
    gap: 16px;
    align-items: center;
}

.stat-item-border {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px dashed #f0f0f0;
}

.stat-icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 18px;
    background: #e6f7ff;
    border-radius: 8px;
}

.stat-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.stat-label {
    padding: 0 12px;
}

.stat-value {
    font-family: Monaco, Consolas, monospace;
    font-size: 14px;
    font-weight: 500;
}

.days-number {
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
    color: #1890ff;
}

.info-card {
    margin-bottom: 24px;
}

.info-card :deep(.ant-card-body) {
    padding: 24px;
}

.card-icon {
    color: #1890ff;
}

.contact-icon {
    color: #1890ff;
}
</style>

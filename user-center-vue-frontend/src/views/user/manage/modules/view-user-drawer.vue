<script setup lang="ts">
/**
 * 用户详情抽屉组件
 */
import type { Api } from "@/types/api/typings";
import { UserOutlined, SafetyOutlined, TeamOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";
import { USER_ROLE, USER_STATUS } from "@/constants/user.ts";
import { formatDateTime } from "@/utils/date";

defineOptions({ name: "ViewUserDrawer" });

const props = defineProps<{
    visible: boolean;
    user: Api.UserAdmin.UserVo | null;
}>();

const emit = defineEmits<{
    (event: "close"): void;
}>();

const handleClose = () => {
    emit("close");
};

const genderText = computed(() => {
    if (!props.user) {
        return "未知";
    }
    switch (props.user.userGender) {
        case 0:
            return "女";
        case 1:
            return "男";
        default:
            return "未知";
    }
});
</script>

<template>
    <a-drawer
        :open="props.visible"
        :width="520"
        destroy-on-close
        placement="right"
        title="用户详情"
        @close="handleClose"
    >
        <div v-if="user" class="drawer-content">
            <div class="profile-section">
                <a-avatar :size="96" :src="user.userAvatar">
                    <template #icon><UserOutlined /> </template>
                </a-avatar>
                <div class="profile-meta">
                    <h3>{{ user.userName || "未设置昵称" }}</h3>
                    <span class="account">@{{ user.userAccount }}</span>
                    <a-tag v-if="user.userRole === USER_ROLE.ADMIN" color="blue"><SafetyOutlined /> 管理员</a-tag>
                    <a-tag v-else color="default"><TeamOutlined /> 普通用户</a-tag>
                </div>
            </div>

            <a-descriptions :column="1" bordered class="info-descriptions" size="middle">
                <a-descriptions-item label="用户编号">
                    <a-typography-text copyable>{{ user.id }}</a-typography-text>
                </a-descriptions-item>
                <a-descriptions-item label="性别">
                    {{ genderText }}
                </a-descriptions-item>
                <a-descriptions-item label="手机号码">
                    {{ user.userPhone || "未填写" }}
                </a-descriptions-item>
                <a-descriptions-item label="邮箱地址">
                    {{ user.userEmail || "未填写" }}
                </a-descriptions-item>
                <a-descriptions-item label="账号状态">
                    <a-badge :status="user.userStatus === USER_STATUS.NORMAL ? 'success' : 'error'" />
                    <span class="status-text">
                        {{ user.userStatus === USER_STATUS.NORMAL ? "正常" : "封禁" }}
                    </span>
                </a-descriptions-item>
                <a-descriptions-item label="用户简介">
                    {{ user.userProfile || "暂无简介" }}
                </a-descriptions-item>
                <a-descriptions-item label="创建时间">
                    {{ formatDateTime(user.createTime) }}
                </a-descriptions-item>
                <a-descriptions-item label="更新时间">
                    {{ formatDateTime(user.updateTime) }}
                </a-descriptions-item>
            </a-descriptions>
        </div>
        <a-empty v-else description="暂无用户信息" />
    </a-drawer>
</template>

<style scoped>
.drawer-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.profile-section {
    display: flex;
    gap: 16px;
    align-items: center;
}

.profile-meta h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: rgb(0 0 0 / 85%);
}

.profile-meta .account {
    display: inline-block;
    margin: 4px 0 8px;
    color: rgb(0 0 0 / 45%);
}

.status-text {
    margin-left: 8px;
}

.info-descriptions :deep(.ant-descriptions-item-label) {
    width: 96px;
}
</style>

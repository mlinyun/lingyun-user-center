<script setup lang="ts">
/**
 * 用户头像卡片
 */
import { PictureOutlined, UserOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";
import { storeToRefs } from "pinia";
import type { UploadProps } from "ant-design-vue";
import { useUserOperations } from "@/composable/user-operations.ts";

defineOptions({ name: "UserAvatar" });

const authStore = useAuthStore();
// storeToRefs 解构后仍保持响应性
const { user: loginUser } = storeToRefs(authStore);

const userOperations = useUserOperations();

/**
 * 处理头像上传
 *
 * @param file 选择的文件对象
 */
const handleAvatarUpload: UploadProps["beforeUpload"] = async (file) => {
    if (!file) {
        return false;
    }
    try {
        const avatarUploadResult = await userOperations.handleAvatarUpload(file);
        if (avatarUploadResult) {
            // 上传成功后刷新用户信息以显示新头像
            await authStore.refreshCurrentUser();
            return true;
        } else {
            return false; // 阻止默认上传行为
        }
    } catch (error) {
        console.error("头像上传失败:", error);
        return false;
    }
};
</script>

<template>
    <a-card :bordered="true">
        <template #title>
            <a-space>
                <PictureOutlined class="card-icon" />
                <span class="card-title">用户头像</span>
            </a-space>
        </template>
        <div class="avatar-section">
            <a-avatar :size="120" :src="loginUser?.userAvatar">
                <template #icon>
                    <UserOutlined />
                </template>
            </a-avatar>

            <div class="avatar-meta">
                <a-typography-title :level="4" class="avatar-name">
                    {{ loginUser?.userName || "未设置昵称" }}
                </a-typography-title>
                <a-typography-text class="avatar-account" type="secondary">
                    @{{ loginUser?.userAccount || "" }}
                </a-typography-text>
            </div>

            <a-upload
                :before-upload="handleAvatarUpload"
                :disabled="userOperations.uploading.value"
                :show-upload-list="false"
                accept="image/*"
            >
                <a class="avatar-upload-btn">
                    {{ userOperations.uploading.value ? "上传中..." : "更换头像" }}
                </a>
            </a-upload>

            <a-typography-text class="avatar-tip" type="secondary">
                支持 JPG、JPEG、PNG、GIF 格式<br />大小不超过 2MB
            </a-typography-text>
        </div>
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

.avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 24px;
    text-align: center;
}

.avatar-meta {
    margin: 20px 0;
}

.avatar-name {
    margin-bottom: 8px !important;
}

.avatar-account {
    font-size: 14px;
}

.avatar-upload-btn {
    display: inline-block;
    padding: 10px 32px;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    background: var(--ant-color-primary);
    border-radius: 8px;
    transition: all 0.3s;
}

.avatar-upload-btn:hover {
    color: #fff;
    box-shadow: 0 6px 16px rgb(24 144 255 / 30%);
    transform: translateY(-2px);
}

.avatar-tip {
    display: block;
    margin-top: 16px;
    font-size: 12px;
}
</style>

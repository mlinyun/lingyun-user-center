<script setup lang="ts">
/**
 * 用户头像卡片
 */
import { PictureOutlined, UserOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import type { UploadProps } from "ant-design-vue";
import { messageUtils } from "@/utils/message";
import { userUploadAvatar } from "@/api/user.ts";
import { BusinessCode } from "@/constants";

defineOptions({ name: "UserAvatar" });

const uploading = ref(false);
const authStore = useAuthStore();
// storeToRefs 解构后仍保持响应性
const { user: loginUser } = storeToRefs(authStore);

const handleAvatarUpload: UploadProps["beforeUpload"] = async (file) => {
    if (!file) {
        return false;
    }

    const isImage = ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type);
    if (!isImage) {
        messageUtils.error("只支持 JPG、PNG、GIF 格式的图片！");
        return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        messageUtils.error("图片大小不能超过 2MB！");
        return false;
    }

    if (!loginUser.value?.id) {
        messageUtils.error("用户信息不存在");
        return false;
    }

    uploading.value = true;
    try {
        const { data } = await userUploadAvatar(file as File);
        if (data.code === BusinessCode.SUCCESS && data.success) {
            // 上传成功后刷新用户信息以显示新头像
            await authStore.refreshCurrentUser();
        }
    } catch (error) {
        console.error("头像上传失败:", error);
    } finally {
        uploading.value = false;
    }

    return false;
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
                :disabled="uploading"
                :show-upload-list="false"
                accept="image/*"
            >
                <a class="avatar-upload-btn">
                    {{ uploading ? "上传中..." : "更换头像" }}
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

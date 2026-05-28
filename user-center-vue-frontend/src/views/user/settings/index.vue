<script setup lang="ts">
/**
 * 用户设置页面.
 */
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth.ts";
import { storeToRefs } from "pinia";
import UserAvatar from "@views/user/settings/modules/user-avatar.vue";
import PasswordManagement from "@views/user/settings/modules/password-management.vue";
import BasicInfo from "@views/user/settings/modules/basic-info.vue";
import AccountSecurity from "@views/user/settings/modules/account-security.vue";

defineOptions({ name: "UserSettings" });

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
</script>

<template>
    <a-layout id="user-settings">
        <a-spin :spinning="loading">
            <a-row :gutter="[24, 24]">
                <!-- 用户头像 -->
                <a-col :md="12" :xs="24">
                    <user-avatar />
                </a-col>
                <!-- 基本信息 -->
                <a-col :md="12" :xs="24">
                    <basic-info />
                </a-col>
                <!-- 账号安全 -->
                <a-col :md="12" :xs="24">
                    <account-security />
                </a-col>
                <!-- 密码管理 -->
                <a-col :md="12" :xs="24">
                    <password-management />
                </a-col>
            </a-row>
        </a-spin>
    </a-layout>
</template>

<style scoped>
#user-settings {
    height: 100%;
    background: rgb(255 255 255 / 80%);
}
</style>

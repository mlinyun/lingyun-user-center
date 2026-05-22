<script setup lang="ts">
import { ProgressProvider } from "@bprogress/vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useAuthStore } from "@/stores/auth.ts";
import { onBeforeUnmount, onMounted } from "vue";

// 设置 Ant Design Vue 的语言环境为中文
dayjs.locale("zh-cn");
// 导出 Ant Design Vue 的语言环境配置
const locale = zhCN;

const authStore = useAuthStore();
// 组件挂载时启动会话心跳机制
onMounted(() => {
    authStore.startSessionHeartbeat();
});
// 组件卸载时停止会话心跳机制
onBeforeUnmount(() => {
    authStore.stopSessionHeartbeat();
});
</script>

<template>
    <a-config-provider :locale="locale">
        <ProgressProvider>
            <router-view />
        </ProgressProvider>
    </a-config-provider>
</template>

<style scoped></style>

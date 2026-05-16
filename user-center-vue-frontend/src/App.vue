<script setup lang="ts">
import { ProgressProvider } from "@bprogress/vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

// 设置 Ant Design Vue 的语言环境为中文
dayjs.locale("zh-cn");
// 导出 Ant Design Vue 的语言环境配置
const locale = zhCN;
</script>

<template>
    <a-config-provider :locale="locale">
        <ProgressProvider>
            <router-view />
        </ProgressProvider>
    </a-config-provider>
</template>

<style scoped></style>

<script setup lang="ts">
/**
 * 性别显示组件
 */
import { WomanOutlined, ManOutlined, UserOutlined } from "@ant-design/icons-vue";

defineOptions({ name: "GenderDisplay" });

defineProps<{
    gender?: number;
}>();
</script>

<template>
    <a-space v-if="gender === 0">
        <WomanOutlined style="color: #eb2f96" />
        <a-typography-text>女</a-typography-text>
    </a-space>
    <a-space v-else-if="gender === 1">
        <ManOutlined style="color: #1890ff" />
        <a-typography-text>男</a-typography-text>
    </a-space>
    <a-space v-else-if="gender === 2">
        <UserOutlined style="color: rgb(0 0 0 / 25%)" />
        <a-typography-text type="secondary">未知</a-typography-text>
    </a-space>
    <a-typography-text v-else type="secondary">未设置</a-typography-text>
</template>

<style scoped></style>

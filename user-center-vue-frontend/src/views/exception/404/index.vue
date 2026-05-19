<script setup lang="ts">
/**
 * 404 Not Found 页面.
 */
import { useRouter } from "vue-router";
import { ROUTES } from "@/constants/routes.ts";

defineOptions({ name: "NotFound" });

const router = useRouter();

/**
 * 导航到首页.
 */
const goHome = () => router.push({ name: ROUTES.HOME.name });
</script>

<template>
    <a-layout id="notfound-404">
        <a-result status="404" sub-title="抱歉,您访问的页面不存在" title="404">
            <template #extra>
                <a-button type="primary" @click="goHome">返回首页</a-button>
            </template>
        </a-result>
    </a-layout>
</template>

<style scoped>
#notfound-404 {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}
</style>

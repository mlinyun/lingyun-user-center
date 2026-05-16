<script setup lang="ts">
/**
 * 认证布局组件.
 */
import { MainFooter } from "@components/main";

defineOptions({ name: "AuthLayout" });
</script>

<template>
    <a-layout id="auth-layout">
        <a-layout-content class="auth-content">
            <!-- 路由视图，显示当前路由对应的组件 -->
            <router-view />
        </a-layout-content>
        <!-- 底部页脚 -->
        <main-footer />
    </a-layout>
</template>

<style scoped>
#auth-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
</style>

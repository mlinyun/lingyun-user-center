<script setup lang="ts">
/**
 * 认证布局组件.
 */
import { MainFooter } from "@components/main";

defineOptions({ name: "AuthLayout" });
</script>

<template>
    <a-layout id="auth-layout">
        <a-layout-content>
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
    width: 100%;
    height: 100vh;
    background-image: url("https://static.mlinyun.com/user-center/auth/background.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}

/** 覆盖主布局中的页脚样式，使其在认证布局中透明 */
#main-footer {
    background-color: transparent;
}
</style>

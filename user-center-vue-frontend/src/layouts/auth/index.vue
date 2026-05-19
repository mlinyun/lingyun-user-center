<script setup lang="ts">
/**
 * 认证布局组件.
 */
import { MainFooter } from "@components/main";
import { SYSTEM_LOGO, SYSTEM_SUBTITLE, SYSTEM_TITLE } from "@/constants";

defineOptions({ name: "AuthLayout" });
</script>

<template>
    <a-layout id="auth-layout">
        <a-layout-content class="auth-content">
            <div class="auth-content-header">
                <div class="logo-title">
                    <img :src="SYSTEM_LOGO" alt="logo" class="logo" />
                    <h1 class="title">{{ SYSTEM_TITLE }}</h1>
                </div>
                <p class="subtitle">{{ SYSTEM_SUBTITLE }}</p>
            </div>
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

.auth-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 600px;
}

.auth-content-header {
    width: 100%;
    margin-bottom: 32px;
    text-align: center;
}

.auth-content-header .logo-title {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
}

.auth-content-header .logo-title .logo {
    width: 48px;
    height: 48px;
}

.auth-content-header .logo-title .title {
    margin-bottom: 0.25em;
    font-size: 28px;
    font-weight: 600;
    color: #001529;
    white-space: nowrap;
}

.auth-content-header .subtitle {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: #8c8c8c;
}

/** 覆盖主布局中的页脚样式，使其在认证布局中透明 */
#main-footer {
    background-color: transparent;
}
</style>

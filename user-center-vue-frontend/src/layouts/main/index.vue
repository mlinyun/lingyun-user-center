<script setup lang="ts">
/**
 * 主布局组件.
 */
import { MainHeader, MainSidebar, MainFooter } from "@components/main";

defineOptions({ name: "MainLayout" });
</script>

<template>
    <a-layout id="main-layout">
        <!-- 顶部导航栏 -->
        <main-header />
        <!-- 主体布局，包含侧边栏和内容区域 -->
        <a-layout id="content-layout">
            <!-- 侧边栏 -->
            <main-sidebar />
            <!-- 内容区域 -->
            <a-layout-content class="main-content">
                <a-layout class="content-wrapper">
                    <!-- 路由视图，显示当前路由对应的组件 -->
                    <router-view />
                </a-layout>
                <!-- 底部页脚（放在主内容区域内） -->
                <main-footer />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<style scoped>
#main-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

#content-layout {
    display: flex;
    flex: 1;
}

.main-content {
    /* 减去顶部导航栏的高度 */
    height: calc(100vh - 64px);
    overflow-y: auto;
}

.content-wrapper {
    height: calc(100vh - 64px - 70.4px);
    padding: 32px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
</style>

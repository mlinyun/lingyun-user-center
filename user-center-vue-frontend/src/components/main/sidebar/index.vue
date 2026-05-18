<script setup lang="ts">
/**
 * 主布局侧边栏组件.
 */
import { ref, h } from "vue";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    SmileOutlined,
    UserOutlined,
    SettingOutlined,
    CrownOutlined,
} from "@ant-design/icons-vue";
import { type RouteRecordRaw, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.ts";
import type { MenuProps } from "ant-design-vue";
import { routes } from "@/router/routes.ts";

defineOptions({ name: "MainSidebar" });

// 侧边栏折叠状态
const collapsed = ref(false);

const router = useRouter();
const authStore = useAuthStore();

/**
 * 图标映射
 */
const iconMap: Record<string, typeof SmileOutlined> = {
    smile: SmileOutlined,
    user: UserOutlined,
    setting: SettingOutlined,
    crown: CrownOutlined,
};

/**
 * 生成菜单项
 * 从源 routes 配置中按照定义的顺序获取需要显示在菜单中的路由
 * 这样能保证菜单顺序与 routes.ts 中的定义完全一致
 *
 * @returns {MenuProps["items"]} Ant Design Vue 菜单项配置
 */
const menuItems = computed<MenuProps["items"]>(() => {
    const items: MenuProps["items"] = [];
    // 递归处理路由，提取需要显示的菜单项
    const processRoutes = (routeList: RouteRecordRaw[]) => {
        routeList.forEach((route) => {
            // 布局路由本身不作为菜单项，直接处理其子路由
            if (route.children?.length) {
                processRoutes(route.children);
                return;
            }
            // 过滤掉不需要显示的路由
            if (route.meta?.hideInMenu) {
                return;
            }
            // 检查权限：普通用户只能看到没有 requiresAdmin 标记的路由
            if (route.meta?.requiresAdmin && !authStore.isAdmin) {
                return;
            }
            // 获取图标
            const icon = route.meta?.icon ? iconMap[route.meta.icon as string] : undefined;
            items.push({
                key: route.name as string, // 用 name 作为 key，跳转时更稳定
                icon: icon ? () => h(icon) : undefined,
                label: route.meta?.title || "菜单项",
            });
        });
    };
    processRoutes(routes);
    // DEBUG: 输出生成的菜单项，验证顺序和内容是否正确
    console.log("生成的菜单项:", items);
    return items;
});

/**
 * 侧边栏选中状态同步
 */
const selectedKeys = computed(() => [router.currentRoute.value.name as string]);

/**
 * 处理菜单项点击事件
 */
const handleMenuClick = ({ key }: { key: string }) => {
    router.push({ name: key });
};
</script>

<template>
    <a-layout-sider
        id="main-sidebar"
        v-model:collapsed="collapsed"
        :collapsed-width="64"
        :trigger="null"
        :width="200"
        collapsible
        theme="light"
    >
        <!-- 菜单 -->
        <a-menu :selectedKeys="selectedKeys" :items="menuItems" mode="inline" @click="handleMenuClick" />

        <!-- 折叠按钮 -->
        <div class="collapse-trigger" @click="collapsed = !collapsed">
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
        </div>
    </a-layout-sider>
</template>

<style scoped>
#main-sidebar {
    position: sticky;
    top: 0;
    height: calc(100vh - 64px);
    border-right: 1px solid #f0f0f0;
}

.collapse-trigger {
    height: 48px;
    font-size: 16px;
    line-height: 48px;
    color: rgb(0 0 0 / 85%);
    text-align: center;
    cursor: pointer;
    border-top: 1px solid #f0f0f0;
    transition: all 0.3s;
}

.collapse-trigger:hover {
    background-color: rgb(0 0 0 / 4%);
}
</style>

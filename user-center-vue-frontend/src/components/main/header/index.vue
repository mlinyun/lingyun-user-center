<script setup lang="ts">
/**
 * 主布局顶部导航栏组件.
 */
import { useRouter } from "vue-router";
import { SYSTEM_LOGO, SYSTEM_TITLE, GITHUB_URL, DEFAULT_AVATAR } from "@/constants";
import { DownOutlined, GithubOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";
import { ROUTES } from "@/constants/routes.ts";

defineOptions({ name: "MainHeader" });

const router = useRouter();
const authStore = useAuthStore();

// 获取当前登录用户信息
const loginUser = authStore.user;

/**
 * 处理用户菜单点击事件
 */
const handleUserMenuClick = async ({ key }: { key: string }) => {
    switch (key) {
        case "profiles":
            await router.push({ name: ROUTES.PROFILES.name });
            break;
        case "settings":
            await router.push({ name: ROUTES.SETTINGS.name });
            break;
        case "logout":
            await handleLogout();
            break;
        default:
            break;
    }
};

/**
 * 处理退出登录
 */
const handleLogout = async () => {
    authStore.logout().then(() => {
        router.push({ name: ROUTES.LOGIN.name });
    });
};

/**
 * 跳转到登录页
 */
const goToLogin = async () => {
    await router.push({ name: ROUTES.LOGIN.name });
};

/**
 * 跳转到注册页
 */
const goToRegister = async () => {
    await router.push({ name: ROUTES.REGISTER.name });
};
</script>

<template>
    <a-layout-header id="main-header">
        <div class="header-content">
            <!-- Logo 和标题 -->
            <div class="logo-section">
                <router-link class="logo-link" to="/home">
                    <img :src="SYSTEM_LOGO" alt="logo" class="logo" />
                    <span class="title">{{ SYSTEM_TITLE }}</span>
                </router-link>
            </div>

            <!-- 右侧用户信息和操作 -->
            <div class="user-section">
                <a-space :size="24">
                    <!-- GitHub 链接 -->
                    <a-tooltip title="GitHub">
                        <a :href="GITHUB_URL" rel="noopener noreferrer" target="_blank">
                            <GithubOutlined class="icon-link" />
                        </a>
                    </a-tooltip>

                    <!-- 用户头像下拉菜单（已登录） -->
                    <a-dropdown v-if="loginUser?.id" trigger="click">
                        <template #default>
                            <div class="user-info">
                                <a-avatar :src="loginUser.userAvatar || DEFAULT_AVATAR" size="normal" />
                                <span class="user-name">{{ loginUser.userName || "用户" }}</span>
                                <DownOutlined class="dropdown-icon" />
                            </div>
                        </template>
                        <template #overlay>
                            <a-menu @click="handleUserMenuClick">
                                <a-menu-item key="profiles">
                                    <template #icon>
                                        <UserOutlined />
                                    </template>
                                    <span>个人中心</span>
                                </a-menu-item>
                                <a-menu-item key="settings">
                                    <template #icon>
                                        <SettingOutlined />
                                    </template>
                                    <span>账号设置</span>
                                </a-menu-item>
                                <a-divider style="margin: 8px 0" />
                                <a-menu-item key="logout">
                                    <template #icon>
                                        <LogoutOutlined />
                                    </template>
                                    <span>退出登录</span>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>

                    <!-- 未登录状态（显示登录和注册按钮） -->
                    <a-space v-else :size="12">
                        <a-button type="default" @click="goToLogin">登录</a-button>
                        <a-button type="primary" @click="goToRegister">注册</a-button>
                    </a-space>
                </a-space>
            </div>
        </div>
    </a-layout-header>
</template>

<style scoped>
#main-header {
    background: rgb(255 255 255 / 80%);
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    height: 100%;
    padding: 0 24px;
}

.logo-section {
    display: flex;
    flex-shrink: 0;
    align-items: center;
}

.logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: opacity 0.3s ease;
}

.logo-link:hover {
    opacity: 0.8;
}

.logo {
    height: 40px;
    margin-right: 12px;
}

.title {
    font-size: 18px;
    font-weight: 600;
    color: #001529;
    white-space: nowrap;
}

.user-section {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    margin-left: auto;
}

.icon-link {
    font-size: 18px;
    color: rgb(0 0 0 / 65%);
    cursor: pointer;
    transition: color 0.3s ease;
}

.icon-link:hover {
    color: #1890ff;
}

.user-info {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 0 12px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.user-info:hover {
    background-color: rgb(0 0 0 / 4%);
}

.user-name {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgb(0 0 0 / 85%);
    white-space: nowrap;
}

.dropdown-icon {
    font-size: 12px;
    color: rgb(0 0 0 / 45%);
}
</style>

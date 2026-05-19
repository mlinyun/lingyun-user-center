<script setup lang="ts">
/**
 * 首页.
 */
import {
    BookOutlined,
    CodeOutlined,
    GithubOutlined,
    RocketOutlined,
    SafetyOutlined,
    TeamOutlined,
    GlobalOutlined,
} from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";
import { DOCUMENT_URL, GITHUB_URL } from "@/constants";
import { FeatureCard, TechStackCard } from "@components/home";

defineOptions({ name: "HomeView" });

const authStore = useAuthStore();

// 获取当前登录用户信息
const loginUser = authStore.user;

/**
 * 格式化创建时间
 */
const formatCreateTime = (createTime?: string | number): string => {
    if (!createTime) return "-";
    const date = new Date(createTime);
    return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * 功能特性数据
 */
const features = [
    {
        icon: SafetyOutlined,
        title: "安全可靠",
        desc: "采用 BCrypt 加密算法，Session 会话管理，AOP 权限校验，全方位保障系统安全。",
        tags: ["BCrypt", "Session", "AOP"],
    },
    {
        icon: TeamOutlined,
        title: "用户管理",
        desc: "完善的用户管理功能，支持注册、登录、信息修改、权限管理等核心业务。",
        tags: ["注册", "登录", "权限"],
    },
    {
        icon: CodeOutlined,
        title: "代码规范",
        desc: "遵循企业级代码规范，使用 Spotless、Checkstyle 保证代码质量和一致性。",
        tags: ["Spotless", "Checkstyle", "ESLint"],
    },
    {
        icon: RocketOutlined,
        title: "开箱即用",
        desc: "基于 Spring Boot + Vue 3 技术栈，前后端分离架构，快速上手开发。",
        tags: ["Spring Boot", "Vue 3", "Ant Design"],
    },
    {
        icon: BookOutlined,
        title: "API 文档",
        desc: "集成 Knife4j 接口文档，自动生成 API 文档，支持在线调试。",
        tags: ["Knife4j", "Swagger", "OpenAPI"],
    },
    {
        icon: GithubOutlined,
        title: "开源项目",
        desc: "完全开源，代码托管在 GitHub，欢迎 Star 和贡献代码。",
        tags: ["GitHub", "Apache 2.0"],
    },
];

/**
 * 技术栈数据
 */
const techStacks = [
    {
        title: "后端技术",
        technologies: ["Spring Boot 3.5.6", "MyBatis-Plus", "MySQL", "Knife4j", "Hutool", "Lombok"],
        color: "#52c41a",
    },
    {
        title: "前端技术",
        technologies: ["Vue 3", "Ant Design Vue 4", "Pinia", "TypeScript", "Vite"],
        color: "#1890ff",
    },
    {
        title: "工程化",
        technologies: ["Maven", "Pnpm", "Spotless", "Checkstyle", "ESLint", "Prettier"],
        color: "#fa8c16",
    },
];
</script>

<template>
    <a-layout id="home-view">
        <!-- 欢迎横幅 -->
        <a-card :bordered="true" class="welcome-banner">
            <!-- 科技感背景装饰 -->
            <div class="bg-decoration-grid" />
            <div class="bg-decoration-circle" />

            <a-row :gutter="[48, 32]" align="middle">
                <a-col :lg="14" :xs="24">
                    <div class="banner-content">
                        <!-- 用户问候 -->
                        <div class="greeting-section">
                            <div class="greeting-accent-bar" />
                            <h1 class="greeting-title">你好，{{ loginUser?.userName || "访客" }}</h1>
                        </div>

                        <!-- 欢迎文案 -->
                        <a-typography-paragraph class="welcome-text">
                            欢迎来到凌云用户中心系统 —— 一个基于
                            <a-typography-text strong>Spring Boot 4</a-typography-text>
                            +
                            <a-typography-text strong>Vue 3</a-typography-text>
                            构建的企业级用户管理平台。系统提供完整的用户认证、权限管理、数据安全等核心功能，采用前后端分离架构，代码规范严谨，非常适合作为全栈项目的学习参考。
                        </a-typography-paragraph>

                        <!-- 操作按钮 -->
                        <div class="action-buttons">
                            <a :href="GITHUB_URL" class="btn-primary" rel="noreferrer" target="_blank">
                                <GithubOutlined class="btn-icon" />
                                项目代码仓库
                            </a>
                            <a :href="DOCUMENT_URL" class="btn-secondary" rel="noreferrer" target="_blank">
                                <GlobalOutlined class="btn-icon" />
                                项目文档地址
                            </a>
                        </div>
                    </div>
                </a-col>

                <a-col :lg="10" :xs="24">
                    <!-- 用户信息卡片 -->
                    <a-card :bordered="true" class="user-info-card">
                        <div class="user-info-header">
                            <a-typography-text class="section-label">用户信息</a-typography-text>
                        </div>

                        <div class="user-info-list">
                            <div class="info-item">
                                <a-typography-text type="secondary">当前角色</a-typography-text>
                                <a-tag :color="loginUser?.userRole === 'admin' ? 'gold' : 'blue'" class="role-tag">
                                    {{ loginUser?.userRole === "admin" ? "管理员" : "普通用户" }}
                                </a-tag>
                            </div>
                            <div class="info-item">
                                <a-typography-text type="secondary">登录账号</a-typography-text>
                                <a-typography-text strong>
                                    {{ loginUser?.userAccount || "-" }}
                                </a-typography-text>
                            </div>
                            <div class="info-item">
                                <a-typography-text type="secondary">邮箱地址</a-typography-text>
                                <a-typography-text>
                                    {{ loginUser?.userEmail || "未设置" }}
                                </a-typography-text>
                            </div>
                            <div class="info-item">
                                <a-typography-text type="secondary">手机号码</a-typography-text>
                                <a-typography-text code>
                                    {{ loginUser?.userPhone || "未设置" }}
                                </a-typography-text>
                            </div>
                        </div>

                        <div class="user-info-footer">
                            <a-typography-text class="create-time" type="secondary">
                                账号创建时间：{{ formatCreateTime(loginUser?.createTime) }}
                            </a-typography-text>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </a-card>

        <!-- 功能特性 -->
        <a-card :bordered="true" class="section-card">
            <template #title>
                <h3 class="section-title">✨ 核心功能特性</h3>
            </template>
            <a-row :gutter="[24, 24]">
                <a-col v-for="feature in features" :key="feature.title" :lg="8" :sm="12" :xs="24">
                    <FeatureCard v-bind="feature" />
                </a-col>
            </a-row>
        </a-card>

        <!-- 技术栈 -->
        <a-card :bordered="true" class="section-card">
            <template #title>
                <h3 class="section-title">🔧 技术栈</h3>
            </template>
            <a-row :gutter="[24, 24]">
                <a-col v-for="stack in techStacks" :key="stack.title" :lg="8" :xs="24">
                    <TechStackCard v-bind="stack" />
                </a-col>
            </a-row>
        </a-card>
    </a-layout>
</template>

<style scoped>
#home-view {
    height: 100%;
    background: rgb(255 255 255 / 80%);
}

/* ========== 欢迎横幅 ========== */
.welcome-banner {
    position: relative;
    margin-bottom: 24px;
    overflow: hidden;
    background: transparent;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
}

.welcome-banner :deep(.ant-card-body) {
    padding: 48px 32px;
}

/* 科技感背景装饰 */
.bg-decoration-grid {
    position: absolute;
    top: 0;
    right: 0;
    width: 40%;
    height: 100%;
    pointer-events: none;
    background: radial-gradient(circle, var(--app-color-primary) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.05;
}

.bg-decoration-circle {
    position: absolute;
    right: -50px;
    bottom: -50px;
    width: 200px;
    height: 200px;
    pointer-events: none;
    background: radial-gradient(circle, var(--app-color-primary-soft) 0%, transparent 70%);
    border-radius: 50%;
}

/* Banner 内容 */
.banner-content {
    position: relative;
    z-index: 1;
}

/* 问候区域 */
.greeting-section {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.greeting-accent-bar {
    width: 4px;
    height: 32px;
    margin-right: 16px;
    background: linear-gradient(180deg, var(--app-color-primary) 0%, var(--app-color-primary-hover) 100%);
    border-radius: 2px;
}

.greeting-title {
    margin: 0;
    font-size: 42px;
    font-weight: 700;
    background: linear-gradient(135deg, rgb(0 0 0 / 85%) 0%, rgb(0 0 0 / 45%) 100%);
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* 欢迎文案 */
.welcome-text {
    max-width: 600px;
    margin-bottom: 32px;
    font-size: 16px;
    line-height: 1.8;
    color: var(--app-color-text-secondary);
    text-indent: 2em;
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.btn-primary,
.btn-secondary {
    display: inline-flex;
    align-items: center;
    padding: 12px 28px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
    color: #fff;
    background: var(--app-color-primary);
    border: none;
    box-shadow: 0 4px 12px var(--app-color-primary-shadow);
}

.btn-primary:hover {
    color: #fff;
    box-shadow: 0 6px 16px var(--app-color-primary-shadow-hover);
    transform: translateY(-2px);
}

.btn-secondary {
    color: var(--app-color-text-primary);
    background: transparent;
    border: 1px solid var(--app-color-border);
}

.btn-secondary:hover {
    color: var(--app-color-primary);
    border-color: var(--app-color-primary);
    transform: translateY(-2px);
}

.btn-icon {
    margin-right: 8px;
    font-size: 16px;
}

/* ========== 用户信息卡片 ========== */
.user-info-card {
    background: linear-gradient(135deg, var(--app-color-card-bg) 0%, #fff 100%);
    border: 1px solid var(--app-color-card-border);
    border-radius: 12px;
    box-shadow: none;
}

.user-info-card :deep(.ant-card-body) {
    padding: 24px;
}

.user-info-header {
    margin-bottom: 20px;
}

.section-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--ant-color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.user-info-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.role-tag {
    margin: 0;
    font-weight: 500;
}

.user-info-footer {
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid var(--app-color-border-light);
}

.create-time {
    font-size: 13px;
}

/* ========== 功能卡片区域 ========== */
.section-card {
    margin-bottom: 24px;
    background: transparent;
    border-radius: 12px;
}

.section-card :deep(.ant-card-body) {
    padding: 24px;
}

.section-title {
    margin: 0;
    font-size: 20px;
}

/* ========== 响应式设计 ========== */
@media (width <= 768px) {
    .greeting-title {
        font-size: 32px;
    }

    .welcome-text {
        font-size: 14px;
    }

    .welcome-banner :deep(.ant-card-body) {
        padding: 32px 20px;
    }

    .action-buttons {
        flex-direction: column;

        a {
            justify-content: center;
            width: 100%;
        }
    }
}
</style>

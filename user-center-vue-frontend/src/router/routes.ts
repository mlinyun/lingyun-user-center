import type { RouteRecordRaw } from "vue-router";
import { ROUTES } from "@/constants/routes.ts";

// 布局组件
// 主布局组件
const MainLayout = () => import("@layouts/main/index.vue");
// 认证布局组件
const AuthLayout = () => import("@layouts/auth/index.vue");

// 主布局页面组件
// 首页
const HomeView = () => import("@views/home/index.vue");
// 用户个人资料页面
const UserProfiles = () => import("@views/user/profiles/index.vue");
// 用户设置页面
const UserSettings = () => import("@views/user/settings/index.vue");
// 用户管理页面
const UserManage = () => import("@views/user/manage/index.vue");

// 认证布局页面组件
// 用户登录页面
const UserLogin = () => import("@views/auth/login/index.vue");
// 用户注册页面
const UserRegister = () => import("@views/auth/register/index.vue");

export const routes: Array<RouteRecordRaw> = [
    // 主布局路由
    {
        path: "/",
        name: "main-layout",
        component: MainLayout,
        redirect: ROUTES.HOME.path,
        children: [
            {
                path: ROUTES.HOME.path,
                name: ROUTES.HOME.name,
                component: HomeView,
                meta: {
                    title: ROUTES.HOME.title,
                    icon: ROUTES.HOME.icon,
                    hideInMenu: ROUTES.HOME.hideInMenu,
                    requiresAuth: ROUTES.HOME.requiresAuth,
                },
            },
            {
                path: ROUTES.PROFILES.path,
                name: ROUTES.PROFILES.name,
                component: UserProfiles,
                meta: {
                    title: ROUTES.PROFILES.title,
                    icon: ROUTES.PROFILES.icon,
                    hideInMenu: ROUTES.PROFILES.hideInMenu,
                    requiresAuth: ROUTES.PROFILES.requiresAuth,
                },
            },
            {
                path: ROUTES.SETTINGS.path,
                name: ROUTES.SETTINGS.name,
                component: UserSettings,
                meta: {
                    title: ROUTES.SETTINGS.title,
                    icon: ROUTES.SETTINGS.icon,
                    hideInMenu: ROUTES.SETTINGS.hideInMenu,
                    requiresAuth: ROUTES.SETTINGS.requiresAuth,
                },
            },
            {
                path: ROUTES.MANAGE.path,
                name: ROUTES.MANAGE.name,
                component: UserManage,
                meta: {
                    title: ROUTES.MANAGE.title,
                    icon: ROUTES.MANAGE.icon,
                    hideInMenu: ROUTES.MANAGE.hideInMenu,
                    requiresAuth: ROUTES.MANAGE.requiresAuth,
                    requiresAdmin: ROUTES.MANAGE.requiresAdmin,
                },
            },
        ],
    },
    // 认证布局路由
    {
        path: "/auth",
        redirect: "/auth/login",
        name: "auth-layout",
        component: AuthLayout,
        children: [
            {
                path: ROUTES.LOGIN.path,
                name: ROUTES.LOGIN.name,
                component: UserLogin,
                meta: {
                    title: ROUTES.LOGIN.title,
                    hideInMenu: ROUTES.LOGIN.hideInMenu,
                    requiresAuth: ROUTES.LOGIN.requiresAuth,
                },
            },
            {
                path: ROUTES.REGISTER.path,
                name: ROUTES.REGISTER.name,
                component: UserRegister,
                meta: {
                    title: ROUTES.REGISTER.title,
                    hideInMenu: ROUTES.REGISTER.hideInMenu,
                    requiresAuth: ROUTES.REGISTER.requiresAuth,
                },
            },
        ],
    },
];

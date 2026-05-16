import type { RouteRecordRaw } from "vue-router";

// 布局组件
// 主布局组件
const MainLayout = () => import("@layouts/main/index.vue");
// 认证布局组件
const AuthLayout = () => import("@layouts/auth/index.vue");

// 主布局页面组件
// 首页
const HomeView = () => import("@views/home/index.vue");

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
        children: [
            {
                path: "",
                name: "home",
                component: HomeView,
                meta: {
                    title: "首页",
                    requiresAuth: false,
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
                path: "login",
                name: "user-login",
                component: UserLogin,
                meta: {
                    title: "用户登录",
                    requiresAuth: false,
                },
            },
            {
                path: "register",
                name: "user-register",
                component: UserRegister,
                meta: {
                    title: "用户注册",
                    requiresAuth: false,
                },
            },
        ],
    },
];

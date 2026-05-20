// 路由常量
export const ROUTES = {
    // 首页
    HOME: {
        path: "/home",
        name: "home",
        title: "首页",
        icon: "smile",
        hideInMenu: false,
        requiresAuth: true,
    },
    PROFILES: {
        path: "/profiles",
        name: "profiles",
        title: "个人中心",
        icon: "user",
        hideInMenu: false,
        requiresAuth: true,
    },
    // 账号设置
    SETTINGS: {
        path: "/settings",
        name: "settings",
        title: "账号设置",
        icon: "setting",
        hideInMenu: false,
        requiresAuth: true,
    },
    MANAGE: {
        path: "/manage",
        name: "manage",
        title: "用户管理",
        icon: "crown",
        hideInMenu: false,
        requiresAuth: true,
        requiresAdmin: true,
    },
    LOGIN: {
        path: "/auth/login",
        name: "login",
        title: "用户登录",
        hideInMenu: true,
        requiresAuth: false,
    },
    REGISTER: {
        path: "/auth/register",
        name: "register",
        title: "用户注册",
        hideInMenu: true,
        requiresAuth: false,
    },
    NOT_FOUND_ERR: {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        title: "页面未找到",
        hideInMenu: true,
        requiresAuth: false,
    },
};

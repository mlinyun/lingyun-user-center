import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/routes";
import { BProgress } from "@bprogress/core";
import { useAuthStore } from "@/stores/auth";
import { messageUtils } from "@/utils/message";
import type { Api } from "@/types/api/typings";

/**
 * BProgress 进度条配置
 */
BProgress.configure({
    minimum: 0.08, // 设置最小进度值
    maximum: 1, // 设置最大进度值
    easing: "linear", // 设置动画缓动函数
    positionUsing: "translate3d", // 设置进度条位置使用的 CSS 属性
    speed: 200, // 设置进度条动画速度（毫秒）
    trickle: true, // 启用自动递增功能
    trickleSpeed: 200, // 设置自动递增的速度（毫秒）
    showSpinner: false, // 隐藏旋转加载图标
    direction: "ltr", // 设置进度条从左到右显示
});

/**
 * 创建 Vue Router 实例.
 */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

/**
 * 路由前置守卫.
 */
router.beforeEach(async (to) => {
    // 启动页面加载进度条
    BProgress.start();

    const authStore = useAuthStore();
    const requiresAuth = Boolean(to.meta.requiresAuth);
    const requiredRole = to.meta.requiredRole as Api.User.UserRole | undefined;

    if (requiresAuth) {
        // 受保护页面采用严格校验，确保服务端 Session 仍然有效
        await authStore.bootstrap({ strict: true });

        if (!authStore.isAuthenticated) {
            return {
                path: "/auth/login",
                query: { redirect: to.fullPath },
            };
        }

        if (requiredRole && authStore.user?.userRole !== requiredRole) {
            messageUtils.error("当前账号无权访问该页面");
            return "/";
        }
    } else if (!authStore.initialized) {
        // 非受保护页面只进行后台探测，不阻塞页面跳转
        void authStore.bootstrap();
    }

    // 已登录用户访问登录/注册页时，自动回跳到目标页或首页
    if (to.path.startsWith("/auth") && authStore.isAuthenticated) {
        return typeof to.query.redirect === "string" ? to.query.redirect : "/";
    }

    return true;
});

/**
 * 路由后置守卫.
 */
router.afterEach((to) => {
    // 设置页面标题
    const baseTitle = import.meta.env.VITE_APP_TITLE || "凌云 AI 零代码应用生成平台";
    document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle;
    // 完成页面加载进度条，确保在页面完全加载后才结束进度条
    setTimeout(() => {
        BProgress.done();
    }, 600);
});

/**
 * 导出路由实例.
 */
export default router;

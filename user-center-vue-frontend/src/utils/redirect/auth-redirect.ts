import { ROUTES } from "@/constants/routes.ts";

/**
 * 获取安全的认证重定向路径，确保只允许站内相对路径，避免开放重定向漏洞.
 *
 * @param redirect
 */
export const getSafeAuthRedirect = (redirect: unknown): string => {
    if (typeof redirect !== "string" || redirect.trim() === "") {
        return ROUTES.HOME.path;
    }

    // 只允许站内相对路径，避免把外部地址当作回跳目标。
    if (!redirect.startsWith("/") || redirect.startsWith("//")) {
        return ROUTES.HOME.path;
    }

    // 禁止包含协议
    try {
        // URL 构造函数会抛出异常，如果 redirect 是一个相对路径而不是完整 URL
        const url = new URL(redirect, window.location.origin);
        if (url.origin !== window.location.origin) {
            return ROUTES.HOME.path;
        }
        return `${url.pathname}${url.search}${url.hash}`;
    } catch (error) {
        console.log("Invalid redirect URL, defaulting to home:", error);
        return ROUTES.HOME.path;
    }
};

import { ROUTES } from "@/constants/routes";

/**
 * 获取安全的认证重定向路径，确保只允许站内相对路径，避免开放重定向漏洞.
 */
export const getSafeAuthRedirect = (redirect: unknown): string => {
  if (typeof redirect !== "string" || redirect.trim() === "") {
    return ROUTES.HOME.path;
  }

  if (!redirect.startsWith("/") || redirect.startsWith("//")) {
    return ROUTES.HOME.path;
  }

  try {
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

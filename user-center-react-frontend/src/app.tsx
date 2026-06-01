import { GithubOutlined } from "@ant-design/icons";
import type { Settings as LayoutSettings } from "@ant-design/pro-components";
import { SettingDrawer } from "@ant-design/pro-components";
import type { RequestConfig, RunTimeLayoutConfig } from "@umijs/max";
import { history, Link } from "@umijs/max";
import { message } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect } from "react";

// Initialize dayjs plugins globally
dayjs.extend(relativeTime);

import {
  AvatarDropdown,
  ErrorBoundary,
  Footer,
  OfflineBanner,
} from "@/components";
import { CONTENT_TYPE, REQUEST_TIMEOUT, ROUTES } from "@/constants";
import { type AuthState, authStore, bindAuthStore } from "@/stores/auth";
import {
  bindLayoutStore,
  type LayoutState,
  layoutStore,
} from "@/stores/layout";
import { getSafeAuthRedirect } from "@/utils/redirect/auth-redirect";
import defaultSettings from "../config/defaultSettings";
import { errorConfig, setAuthExpiredHandler } from "./requestErrorConfig";

const loginPath = ROUTES.LOGIN.path;
const AUTH_ROUTE_PREFIX = "/auth";

const isAuthRoute = (path: string): boolean =>
  path === AUTH_ROUTE_PREFIX || path.startsWith(`${AUTH_ROUTE_PREFIX}/`);

const resolveRouteMeta = (
  path: string,
): (typeof ROUTES)[keyof typeof ROUTES] | undefined =>
  Object.values(ROUTES).find((route) => route.path === path);

const getCurrentPath = (): string => {
  const { pathname, search, hash } = history.location;
  return `${pathname}${search}${hash}`;
};

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export interface InitialState {
  settings?: Partial<LayoutSettings>;
  auth?: AuthState;
  layout?: LayoutState;
  settingDrawerOpen?: boolean;
  loading?: boolean;
}

export async function getInitialState(): Promise<InitialState> {
  return {
    settings: defaultSettings as Partial<LayoutSettings>,
    auth: authStore.getState(),
    layout: layoutStore.getState(),
    settingDrawerOpen: false,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  bindAuthStore(setInitialState);
  bindLayoutStore(setInitialState);
  setAuthExpiredHandler(() => {
    authStore.clearAuthState();
  });

  const currentUser = initialState?.auth?.user;

  return {
    menuItemRender: (item, dom) => {
      if (item.path) {
        return (
          <Link to={item.path} prefetch>
            {dom}
          </Link>
        );
      }
      return dom;
    },
    actionsRender: () => [<GithubOutlined key="github" />],
    avatarProps: {
      src: currentUser?.userAvatar,
      title: currentUser?.userName,
      render: (_, avatarChildren) => (
        <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      ),
    },
    waterMarkProps: {
      content: currentUser?.userName,
    },
    footerRender: () => <Footer />,
    onPageChange: async () => {
      const { location } = history;
      const path = location.pathname;
      const authRoute = isAuthRoute(path);
      const routeMeta = resolveRouteMeta(path);
      const needsAuth = routeMeta?.requiresAuth ?? false;
      const needsAdmin =
        routeMeta && "requiresAdmin" in routeMeta
          ? Boolean(routeMeta.requiresAdmin)
          : false;

      try {
        if (authRoute && authStore.isAuthenticated()) {
          const redirect = new URLSearchParams(location.search).get("redirect");
          history.replace(getSafeAuthRedirect(redirect));
          return;
        }

        if (needsAuth) {
          await authStore.bootstrap({ strict: true });

          if (!authStore.isAuthenticated()) {
            history.replace(
              `${loginPath}?redirect=${encodeURIComponent(getCurrentPath())}`,
            );
            return;
          }

          if (needsAdmin && !authStore.isAdmin()) {
            message.error("当前账号无权访问该页面");
            history.replace(ROUTES.HOME.path);
          }
          return;
        }

        if (!authRoute && !authStore.getState().initialized) {
          void authStore.bootstrap().catch((error) => {
            console.error("Silent auth bootstrap failed:", error);
          });
        }
      } catch (error) {
        console.error("Router auth guard error:", error);
        authStore.clearAuthState();
        if (needsAuth) {
          history.replace(
            `${loginPath}?redirect=${encodeURIComponent(getCurrentPath())}`,
          );
        }
      }
    },
    collapsed: initialState?.layout?.sidebarCollapsed,
    onCollapse: (collapsed) => {
      layoutStore.setSidebarCollapsed(collapsed);
    },
    bgLayoutImgList: [
      {
        src: "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr",
        left: 85,
        bottom: 100,
        height: "303px",
      },
      {
        src: "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr",
        bottom: -68,
        right: -45,
        height: "303px",
      },
      {
        src: "https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr",
        bottom: 0,
        left: 0,
        width: "331px",
      },
    ],
    // Replace ProLayout's default ErrorBoundary with our offline-aware version,
    // so chunk load errors show friendly messages instead of "Something went wrong."
    ErrorBoundary,
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            collapse={initialState?.settingDrawerOpen}
            onCollapseChange={(open) => {
              setInitialState((s) => ({
                ...(s ?? {}),
                settingDrawerOpen: open,
              }));
            }}
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((s) => ({
                ...(s ?? {}),
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: "/api",
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": CONTENT_TYPE.JSON,
  },
  ...errorConfig,
};

const AuthHeartbeat: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    authStore.startSessionHeartbeat();
    return () => {
      authStore.stopSessionHeartbeat();
    };
  }, []);

  return <>{children}</>;
};

export function rootContainer(container: React.ReactNode) {
  return (
    <>
      <OfflineBanner />
      <ErrorBoundary>
        <AuthHeartbeat>{container}</AuthHeartbeat>
      </ErrorBoundary>
    </>
  );
}

import {
  LogoutOutlined,
  SettingOutlined,
  SkinOutlined,
} from "@ant-design/icons";
import { history, useModel } from "@umijs/max";
import type { MenuProps } from "antd";
import { Spin } from "antd";
import React from "react";
import { ROUTES } from "@/constants/routes";
import { authStore } from "@/stores/auth";
import HeaderDropdown from "../HeaderDropdown";

type GlobalHeaderRightProps = {
  children?: React.ReactNode;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  children,
}) => {
  const loginOut = async () => {
    await authStore.logout();
    const { pathname, search } = history.location;
    if (pathname !== ROUTES.LOGIN.path) {
      history.replace(
        `${ROUTES.LOGIN.path}?redirect=${encodeURIComponent(pathname + search)}`,
      );
    }
  };
  const { initialState, setInitialState } = useModel("@@initialState");

  const onMenuClick: MenuProps["onClick"] = (event) => {
    const { key } = event;
    if (key === "logout") {
      void loginOut();
      return;
    }
    if (key === "theme") {
      setInitialState((s) => ({ ...(s ?? {}), settingDrawerOpen: true }));
      return;
    }
    if (key === "settings") {
      history.push(ROUTES.SETTINGS.path);
    }
  };

  if (!initialState) {
    return <Spin size="small" />;
  }

  const currentUser = initialState.auth?.user;

  if (!currentUser) {
    return <Spin size="small" />;
  }

  const menuItems: MenuProps["items"] = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "个人设置",
    },
    {
      key: "theme",
      icon: <SkinOutlined />,
      label: "主题设置",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];

  return (
    <HeaderDropdown
      placement="bottomRight"
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
      arrow
    >
      {children}
    </HeaderDropdown>
  );
};

export default [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "系统首页",
    icon: "smile",
    component: "./home",
  },
  {
    path: "/profiles",
    name: "个人中心",
    icon: "user",
    component: "./user/profiles",
  },
  {
    path: "/settings",
    name: "账号设置",
    icon: "setting",
    component: "./user/settings",
  },
  {
    path: "/auth",
    layout: false,
    routes: [
      {
        path: "/auth/login",
        name: "登录",
        component: "./auth/login",
      },
      {
        path: "/auth/register",
        name: "注册",
        component: "./auth/register",
      },
    ],
  },
  {
    path: "/manage",
    name: "用户管理",
    icon: "crown",
    access: "canAdmin",
    component: "./admin/manage",
  },
  {
    path: "/health",
    name: "健康检查",
    icon: "heart",
    access: "canAdmin",
    component: "./admin/health",
  },
  {
    component: "./exception/404",
    layout: false,
    path: "./*",
  },
];

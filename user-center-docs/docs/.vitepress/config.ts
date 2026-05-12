import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: "/",
    lang: "zh-CN",
    title: "凌云用户中心系统",
    description:
        "凌云用户中心系统文档 — 静态文档站点，提供安装与快速上手、接口与配置说明、权限与认证示例以及部署与运维指南，面向开发者与运维人员的详细参考。",
    head: [["link", { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]],
    srcDir: "./src",
    markdown: {
        // 开启代码行号显示
        lineNumbers: true,
    },
    cleanUrls: true,
    sitemap: {
        hostname: "https://docs.uc.mlinyun.com",
    },
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: "/user-center-logo.svg",
        siteTitle: "凌云用户中心系统",
        search: {
            provider: "local",
            options: {
                translations: {
                    button: {
                        buttonText: "搜索",
                        buttonAriaLabel: "搜索",
                    },
                    modal: {
                        noResultsText: "无法找到相关结果",
                        resetButtonTitle: "重置搜索条件",
                        footer: {
                            selectText: "选择",
                            navigateText: "切换",
                            closeText: "关闭",
                        },
                    },
                },
            },
        },
        nav: [
            { text: "Home", link: "/" },
            { text: "Examples", link: "/markdown-examples" },
        ],
        sidebar: [
            {
                text: "Examples",
                items: [
                    { text: "Markdown Examples", link: "/markdown-examples" },
                    { text: "Runtime API Examples", link: "/api-examples" },
                ],
            },
        ],
        outline: {
            label: "本页目录",
            level: [2, 3],
        },
        returnToTopLabel: "返回顶部",
        sidebarMenuLabel: "菜单",
        darkModeSwitchLabel: "主题",
        darkModeSwitchTitle: "切换到深色主题",
        lightModeSwitchTitle: "切换到浅色主题",
        socialLinks: [{ icon: "github", link: "https://github.com/mlinyun/user-center" }],
        editLink: {
            pattern: "https://github.com/mlinyun/user-center/blob/main/user-center-docs/docs/src/:path",
            text: "在 GitHub 上编辑此页面",
        },
        docFooter: { prev: "上一篇", next: "下一篇" },
        lastUpdated: {
            text: "最后更新于",
            formatOptions: {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: "Asia/Shanghai",
            },
        },
        footer: {
            message:
                '版权所有 © 2026 mlinyun &nbsp;&nbsp; \
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit">粤ICP备2025419292号-1</a>',
            copyright:
                "文档内容仅供参考，未经书面许可，不得复制、转载或用于商业用途。文档中示例代码的许可以仓库中的 LICENSE 文件为准",
        },
    },
});

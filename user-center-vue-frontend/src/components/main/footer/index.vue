<script setup lang="ts">
/**
 * 主布局页脚组件.
 */
import { getCurrentYear } from "@/utils/date";
import { CONTACT_EMAIL, DOCUMENT_URL, GITHUB_URL } from "@/constants";
import { GithubOutlined, GlobalOutlined, MailOutlined } from "@ant-design/icons-vue";

defineOptions({ name: "MainFooter" });

// 获取当前年份
const currentYear: number = getCurrentYear();

// 页脚链接配置
const footerLinks = [
    {
        key: "backend",
        title: "项目源码",
        href: GITHUB_URL,
        icon: GithubOutlined,
    },
    {
        key: "docs",
        title: "项目文档",
        href: DOCUMENT_URL,
        icon: GlobalOutlined,
    },
    {
        key: "email",
        title: "联系邮箱",
        href: CONTACT_EMAIL,
        icon: MailOutlined,
    },
];
</script>

<template>
    <a-layout-footer id="main-footer">
        <!-- 链接区域 -->
        <div class="footer-links">
            <a-space :size="'small'">
                <template v-for="(link, index) in footerLinks" :key="link.key">
                    <a :href="link.href" class="footer-link" rel="noopener noreferrer" target="_blank">
                        <component :is="link.icon" />
                        {{ link.title }}
                    </a>
                    <a-divider v-if="index < footerLinks.length - 1" type="vertical" />
                </template>
            </a-space>
        </div>
        <!-- 版权和备案信息 - 单行显示 -->
        <div class="footer-copyright">
            <span>
                Copyright © {{ currentYear }}
                <a :href="GITHUB_URL" class="author-link" rel="noopener noreferrer" target="_blank"> 凌云 (mlinyun) </a>
                All Rights Reserved.
            </span>
            <a-divider :style="{ margin: '0 8px' }" type="vertical" />
            <a class="beian-link" href="https://beian.miit.gov.cn/" rel="noopener noreferrer" target="_blank">
                粤ICP备xxxxxxxxxx号-x
            </a>
        </div>
    </a-layout-footer>
</template>

<style scoped>
#main-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 12px 50px;
    border-top: 1px solid rgb(0 0 0 / 6%);
}

/* 链接区域 */
.footer-links {
    margin-bottom: 6px;
    line-height: normal;
}

.footer-link {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    color: rgb(0 0 0 / 45%);
    text-decoration: none;
    transition: color 0.2s;
}

.footer-link:hover {
    color: #1890ff;
}

/* 版权和备案信息 */
.footer-copyright {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: normal;
    color: rgb(0 0 0 / 45%);
}

.author-link {
    margin: 0 4px;
    font-weight: 400;
    color: rgb(0 0 0 / 65%);
    text-decoration: none;
}

.author-link:hover {
    color: #1890ff;
}

.beian-link {
    color: rgb(0 0 0 / 45%);
    text-decoration: none;
}

.beian-link:hover {
    color: #1890ff;
}
</style>

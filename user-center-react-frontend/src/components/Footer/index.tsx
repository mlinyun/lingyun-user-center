import {
  GithubOutlined,
  GlobalOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Divider, Space } from "antd";
import { createStyles } from "antd-style";
import React from "react";
import {
  CONTACT_EMAIL,
  DOCUMENT_URL,
  GITHUB_URL,
  MY_GITHUB_URL,
} from "@/constants";

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

const useStyles = createStyles(({ token, css }) => ({
  footer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 12px 50px;
    background: rgb(255 255 255 / 80%);
    border-top: 1px solid rgb(0 0 0 / 6%);
  `,
  footerLinks: css`
    margin-bottom: 6px;
    line-height: normal;
  `,
  footerLink: css`
    display: inline-flex;
    gap: 4px;
    align-items: center;
    color: rgb(0 0 0 / 45%);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${token.colorPrimary};
    }
  `,
  footerCopyright: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: normal;
    color: rgb(0 0 0 / 45%);
  `,
  authorLink: css`
    margin: 0 4px;
    font-weight: 400;
    color: rgb(0 0 0 / 65%);
    text-decoration: none;

    &:hover {
      color: ${token.colorPrimary};
    }
  `,
  beianLink: css`
    color: rgb(0 0 0 / 45%);
    text-decoration: none;

    &:hover {
      color: ${token.colorPrimary};
    }
  `,
}));

const Footer: React.FC = () => {
  const { styles } = useStyles();
  const year = new Date().getFullYear();

  return (
    <div className={styles.footer}>
      {/* 链接区域 */}
      <div className={styles.footerLinks}>
        <Space size="small">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.key}>
              <a
                className={styles.footerLink}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <link.icon />
                {link.title}
              </a>
              {index < footerLinks.length - 1 && <Divider type="vertical" />}
            </React.Fragment>
          ))}
        </Space>
      </div>

      {/* 版权和备案信息 */}
      <div className={styles.footerCopyright}>
        <span>
          Copyright © {year}{" "}
          <a
            className={styles.authorLink}
            href={MY_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            凌云 (mlinyun)
          </a>
          All Rights Reserved.
        </span>
        <Divider type="vertical" style={{ margin: "0 8px" }} />
        <a
          className={styles.beianLink}
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          粤ICP备xxxxxxxxxx号-x
        </a>
      </div>
    </div>
  );
};

export default Footer;

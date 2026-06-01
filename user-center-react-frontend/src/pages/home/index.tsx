import {
  BookOutlined,
  CodeOutlined,
  GithubOutlined,
  GlobalOutlined,
  RocketOutlined,
  SafetyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useModel } from "@umijs/max";
import { Card, Col, Layout, Row, Tag, Typography } from "antd";
import { createStyles } from "antd-style";
import dayjs from "dayjs";
import React from "react";
import { DOCUMENT_URL, GITHUB_URL } from "@/constants";

const { Text, Title, Paragraph } = Typography;

const useStyles = createStyles(({ token }) => ({
  container: {
    height: "100%",
    background: "rgb(255 255 255 / 80%)",
  },
  welcomeBanner: {
    position: "relative",
    marginBottom: 24,
    overflow: "hidden",
    borderRadius: 16,
    boxShadow: "0 2px 8px rgb(0 0 0 / 6%)",
  },
  greetingSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
  },
  greetingAccentBar: {
    width: 4,
    height: 32,
    marginRight: 16,
    background: `linear-gradient(180deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
    borderRadius: 2,
  },
  greetingTitle: {
    margin: 0,
    fontSize: 42,
    fontWeight: 700,
    background:
      "linear-gradient(135deg, rgb(0 0 0 / 85%) 0%, rgb(0 0 0 / 45%) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  welcomeText: {
    maxWidth: 600,
    marginBottom: 32,
    fontSize: 16,
    lineHeight: 1.8,
    textIndent: "2em",
    color: token.colorTextSecondary,
  },
  actionButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: 600,
    textDecoration: "none",
    borderRadius: 8,
    color: "#fff",
    background: token.colorPrimary,
    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      color: "#fff",
      boxShadow: "0 6px 16px rgba(24, 144, 255, 0.45)",
      transform: "translateY(-2px)",
    },
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: 600,
    textDecoration: "none",
    borderRadius: 8,
    color: token.colorText,
    background: "transparent",
    border: `1px solid ${token.colorBorder}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      color: token.colorPrimary,
      borderColor: token.colorPrimary,
      transform: "translateY(-2px)",
    },
  },
  btnIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  userInfoCard: {
    background: "linear-gradient(135deg, #fafafa 0%, #fff 100%)",
    border: "1px solid #f0f0f0",
    borderRadius: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: token.colorTextTertiary,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  },
  userInfoFooter: {
    paddingTop: 20,
    marginTop: 20,
    borderTop: "1px solid #f0f0f0",
  },
  sectionCard: {
    marginBottom: 24,
    borderRadius: 12,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 20,
  },
  featureCard: {
    height: "100%",
    borderRadius: 12,
    transition: "all 0.3s ease",
  },
  featureIcon: {
    marginBottom: 16,
    fontSize: 32,
    color: token.colorPrimary,
  },
  featureTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  stackCard: {
    borderRadius: 8,
    transition: "all 0.3s ease",
  },
  technologies: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  bgGrid: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    width: "40%",
    height: "100%",
    pointerEvents: "none" as const,
    background: `radial-gradient(circle, ${token.colorPrimary} 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
    opacity: 0.05,
  },
  bgCircle: {
    position: "absolute" as const,
    right: -50,
    bottom: -50,
    width: 200,
    height: 200,
    pointerEvents: "none" as const,
    background: `radial-gradient(circle, ${token.colorPrimaryBg} 0%, transparent 70%)`,
    borderRadius: "50%",
  },
}));

const features = [
  {
    icon: <SafetyOutlined />,
    title: "安全可靠",
    desc: "采用 BCrypt 加密算法，Session 会话管理，AOP 权限校验，全方位保障系统安全。",
    tags: ["BCrypt", "Session", "AOP"],
  },
  {
    icon: <TeamOutlined />,
    title: "用户管理",
    desc: "完善的用户管理功能，支持注册、登录、信息修改、权限管理等核心业务。",
    tags: ["注册", "登录", "权限"],
  },
  {
    icon: <CodeOutlined />,
    title: "代码规范",
    desc: "遵循企业级代码规范，使用 Spotless、Checkstyle 保证代码质量和一致性。",
    tags: ["Spotless", "Checkstyle", "ESLint"],
  },
  {
    icon: <RocketOutlined />,
    title: "开箱即用",
    desc: "基于 Spring Boot + React 19 技术栈，前后端分离架构，快速上手开发。",
    tags: ["Spring Boot", "React 19", "Ant Design"],
  },
  {
    icon: <BookOutlined />,
    title: "API 文档",
    desc: "集成 Knife4j 接口文档，自动生成 API 文档，支持在线调试。",
    tags: ["Knife4j", "Swagger", "OpenAPI"],
  },
  {
    icon: <GithubOutlined />,
    title: "开源项目",
    desc: "完全开源，代码托管在 GitHub，欢迎 Star 和贡献代码。",
    tags: ["GitHub", "Apache 2.0"],
  },
];

const techStacks = [
  {
    title: "后端技术",
    technologies: [
      "Spring Boot 4",
      "MyBatis-Plus",
      "MySQL",
      "Knife4j",
      "Hutool",
      "Lombok",
    ],
    color: "#52c41a",
  },
  {
    title: "前端技术",
    technologies: ["React 19", "Ant Design 6", "TypeScript", "Vite", "Umi Max"],
    color: "#1890ff",
  },
  {
    title: "工程化",
    technologies: ["Maven", "npm", "Spotless", "Checkstyle", "Biome"],
    color: "#fa8c16",
  },
];

const Home: React.FC = () => {
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.auth?.user;
  const { styles } = useStyles();

  return (
    <Layout className={styles.container}>
      <PageContainer>
        {/* Welcome Banner */}
        <Card
          className={styles.welcomeBanner}
          styles={{ body: { padding: "48px 32px" } }}
        >
          <div className={styles.bgGrid} />
          <div className={styles.bgCircle} />

          <Row gutter={[48, 32]} align="middle">
            <Col lg={14} xs={24}>
              <div>
                <div className={styles.greetingSection}>
                  <div className={styles.greetingAccentBar} />
                  <h1 className={styles.greetingTitle}>
                    你好，{currentUser?.userName || "访客"}
                  </h1>
                </div>
                <Paragraph className={styles.welcomeText}>
                  欢迎来到凌云用户中心系统 —— 一个基于
                  <Text strong>Spring Boot 4</Text>+<Text strong>React 19</Text>
                  构建的企业级用户管理平台。系统提供完整的用户认证、权限管理、数据安全等核心功能，采用前后端分离架构，代码规范严谨，非常适合作为全栈项目的学习参考。
                </Paragraph>
                <div className={styles.actionButtons}>
                  <a
                    href={GITHUB_URL}
                    className={styles.btnPrimary}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GithubOutlined className={styles.btnIcon} />
                    项目代码仓库
                  </a>
                  <a
                    href={DOCUMENT_URL}
                    className={styles.btnSecondary}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GlobalOutlined className={styles.btnIcon} />
                    项目文档地址
                  </a>
                </div>
              </div>
            </Col>

            <Col lg={10} xs={24}>
              {/* User Info Card */}
              <Card className={styles.userInfoCard}>
                <div style={{ marginBottom: 20 }}>
                  <Text className={styles.sectionLabel}>用户信息</Text>
                </div>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <Text type="secondary">当前角色</Text>
                    <Tag
                      color={
                        currentUser?.userRole === "admin" ? "gold" : "blue"
                      }
                    >
                      {currentUser?.userRole === "admin"
                        ? "管理员"
                        : "普通用户"}
                    </Tag>
                  </div>
                  <div className={styles.infoItem}>
                    <Text type="secondary">登录账号</Text>
                    <Text strong>{currentUser?.userAccount || "-"}</Text>
                  </div>
                  <div className={styles.infoItem}>
                    <Text type="secondary">用户ID</Text>
                    <Text>{currentUser?.id || "未设置"}</Text>
                  </div>
                  <div className={styles.infoItem}>
                    <Text type="secondary">邮箱地址</Text>
                    <Text>{currentUser?.userEmail || "未设置"}</Text>
                  </div>
                  <div className={styles.infoItem}>
                    <Text type="secondary">手机号码</Text>
                    <Text code>{currentUser?.userPhone || "未设置"}</Text>
                  </div>
                </div>
                <div className={styles.userInfoFooter}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    账号创建时间：
                    {currentUser?.createTime
                      ? dayjs(currentUser.createTime).format(
                          "YYYY-MM-DD HH:mm:ss",
                        )
                      : "-"}
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Feature Cards */}
        <Card
          className={styles.sectionCard}
          title={<h3 className={styles.sectionTitle}>✨ 核心功能特性</h3>}
        >
          <Row gutter={[24, 24]}>
            {features.map((feature) => (
              <Col key={feature.title} lg={8} sm={12} xs={24}>
                <Card hoverable className={styles.featureCard}>
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <Title level={4} style={{ marginBottom: 12 }}>
                    {feature.title}
                  </Title>
                  <Paragraph
                    type="secondary"
                    style={{ minHeight: 66, marginBottom: 16 }}
                  >
                    {feature.desc}
                  </Paragraph>
                  {feature.tags && feature.tags.length > 0 && (
                    <div className={styles.featureTags}>
                      {feature.tags.map((tag) => (
                        <Tag key={tag} color="blue">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Tech Stack Cards */}
        <Card
          className={styles.sectionCard}
          title={<h3 className={styles.sectionTitle}>🔧 技术栈</h3>}
        >
          <Row gutter={[24, 24]}>
            {techStacks.map((stack) => (
              <Col key={stack.title} lg={8} xs={24}>
                <Card
                  hoverable
                  className={styles.stackCard}
                  style={{ borderLeft: `4px solid ${stack.color}` }}
                >
                  <Title level={5} style={{ marginBottom: 16 }}>
                    {stack.title}
                  </Title>
                  <div className={styles.technologies}>
                    {stack.technologies.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </PageContainer>
    </Layout>
  );
};

export default Home;

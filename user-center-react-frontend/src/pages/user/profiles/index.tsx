import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Layout,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { createStyles } from "antd-style";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { DEFAULT_AVATAR } from "@/constants";
import { authStore } from "@/stores/auth";
import GenderDisplay from "./components/GenderDisplay";

const { Text, Title } = Typography;

const useStyles = createStyles(() => ({
  container: {
    height: "100%",
    background: "rgb(255 255 255 / 80%)",
  },
  avatarWrapper: {
    marginBottom: 24,
    textAlign: "center",
  },
  avatar: {
    border: "2px solid #fff",
    boxShadow: "0 0 0 1px #d9d9d9",
  },
  username: {
    marginBottom: "8px !important",
    textAlign: "center",
  },
  userAccount: {
    textAlign: "center",
  },
  roleWrapper: {
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  userProfile: {
    padding: 16,
    marginBottom: 24,
    textAlign: "center",
    background: "#fafafa",
    borderRadius: 8,
  },
  profileText: {
    fontSize: 13,
    lineHeight: 1.6,
  },
  userStats: {
    padding: 20,
    border: "1px solid #f0f0f0",
    borderRadius: 12,
    boxShadow: "0 1px 2px rgb(0 0 0 / 3%)",
  },
  statItem: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  statItemBorder: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottom: "1px dashed #f0f0f0",
  },
  statIcon: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    fontSize: 18,
    background: "#e6f7ff",
    borderRadius: 8,
  },
  statContent: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    padding: "0 12px",
  },
  statValue: {
    fontFamily: "Monaco, Consolas, monospace",
    fontSize: 14,
    fontWeight: 500,
  },
  daysNumber: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1,
    color: "#1890ff",
  },
  infoCard: {
    marginBottom: 24,
  },
  cardIcon: {
    color: "#1890ff",
  },
  contactIcon: {
    color: "#1890ff",
  },
}));

const UserProfiles: React.FC = () => {
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.auth?.user;
  const [loading, setLoading] = useState(false);
  const { styles } = useStyles();

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      authStore
        .refreshCurrentUser()
        .catch((error) => {
          console.log("刷新用户信息失败:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const accountDays = useMemo(() => {
    if (!currentUser?.createTime) return 0;
    const now = dayjs();
    const create = dayjs(currentUser.createTime);
    return Math.ceil(now.diff(create, "day", true));
  }, [currentUser?.createTime]);

  return (
    <Layout className={styles.container}>
      <Spin spinning={loading} tip="加载中...">
        <Row gutter={[24, 24]} style={{ padding: 24 }}>
          {/* Left: User basic info */}
          <Col md={8} xs={24}>
            <Card>
              <div className={styles.avatarWrapper}>
                <Avatar
                  size={120}
                  src={currentUser?.userAvatar || DEFAULT_AVATAR}
                  icon={<UserOutlined />}
                  className={styles.avatar}
                />
              </div>
              <Title level={3} className={styles.username}>
                {currentUser?.userName || "未设置昵称"}
              </Title>
              <div className={styles.userAccount}>
                <Text type="secondary">@{currentUser?.userAccount}</Text>
              </div>
              <div className={styles.roleWrapper}>
                <Tag
                  color={currentUser?.userRole === "admin" ? "gold" : "blue"}
                >
                  {currentUser?.userRole === "admin" ? "管理员" : "普通用户"}
                </Tag>
              </div>
              {currentUser?.userProfile && (
                <div className={styles.userProfile}>
                  <Text type="secondary" className={styles.profileText}>
                    {currentUser.userProfile}
                  </Text>
                </div>
              )}
              {/* User stats */}
              <div className={styles.userStats}>
                <div className={`${styles.statItem} ${styles.statItemBorder}`}>
                  <div className={styles.statIcon}>🆔</div>
                  <div className={styles.statContent}>
                    <Text type="secondary" className={styles.statLabel}>
                      用户 ID
                    </Text>
                    <Text code copyable className={styles.statValue}>
                      {currentUser?.id ?? "-"}
                    </Text>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>📅</div>
                  <div className={styles.statContent}>
                    <Text type="secondary" className={styles.statLabel}>
                      账号使用天数
                    </Text>
                    <Text className={styles.daysNumber}>{accountDays}</Text>
                    <Text type="secondary" className={styles.statLabel}>
                      天
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right: User details */}
          <Col md={16} xs={24}>
            {/* Account info */}
            <Card
              bordered
              className={styles.infoCard}
              title={
                <Space>
                  <UserOutlined className={styles.cardIcon} />
                  <Text strong>账号信息</Text>
                </Space>
              }
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="登录账号">
                  <Text copyable>{currentUser?.userAccount || "-"}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="用户昵称">
                  {currentUser?.userName || "未设置"}
                </Descriptions.Item>
                <Descriptions.Item label="用户角色">
                  <Tag
                    color={currentUser?.userRole === "admin" ? "gold" : "blue"}
                  >
                    {currentUser?.userRole === "admin" ? "管理员" : "普通用户"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="性别">
                  <GenderDisplay gender={currentUser?.userGender} />
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Contact info */}
            <Card
              bordered
              className={styles.infoCard}
              title={
                <Space>
                  <PhoneOutlined className={styles.cardIcon} />
                  <Text strong>联系方式</Text>
                </Space>
              }
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="邮箱地址">
                  {currentUser?.userEmail ? (
                    <Space>
                      <MailOutlined className={styles.contactIcon} />
                      <Text copyable>{currentUser.userEmail}</Text>
                    </Space>
                  ) : (
                    <Text type="secondary">未设置</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="手机号码">
                  {currentUser?.userPhone ? (
                    <Space>
                      <PhoneOutlined className={styles.contactIcon} />
                      <Text copyable>{currentUser.userPhone}</Text>
                    </Space>
                  ) : (
                    <Text type="secondary">未设置</Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* System info */}
            <Card
              bordered
              className={styles.infoCard}
              title={
                <Space>
                  <span style={{ fontSize: 16 }}>⏰</span>
                  <Text strong>系统信息</Text>
                </Space>
              }
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="账号创建时间">
                  {currentUser?.createTime
                    ? dayjs(currentUser.createTime).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )
                    : "-"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Spin>
    </Layout>
  );
};

export default UserProfiles;

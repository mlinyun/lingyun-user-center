import { useModel } from "@umijs/max";
import { Col, Layout, Row, Spin } from "antd";
import { createStyles } from "antd-style";
import React, { useEffect, useState } from "react";
import { authStore } from "@/stores/auth";
import AccountSecurity from "./components/AccountSecurity";
import BasicInfo from "./components/BasicInfo";
import PasswordManagement from "./components/PasswordManagement";
import UserAvatar from "./components/UserAvatar";

const useStyles = createStyles(() => ({
  container: {
    height: "100%",
    background: "rgb(255 255 255 / 80%)",
    padding: 24,
  },
}));

const UserSettings: React.FC = () => {
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

  return (
    <Layout className={styles.container}>
      <Spin spinning={loading}>
        <Row gutter={[24, 24]}>
          <Col md={12} xs={24}>
            <UserAvatar />
          </Col>
          <Col md={12} xs={24}>
            <BasicInfo />
          </Col>
          <Col md={12} xs={24}>
            <AccountSecurity />
          </Col>
          <Col md={12} xs={24}>
            <PasswordManagement />
          </Col>
        </Row>
      </Spin>
    </Layout>
  );
};

export default UserSettings;

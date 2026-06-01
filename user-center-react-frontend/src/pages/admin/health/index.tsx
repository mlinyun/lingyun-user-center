import {
  ApiOutlined,
  CloudServerOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Descriptions, Result, Space } from "antd";
import { createStyles } from "antd-style";
import React, { useState } from "react";
import { BusinessCode } from "@/constants/code";
import { healthCheck } from "@/services/ant-design-pro/main";

const useStyles = createStyles(() => ({
  overviewCard: {
    background:
      "linear-gradient(135deg, rgb(22 119 255 / 12%) 0%, rgb(47 84 235 / 8%) 100%)",
    borderRadius: 12,
    marginBottom: 24,
  },
  overviewTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
  },
  overviewSubtitle: {
    margin: "4px 0 0",
    color: "rgb(0 0 0 / 45%)",
  },
  overviewIcon: {
    fontSize: 32,
    color: "#1677ff",
  },
  healthCard: {
    borderRadius: 8,
  },
  descBox: {
    maxWidth: 900,
    padding: "24px 16px",
    margin: "0 auto",
    textAlign: "left" as const,
    backgroundColor: "#fafafa",
    borderRadius: 8,
  },
}));

const Health: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "info" | "success" | "error" | "warning"
  >("info");
  const [statusMessage, setStatusMessage] = useState(
    "系统已就绪，等待全面诊断指令。",
  );
  const [subMessage, setSubMessage] = useState(
    "请点击下方按钮，获取服务端实时运行反馈与健康状况。",
  );
  const [lastCheckTime, setLastCheckTime] = useState("-");
  const { styles } = useStyles();

  const handleCheck = async () => {
    setLoading(true);
    setStatus("info");
    setStatusMessage("正在检测系统健康状态...");
    setSubMessage("正在与后端服务建立连接，并获取各模块运行反馈...");
    setLastCheckTime("-");

    try {
      const [res] = await Promise.all([
        healthCheck(),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      const { code, success, data, message: msg } = res;

      if (code === BusinessCode.SUCCESS || success) {
        setStatus("success");
        setStatusMessage("系统健康状态良好");
        setSubMessage(
          (data as string) || "后端服务连接正常，各项核心指标稳定运行。",
        );
      } else {
        setStatus("warning");
        setStatusMessage("服务返回异常告警");
        setSubMessage(msg || "能连接服务端，但未获得通过状态，请检查日志。");
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage("网络连接故障");
      setSubMessage(
        (error as Error).message || "无法连接到后端服务器，请检查网络链路！",
      );
    } finally {
      setLoading(false);
      const now = new Date();
      setLastCheckTime(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`,
      );
    }
  };

  return (
    <PageContainer>
      <Card className={styles.overviewCard} bordered={false}>
        <Space size="middle">
          <DashboardOutlined className={styles.overviewIcon} />
          <div>
            <h2 className={styles.overviewTitle}>系统健康检查</h2>
            <p className={styles.overviewSubtitle}>
              集中监控并诊断系统前后端通信、模块运行等实时健康状态
            </p>
          </div>
        </Space>
      </Card>

      <Card className={styles.healthCard} bordered>
        <Result
          status={status}
          title={statusMessage}
          subTitle={subMessage}
          icon={
            loading ? (
              <SyncOutlined spin style={{ color: "#1677ff" }} />
            ) : undefined
          }
          extra={
            <Button
              type="primary"
              loading={loading}
              onClick={handleCheck}
              size="large"
            >
              {loading ? "正在全面诊断..." : "重新发起诊断"}
            </Button>
          }
        >
          <div className={styles.descBox}>
            <Descriptions
              bordered
              column={{ xxl: 3, xl: 3, lg: 3, md: 1, sm: 1, xs: 1 }}
            >
              <Descriptions.Item label="监控对象">
                <Space>
                  <CloudServerOutlined />
                  <span>User Center Backend</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="拨测路径">
                <Space>
                  <ApiOutlined />
                  <span>GET /health</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="最后更新">
                <Space>
                  <FieldTimeOutlined />
                  <span>{lastCheckTime}</span>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Result>
      </Card>
    </PageContainer>
  );
};

export default Health;

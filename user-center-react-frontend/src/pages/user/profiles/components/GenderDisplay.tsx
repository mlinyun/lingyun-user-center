import { ManOutlined, UserOutlined, WomanOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface GenderDisplayProps {
  gender?: number;
}

const GenderDisplay: React.FC<GenderDisplayProps> = ({ gender }) => {
  if (gender === 0) {
    return (
      <Space>
        <WomanOutlined style={{ color: "#eb2f96" }} />
        <Text>女</Text>
      </Space>
    );
  }
  if (gender === 1) {
    return (
      <Space>
        <ManOutlined style={{ color: "#1890ff" }} />
        <Text>男</Text>
      </Space>
    );
  }
  if (gender === 2) {
    return (
      <Space>
        <UserOutlined style={{ color: "rgb(0 0 0 / 25%)" }} />
        <Text type="secondary">未知</Text>
      </Space>
    );
  }
  return <Text type="secondary">未设置</Text>;
};

export default GenderDisplay;

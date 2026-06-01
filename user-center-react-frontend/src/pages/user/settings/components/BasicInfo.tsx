import { UserOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import { App, Button, Card, Form, Input, Select, Space } from "antd";
import { createStyles } from "antd-style";
import React, { useEffect, useState } from "react";
import { BusinessCode } from "@/constants/code";
import { userUpdateInfo } from "@/services/ant-design-pro/user";
import { authStore } from "@/stores/auth";

const useStyles = createStyles(({ token }) => ({
  cardIcon: {
    fontSize: 16,
    color: token.colorPrimary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
}));

const BasicInfo: React.FC = () => {
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.auth?.user;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { styles } = useStyles();
  const { message } = App.useApp();

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        userName: currentUser.userName || "",
        userGender: currentUser.userGender,
        userProfile: currentUser.userProfile || "",
      });
    }
  }, [currentUser, form]);

  const handleUpdateInfo = async () => {
    if (!currentUser?.id) {
      message.error("用户信息不存在");
      return;
    }
    setSubmitting(true);
    try {
      const values = await form.validateFields();
      const response = await userUpdateInfo({
        id: currentUser.id,
        ...values,
      });
      if (response.code === BusinessCode.SUCCESS && response.success) {
        message.success("基本信息更新成功");
        await authStore.refreshCurrentUser();
      }
    } catch (error) {
      console.error("更新基本信息失败:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card bordered>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <UserOutlined className={styles.cardIcon} />
        <span className={styles.cardTitle}>基本信息</span>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateInfo}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item
          label="昵称"
          name="userName"
          rules={[{ max: 20, message: "昵称长度不超过 20 个字符" }]}
        >
          <Input placeholder="请输入昵称" size="large" allowClear />
        </Form.Item>
        <Form.Item label="性别" name="userGender">
          <Select placeholder="请选择性别" size="large" allowClear>
            <Select.Option value={0}>女</Select.Option>
            <Select.Option value={1}>男</Select.Option>
            <Select.Option value={2}>未知</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="简介"
          name="userProfile"
          rules={[{ max: 200, message: "简介长度不超过 200 个字符" }]}
        >
          <Input.TextArea
            placeholder="介绍一下自己"
            size="large"
            autoSize={{ minRows: 3, maxRows: 5 }}
            allowClear
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={submitting}
        >
          修改基本信息
        </Button>
      </Form>
    </Card>
  );
};

export default BasicInfo;

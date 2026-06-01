import {
  CheckCircleOutlined,
  CodeOutlined,
  MailOutlined,
  MobileOutlined,
  SafetyOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  App,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Progress,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import { createStyles } from "antd-style";
import React, { useEffect, useMemo, useState } from "react";
import { BusinessCode, CODE_REGEX, PHONE_REGEX } from "@/constants";
import { useCaptchaSender } from "@/hooks/useCaptchaSender";
import { userBindEmail, userBindPhone } from "@/services/ant-design-pro/user";
import { authStore } from "@/stores/auth";

const { Text, Title } = Typography;

const useStyles = createStyles(({ token }) => ({
  cardIcon: {
    fontSize: 16,
    color: token.colorPrimary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  securityLevel: {
    marginBottom: 24,
    textAlign: "center",
  },
  securityTitle: {
    marginBottom: "16px !important",
  },
  progressContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  progressScore: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1,
  },
  progressLevel: {
    fontSize: 12,
    color: "var(--ant-color-text-tertiary)" as string,
  },
  securityTips: {
    textAlign: "center",
  },
  securityTipTitle: {
    display: "block",
    marginBottom: 12,
    fontSize: 13,
  },
  securityTipTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  statusLabel: {
    display: "block",
    marginBottom: 12,
    fontSize: 12,
  },
  statusItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 13,
  },
  captchaWrapper: {
    display: "flex",
    gap: 8,
  },
}));

const AccountSecurity: React.FC = () => {
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.auth?.user;
  const [bindEmailForm] = Form.useForm();
  const [bindPhoneForm] = Form.useForm();
  const [submitting, setSubmitting] = useState({
    bindEmailBtn: false,
    bindPhoneBtn: false,
  });
  const { styles } = useStyles();
  const { message } = App.useApp();

  const securityInfo = useMemo(() => {
    let score = 20;
    let levelText = "较低";
    let color = "#ff4d4f";
    const tips: string[] = [];

    if (currentUser?.userEmail && currentUser.emailVerified) {
      score += 20;
    } else {
      tips.push("绑定邮箱可以提升账号安全性");
    }

    if (currentUser?.userPhone && currentUser.phoneVerified) {
      score += 20;
    } else {
      tips.push("绑定手机号可以提升账号安全性");
    }

    if (currentUser?.userAvatar) {
      score += 15;
    } else {
      tips.push("头像还没选好？上传一张专属图片，让个人主页更生动吧");
    }

    if (currentUser?.userProfile) {
      score += 15;
    } else {
      tips.push("个人简介可以让别人更了解你，快来写一句自我介绍吧");
    }

    if (
      currentUser?.userGender !== undefined &&
      currentUser?.userGender !== 2
    ) {
      score += 10;
    } else {
      tips.push("完善性别信息可以让系统更好地为你推荐内容");
    }

    if (score > 100) score = 100;

    if (score > 90) {
      levelText = "极高";
      color = "#52c41a";
    } else if (score >= 70) {
      levelText = "高";
      color = "#6469c4";
    } else if (score > 50) {
      levelText = "中等";
      color = "#b15b8a";
    }

    return { score, levelText, color, tips };
  }, [currentUser]);

  const accountStatus = useMemo(
    () => [
      { label: "邮箱验证", verified: currentUser?.emailVerified },
      { label: "手机验证", verified: currentUser?.phoneVerified },
    ],
    [currentUser],
  );

  // Email captcha sender (BIND_CHANGE scene)
  const emailCaptchaSender = useCaptchaSender(
    "EMAIL",
    "BIND_CHANGE",
    () => bindEmailForm.getFieldValue("userEmail"),
    "请输入邮箱地址以获取验证码",
  );

  // Phone captcha sender (BIND_CHANGE scene)
  const phoneCaptchaSender = useCaptchaSender(
    "SMS",
    "BIND_CHANGE",
    () => bindPhoneForm.getFieldValue("userPhone"),
    "请输入手机号以获取验证码",
  );

  useEffect(() => {
    if (currentUser?.userEmail) {
      bindEmailForm.setFieldsValue({ userEmail: currentUser.userEmail });
    }
    if (currentUser?.userPhone) {
      bindPhoneForm.setFieldsValue({ userPhone: currentUser.userPhone });
    }
  }, [currentUser, bindEmailForm, bindPhoneForm]);

  const handleBindEmail = async () => {
    try {
      const values = await bindEmailForm.validateFields();
      setSubmitting((prev) => ({ ...prev, bindEmailBtn: true }));
      const response = await userBindEmail(values);
      if (response.code === BusinessCode.SUCCESS && response.success) {
        bindEmailForm.setFieldsValue({ captchaCode: "" });
        message.success("邮箱绑定/换绑成功");
        await authStore.refreshCurrentUser();
      }
    } catch (error) {
      console.error("绑定/换绑邮箱失败:", error);
    } finally {
      setSubmitting((prev) => ({ ...prev, bindEmailBtn: false }));
    }
  };

  const handleBindPhone = async () => {
    try {
      const values = await bindPhoneForm.validateFields();
      setSubmitting((prev) => ({ ...prev, bindPhoneBtn: true }));
      const response = await userBindPhone(values);
      if (response.code === BusinessCode.SUCCESS && response.success) {
        bindPhoneForm.setFieldsValue({ captchaCode: "" });
        message.success("手机号绑定/换绑成功");
        await authStore.refreshCurrentUser();
      }
    } catch (error) {
      console.error("绑定/换绑手机号失败:", error);
    } finally {
      setSubmitting((prev) => ({ ...prev, bindPhoneBtn: false }));
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
        <SafetyOutlined className={styles.cardIcon} />
        <span className={styles.cardTitle}>账号安全</span>
      </div>
      <div className={styles.securityLevel}>
        <Title level={5} className={styles.securityTitle}>
          安全等级
        </Title>
        <Progress
          type="circle"
          size={100}
          percent={securityInfo.score}
          strokeColor={securityInfo.color}
          format={() => (
            <div style={{ color: securityInfo.color }}>
              <div className={styles.progressScore}>{securityInfo.score}</div>
              <div className={styles.progressLevel}>
                {securityInfo.levelText}
              </div>
            </div>
          )}
        />
      </div>
      <div className={styles.securityTips}>
        <Text strong className={styles.securityTipTitle}>
          <Space>
            {securityInfo.score >= 80 ? (
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
            ) : (
              <WarningOutlined style={{ color: "#faad14" }} />
            )}
            {securityInfo.score >= 80 ? "账号安全性良好" : "建议完善信息"}
          </Space>
        </Text>
        {securityInfo.tips.length > 0 && (
          <div className={styles.securityTipTags}>
            {securityInfo.tips.map((tip) => (
              <Tag key={tip} color="blue">
                {tip}
              </Tag>
            ))}
          </div>
        )}
      </div>
      <Divider />
      <div>
        <Text type="secondary" className={styles.statusLabel}>
          账号状态
        </Text>
        <Space size={8} direction="vertical" style={{ width: "100%" }}>
          {accountStatus.map((item) => (
            <div key={item.label} className={styles.statusItem}>
              <span>{item.label}</span>
              <Tag color={item.verified ? "success" : "default"}>
                {item.verified ? "已验证" : "未设置"}
              </Tag>
            </div>
          ))}
        </Space>
      </div>
      <Divider />
      <Tabs
        size="small"
        items={[
          {
            key: "email",
            label: "邮箱绑定",
            children: (
              <Form
                form={bindEmailForm}
                layout="vertical"
                onFinish={handleBindEmail}
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Form.Item
                  label="邮箱"
                  name="userEmail"
                  rules={[
                    { required: true, message: "邮箱地址是必填项!" },
                    { type: "email", message: "邮箱格式不正确!" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="请输入邮箱地址"
                    prefix={<MailOutlined />}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  label="验证码"
                  name="captchaCode"
                  rules={[
                    { required: true, message: "验证码是必填项!" },
                    { pattern: CODE_REGEX, message: "验证码格式不正确!" },
                  ]}
                >
                  <div className={styles.captchaWrapper}>
                    <Input
                      size="large"
                      placeholder="请输入验证码"
                      prefix={<CodeOutlined />}
                      allowClear
                      style={{ flex: 1 }}
                    />
                    <Button
                      size="large"
                      disabled={emailCaptchaSender.countdown > 0}
                      loading={emailCaptchaSender.sending}
                      onClick={emailCaptchaSender.send}
                    >
                      {emailCaptchaSender.countdown > 0
                        ? `${emailCaptchaSender.countdown}秒后重试`
                        : "获取验证码"}
                    </Button>
                  </div>
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting.bindEmailBtn}
                >
                  绑定/换绑邮箱
                </Button>
              </Form>
            ),
          },
          {
            key: "phone",
            label: "手机号绑定",
            children: (
              <Form
                form={bindPhoneForm}
                layout="vertical"
                onFinish={handleBindPhone}
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Form.Item
                  label="手机号"
                  name="userPhone"
                  rules={[
                    { required: true, message: "手机号是必填项!" },
                    { pattern: PHONE_REGEX, message: "手机号格式不正确!" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="请输入手机号"
                    prefix={<MobileOutlined />}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  label="验证码"
                  name="captchaCode"
                  rules={[
                    { required: true, message: "验证码是必填项!" },
                    { pattern: CODE_REGEX, message: "验证码格式不正确!" },
                  ]}
                >
                  <div className={styles.captchaWrapper}>
                    <Input
                      size="large"
                      placeholder="请输入验证码"
                      prefix={<CodeOutlined />}
                      allowClear
                      style={{ flex: 1 }}
                    />
                    <Button
                      size="large"
                      disabled={phoneCaptchaSender.countdown > 0}
                      loading={phoneCaptchaSender.sending}
                      onClick={phoneCaptchaSender.send}
                    >
                      {phoneCaptchaSender.countdown > 0
                        ? `${phoneCaptchaSender.countdown}秒后重试`
                        : "获取验证码"}
                    </Button>
                  </div>
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting.bindPhoneBtn}
                >
                  绑定/换绑手机号
                </Button>
              </Form>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default AccountSecurity;

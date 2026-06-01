import {
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Helmet, history } from "@umijs/max";
import { App, Button, Card, Form, Input, Tabs } from "antd";
import { createStyles } from "antd-style";
import React, { useState } from "react";
import { Footer } from "@/components";
import {
  BusinessCode,
  CODE_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PHONE_REGEX,
  PWD_REGEX,
  ROUTES,
  SYSTEM_LOGO,
  SYSTEM_TITLE,
} from "@/constants";
import { useCaptchaSender } from "@/hooks/useCaptchaSender";
import {
  userEmailRegister,
  userPhoneRegister,
  userRegister,
} from "@/services/ant-design-pro/user";
import Settings from "../../../../config/defaultSettings";

const useStyles = createStyles(({ token }) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "auto",
    backgroundImage:
      "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
    backgroundSize: "100% 100%",
  },
  card: {
    minWidth: 430,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  captchaWrapper: {
    display: "flex",
    gap: 8,
  },
  header: {
    textAlign: "center" as const,
    marginBottom: 24,
  },
  logo: {
    height: 44,
    marginRight: 16,
    verticalAlign: "middle",
  },
  title: {
    fontSize: 33,
    color: token.colorTextHeading,
    fontWeight: 600,
  },
}));

const Register: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>("account");
  const [accountForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [phoneForm] = Form.useForm();
  const [submitting, setSubmitting] = useState({
    accountBtn: false,
    emailBtn: false,
    phoneBtn: false,
  });
  const { styles } = useStyles();
  const { message } = App.useApp();

  // Email captcha sender (REGISTER scene)
  const emailCaptchaSender = useCaptchaSender(
    "EMAIL",
    "REGISTER",
    () => emailForm.getFieldValue("userEmail"),
    "请输入邮箱地址以获取验证码",
  );

  // Phone captcha sender (REGISTER scene)
  const phoneCaptchaSender = useCaptchaSender(
    "SMS",
    "REGISTER",
    () => phoneForm.getFieldValue("userPhone"),
    "请输入手机号以获取验证码",
  );

  const handleAccountSubmit = async () => {
    setSubmitting((prev) => ({ ...prev, accountBtn: true }));
    try {
      const values = await accountForm.validateFields();
      const response = await userRegister(values);
      if (response.code === BusinessCode.SUCCESS && response.success) {
        message.success("注册成功！");
        history.push(ROUTES.LOGIN.path);
      }
    } catch (error) {
      console.log("注册异常：", error);
    } finally {
      setSubmitting((prev) => ({ ...prev, accountBtn: false }));
    }
  };

  const handleEmailSubmit = async () => {
    setSubmitting((prev) => ({ ...prev, emailBtn: true }));
    try {
      const values = await emailForm.validateFields();
      const payload = {
        ...values,
        checkPassword: values.userPassword,
      };
      const response = await userEmailRegister(payload);
      if (response.code === BusinessCode.SUCCESS && response.success) {
        message.success("注册成功！");
        history.push(ROUTES.LOGIN.path);
      }
    } catch (error) {
      console.log("注册异常：", error);
    } finally {
      setSubmitting((prev) => ({ ...prev, emailBtn: false }));
    }
  };

  const handlePhoneSubmit = async () => {
    setSubmitting((prev) => ({ ...prev, phoneBtn: true }));
    try {
      const values = await phoneForm.validateFields();
      const payload = {
        ...values,
        checkPassword: values.userPassword,
      };
      const response = await userPhoneRegister(payload);
      if (response.code === BusinessCode.SUCCESS && response.success) {
        message.success("注册成功！");
        history.push(ROUTES.LOGIN.path);
      }
    } catch (error) {
      console.log("注册异常：", error);
    } finally {
      setSubmitting((prev) => ({ ...prev, phoneBtn: false }));
    }
  };

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    accountForm.resetFields();
    emailForm.resetFields();
    phoneForm.resetFields();
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          注册
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <div
        style={{
          flex: "1",
          padding: "32px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={styles.header}>
          <img alt="logo" className={styles.logo} src={SYSTEM_LOGO} />
          <span className={styles.title}>{SYSTEM_TITLE}</span>
        </div>
        <Card
          className={styles.card}
          bordered={false}
          title="注册新账号"
          extra={
            <div style={{ textAlign: "center" }}>
              <span>已有账号？</span>
              <a
                onClick={() => history.push(ROUTES.LOGIN.path)}
                style={{ marginLeft: 8 }}
              >
                立即登录
              </a>
            </div>
          }
        >
          <Tabs
            activeKey={activeKey}
            onChange={handleTabChange}
            centered
            items={[
              { key: "account", label: "账号密码" },
              { key: "email", label: "邮箱注册" },
              { key: "phone", label: "手机号注册" },
            ]}
          />

          {activeKey === "account" && (
            <Form
              form={accountForm}
              onFinish={handleAccountSubmit}
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
            >
              <Form.Item
                name="userAccount"
                rules={[
                  { required: true, message: "登录账号是必填项!" },
                  { min: 4, message: "账号长度不小于 4 位!" },
                  { max: 16, message: "账号长度不大于 16 位!" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="请输入登录账号"
                  prefix={<UserOutlined />}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                name="userPassword"
                rules={[
                  { required: true, message: "登录密码是必填项!" },
                  {
                    min: PASSWORD_MIN_LENGTH,
                    message: `密码长度不小于 ${PASSWORD_MIN_LENGTH} 位!`,
                  },
                  {
                    max: PASSWORD_MAX_LENGTH,
                    message: `密码长度不大于 ${PASSWORD_MAX_LENGTH} 位!`,
                  },
                  {
                    pattern: PWD_REGEX,
                    message: "密码需包含大小写字母、数字和特殊字符",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="请输入登录密码"
                  prefix={<LockOutlined />}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                name="checkPassword"
                dependencies={["userPassword"]}
                rules={[
                  { required: true, message: "请确认登录密码!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("userPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("两次输入的密码不一致!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="请输入确认密码"
                  prefix={<LockOutlined />}
                  allowClear
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting.accountBtn}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          )}

          {activeKey === "email" && (
            <Form
              form={emailForm}
              onFinish={handleEmailSubmit}
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
            >
              <Form.Item
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
                    prefix={<SafetyCertificateOutlined />}
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
              <Form.Item
                name="userPassword"
                rules={[
                  { required: true, message: "登录密码是必填项!" },
                  {
                    min: PASSWORD_MIN_LENGTH,
                    message: `密码长度不小于 ${PASSWORD_MIN_LENGTH} 位!`,
                  },
                  {
                    max: PASSWORD_MAX_LENGTH,
                    message: `密码长度不大于 ${PASSWORD_MAX_LENGTH} 位!`,
                  },
                  {
                    pattern: PWD_REGEX,
                    message: "密码需包含大小写字母、数字和特殊字符",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="请输入登录密码"
                  prefix={<LockOutlined />}
                  allowClear
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting.emailBtn}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          )}

          {activeKey === "phone" && (
            <Form
              form={phoneForm}
              onFinish={handlePhoneSubmit}
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
            >
              <Form.Item
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
                    prefix={<SafetyCertificateOutlined />}
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
              <Form.Item
                name="userPassword"
                rules={[
                  { required: true, message: "登录密码是必填项!" },
                  {
                    min: PASSWORD_MIN_LENGTH,
                    message: `密码长度不小于 ${PASSWORD_MIN_LENGTH} 位!`,
                  },
                  {
                    max: PASSWORD_MAX_LENGTH,
                    message: `密码长度不大于 ${PASSWORD_MAX_LENGTH} 位!`,
                  },
                  {
                    pattern: PWD_REGEX,
                    message: "密码需包含大小写字母、数字和特殊字符",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="请输入登录密码"
                  prefix={<LockOutlined />}
                  allowClear
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting.phoneBtn}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Register;

import {
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  LoginForm,
  ProFormCaptcha,
  ProFormText,
} from "@ant-design/pro-components";
import { Helmet, history } from "@umijs/max";
import { App, Button, Form, Input, Modal, Tabs } from "antd";
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
  SYSTEM_SUBTITLE,
  SYSTEM_TITLE,
} from "@/constants";
import { useCaptchaSender } from "@/hooks/useCaptchaSender";
import { sendCaptcha } from "@/services/ant-design-pro/captcha";
import {
  userEmailLogin,
  userLogin,
  userPhoneLogin,
  userPhoneResetPwd,
  userResetPwd,
} from "@/services/ant-design-pro/user";
import { authStore } from "@/stores/auth";
import { getSafeAuthRedirect } from "@/utils/redirect/auth-redirect";
import Settings from "../../../../config/defaultSettings";

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: "8px",
      color: "rgba(0, 0, 0, 0.2)",
      fontSize: "24px",
      verticalAlign: "middle",
      cursor: "pointer",
      transition: "color 0.3s",
      "&:hover": {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: "42px",
      position: "fixed" as const,
      right: 16,
      borderRadius: token.borderRadius,
      ":hover": {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "auto",
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: "100% 100%",
    },
    captchaWrapper: {
      display: "flex",
      gap: 8,
    },
  };
});

const Login: React.FC = () => {
  const [type, setType] = useState<string>("account");
  const { styles } = useStyles();
  const { message } = App.useApp();

  // Forgot password modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetActiveKey, setResetActiveKey] = useState<string>("email");
  const [emailResetForm] = Form.useForm();
  const [phoneResetForm] = Form.useForm();
  const [resetSubmitting, setResetSubmitting] = useState({
    emailBtn: false,
    phoneBtn: false,
  });

  // Forgot password captcha senders (RESET_PWD scene)
  const emailResetCaptchaSender = useCaptchaSender(
    "EMAIL",
    "RESET_PWD",
    () => emailResetForm.getFieldValue("userEmail"),
    "请输入邮箱地址以获取验证码",
  );

  const phoneResetCaptchaSender = useCaptchaSender(
    "SMS",
    "RESET_PWD",
    () => phoneResetForm.getFieldValue("userPhone"),
    "请输入手机号以获取验证码",
  );

  const handleSubmit = async (
    values:
      | API.UserLoginRequest
      | API.UserEmailLoginRequest
      | API.UserPhoneLoginRequest,
  ) => {
    try {
      let msg = null;
      switch (type) {
        case "account":
          msg = await userLogin({ ...(values as API.UserLoginRequest) });
          break;
        case "email":
          msg = await userEmailLogin({
            ...(values as API.UserEmailLoginRequest),
          });
          break;
        case "phone":
          msg = await userPhoneLogin({
            ...(values as API.UserPhoneLoginRequest),
          });
          break;
        default:
          break;
      }
      if (msg && msg.code === 20000 && msg.success && msg.data) {
        const defaultLoginSuccessMessage = "登录成功！";
        message.success(defaultLoginSuccessMessage);
        authStore.markAuthenticated(msg.data);
        const redirect = new URLSearchParams(window.location.search).get(
          "redirect",
        );
        history.replace(getSafeAuthRedirect(redirect));
        return;
      }
    } catch (error) {
      const defaultLoginFailureMessage = "登录失败，请重试！";
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  const handleEmailResetSubmit = async () => {
    setResetSubmitting((prev) => ({ ...prev, emailBtn: true }));
    try {
      const values = await emailResetForm.validateFields();
      const payload: API.UserEmailResetPwdRequest = {
        userEmail: values.userEmail,
        captchaCode: values.captchaCode,
        newPassword: values.newPassword,
        checkPassword: values.checkPassword,
      };
      const response = await userResetPwd(payload);
      if (response.code === BusinessCode.SUCCESS && response.success) {
        message.success("密码重置成功！请使用新密码登录");
        setShowResetModal(false);
        emailResetForm.resetFields();
      }
    } catch (error) {
      console.log("重置密码异常：", error);
    } finally {
      setResetSubmitting((prev) => ({ ...prev, emailBtn: false }));
    }
  };

  const handlePhoneResetSubmit = async () => {
    setResetSubmitting((prev) => ({ ...prev, phoneBtn: true }));
    try {
      const values = await phoneResetForm.validateFields();
      const payload: API.UserPhoneResetPwdRequest = {
        userPhone: values.userPhone,
        captchaCode: values.captchaCode,
        newPassword: values.newPassword,
        checkPassword: values.checkPassword,
      };
      const response = await userPhoneResetPwd(payload);
      if (response.code === BusinessCode.SUCCESS && response.success) {
        message.success("密码重置成功！请使用新密码登录");
        setShowResetModal(false);
        phoneResetForm.resetFields();
      }
    } catch (error) {
      console.log("重置密码异常：", error);
    } finally {
      setResetSubmitting((prev) => ({ ...prev, phoneBtn: false }));
    }
  };

  const handleResetModalCancel = () => {
    setShowResetModal(false);
    emailResetForm.resetFields();
    phoneResetForm.resetFields();
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          登录
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <div
        style={{
          flex: "1",
          padding: "32px 0",
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: "75vw",
          }}
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title={SYSTEM_TITLE}
          subTitle={SYSTEM_SUBTITLE}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              { key: "account", label: "账户密码登录" },
              { key: "email", label: "邮箱登录" },
              { key: "mobile", label: "手机号登录" },
            ]}
          />

          {type === "account" && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined />,
                }}
                placeholder={"请输入登录账号"}
                rules={[
                  { required: true, message: "用户名是必填项！" },
                  { min: 4, type: "string", message: "账号长度不小于 4 位！" },
                  {
                    max: 16,
                    type: "string",
                    message: "账号长度不大于 16 位！",
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined />,
                }}
                placeholder={"请输入登录密码"}
                rules={[
                  { required: true, message: "密码是必填项！" },
                  {
                    min: 8,
                    type: "string",
                    message: "登录密码长度不小于 8 位！",
                  },
                  {
                    max: 20,
                    type: "string",
                    message: "登录密码长度不大于 20 位!",
                  },
                ]}
              />
            </>
          )}

          {type === "email" && (
            <>
              <ProFormText
                fieldProps={{
                  size: "large",
                  prefix: <MailOutlined />,
                }}
                name="userEmail"
                placeholder={"请输入邮箱"}
                rules={[
                  { required: true, message: "邮箱是必填项！" },
                  { type: "email", message: "不合法的邮箱！" },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: "large",
                  prefix: <SafetyCertificateOutlined />,
                }}
                captchaProps={{ size: "large" }}
                placeholder={"请输入验证码"}
                captchaTextRender={(timing, count) => {
                  if (timing) return `${count} 秒后重新获取`;
                  return "获取验证码";
                }}
                name="captchaCode"
                phoneName="userEmail"
                rules={[
                  { required: true, message: "验证码是必填项！" },
                  { pattern: /^\d{6}$/, message: "验证码格式不正确" },
                ]}
                onGetCaptcha={async (email) => {
                  const result = await sendCaptcha({
                    type: "EMAIL",
                    scene: "LOGIN",
                    target: email,
                  });
                  if (result.code === 20000 && result.success) {
                    message.success("获取验证码成功！");
                  }
                }}
              />
            </>
          )}

          {type === "mobile" && (
            <>
              <ProFormText
                fieldProps={{
                  size: "large",
                  prefix: <MobileOutlined />,
                }}
                name="userPhone"
                placeholder={"请输入手机号"}
                rules={[
                  { required: true, message: "手机号是必填项！" },
                  { pattern: /^1[3-9]\d{9}$/, message: "不合法的手机号！" },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: "large",
                  prefix: <SafetyCertificateOutlined />,
                }}
                captchaProps={{ size: "large" }}
                placeholder={"请输入验证码"}
                captchaTextRender={(timing, count) => {
                  if (timing) return `${count} 秒后重新获取`;
                  return "获取验证码";
                }}
                name="captchaCode"
                phoneName="userPhone"
                rules={[
                  { required: true, message: "验证码是必填项！" },
                  { pattern: /^\d{6}$/, message: "验证码格式不正确" },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await sendCaptcha({
                    type: "SMS",
                    scene: "LOGIN",
                    target: phone,
                  });
                  if (result.code === 20000 && result.success) {
                    message.success("获取验证码成功！");
                  }
                }}
              />
            </>
          )}
          <div style={{ marginBottom: 24 }}>
            <a
              onClick={(e) => {
                e.preventDefault();
                history.push(ROUTES.REGISTER.path);
              }}
            >
              去注册
            </a>
            <a
              style={{ float: "right" }}
              onClick={(e) => {
                e.preventDefault();
                setShowResetModal(true);
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />

      {/* Forgot Password Modal */}
      <Modal
        open={showResetModal}
        title="重置密码"
        onCancel={handleResetModalCancel}
        destroyOnClose
        footer={null}
        width={520}
      >
        <Tabs
          activeKey={resetActiveKey}
          onChange={setResetActiveKey}
          centered
          items={[
            { key: "email", label: "邮箱重置" },
            { key: "phone", label: "手机号重置" },
          ]}
        />

        {resetActiveKey === "email" && (
          <Form
            form={emailResetForm}
            onFinish={handleEmailResetSubmit}
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
                  disabled={emailResetCaptchaSender.countdown > 0}
                  loading={emailResetCaptchaSender.sending}
                  onClick={emailResetCaptchaSender.send}
                >
                  {emailResetCaptchaSender.countdown > 0
                    ? `${emailResetCaptchaSender.countdown}秒后重试`
                    : "获取验证码"}
                </Button>
              </div>
            </Form.Item>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: "新密码是必填项!" },
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
                placeholder="请输入新密码"
                prefix={<LockOutlined />}
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="checkPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "请确认新密码!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致!"));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="确认新密码"
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
                loading={resetSubmitting.emailBtn}
              >
                确定
              </Button>
            </Form.Item>
          </Form>
        )}

        {resetActiveKey === "phone" && (
          <Form
            form={phoneResetForm}
            onFinish={handlePhoneResetSubmit}
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
                  disabled={phoneResetCaptchaSender.countdown > 0}
                  loading={phoneResetCaptchaSender.sending}
                  onClick={phoneResetCaptchaSender.send}
                >
                  {phoneResetCaptchaSender.countdown > 0
                    ? `${phoneResetCaptchaSender.countdown}秒后重试`
                    : "获取验证码"}
                </Button>
              </div>
            </Form.Item>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: "新密码是必填项!" },
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
                placeholder="请输入新密码"
                prefix={<LockOutlined />}
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="checkPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "请确认新密码!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致!"));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="确认新密码"
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
                loading={resetSubmitting.phoneBtn}
              >
                确定
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Login;

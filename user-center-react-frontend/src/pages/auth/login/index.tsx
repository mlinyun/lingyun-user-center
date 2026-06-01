import {
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  LoginForm,
  ProFormCaptcha,
  ProFormText,
} from "@ant-design/pro-components";
import { Helmet, useModel } from "@umijs/max";
import { App, Tabs } from "antd";
import { createStyles } from "antd-style";
import React, { startTransition, useState } from "react";
import { Footer } from "@/components";
import { SYSTEM_LOGO, SYSTEM_SUBTITLE, SYSTEM_TITLE } from "@/constants";
import { sendCaptcha } from "@/services/ant-design-pro/captcha";
import {
  userEmailLogin,
  userLogin,
  userPhoneLogin,
} from "@/services/ant-design-pro/user";
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
      position: "fixed",
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
  };
});

const Login: React.FC = () => {
  const [type, setType] = useState<string>("account");
  const { initialState, setInitialState } = useModel("@@initialState");
  const { styles } = useStyles();
  const { message } = App.useApp();

  /**
   * Validate redirect URL to prevent open redirect attacks
   * Only allow same-origin relative paths starting with '/'
   */
  const getSafeRedirectUrl = (redirect: string | null): string => {
    if (!redirect?.startsWith("/")) return "/";

    // Block protocol-relative URLs (//example.com)
    if (redirect.startsWith("//")) return "/";

    try {
      const parsed = new URL(redirect, window.location.origin);
      // Only allow same-origin URLs
      if (parsed.origin !== window.location.origin) return "/";
      // Return the path with query and hash preserved
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return "/";
    }
  };

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      startTransition(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (
    values:
      | API.UserLoginRequest
      | API.UserEmailLoginRequest
      | API.UserPhoneLoginRequest,
  ) => {
    try {
      // 登录
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
      if (msg && msg.code === 20000 && msg.success) {
        const defaultLoginSuccessMessage = "登录成功！";
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = getSafeRedirectUrl(urlParams.get("redirect"));
        return;
      }
    } catch (error) {
      const defaultLoginFailureMessage = "登录失败，请重试！";
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
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
              {
                key: "account",
                label: "账户密码登录",
              },
              {
                key: "email",
                label: "邮箱登录",
              },
              {
                key: "mobile",
                label: "手机号登录",
              },
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
                  {
                    required: true,
                    message: "用户名是必填项！",
                  },
                  {
                    min: 4,
                    type: "string",
                    message: "账号长度不小于 4 位！",
                  },
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
                  {
                    required: true,
                    message: "密码是必填项！",
                  },
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
                  {
                    required: true,
                    message: "邮箱是必填项！",
                  },
                  {
                    type: "email",
                    message: "不合法的邮箱！",
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: "large",
                }}
                placeholder={"请输入验证码"}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${"秒后重新获取"}`;
                  }
                  return "获取验证码";
                }}
                name="captchaCode"
                rules={[
                  {
                    required: true,
                    message: "验证码是必填项！",
                  },
                  {
                    pattern: /^\d{6}$/,
                    message: "验证码格式不正确",
                  },
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
                  {
                    required: true,
                    message: "手机号是必填项！",
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: "不合法的手机号！",
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: "large",
                }}
                placeholder={"请输入验证码"}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${"秒后重新获取"}`;
                  }
                  return "获取验证码";
                }}
                name="captchaCode"
                rules={[
                  {
                    required: true,
                    message: "验证码是必填项！",
                  },
                  {
                    pattern: /^\d{6}$/,
                    message: "验证码格式不正确",
                  },
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
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <a
              href="#"
              style={{
                float: "right",
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

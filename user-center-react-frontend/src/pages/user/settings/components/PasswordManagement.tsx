import {
  CodeOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useModel } from "@umijs/max";
import { Alert, App, Button, Card, Form, Input, Tabs } from "antd";
import { createStyles } from "antd-style";
import React, { useEffect, useState } from "react";
import {
  BusinessCode,
  CODE_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PHONE_REGEX,
  PWD_REGEX,
} from "@/constants";
import { useCaptchaSender } from "@/hooks/useCaptchaSender";
import {
  userPhoneResetPwd,
  userResetPwd,
  userUpdatePwd,
} from "@/services/ant-design-pro/user";
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
  pwdAlert: {
    marginBottom: 16,
  },
  captchaWrapper: {
    display: "flex",
    gap: 8,
  },
}));

const PasswordManagement: React.FC = () => {
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.auth?.user;
  const [updatePwdForm] = Form.useForm();
  const [resetEmailForm] = Form.useForm();
  const [resetPhoneForm] = Form.useForm();
  const [submitting, setSubmitting] = useState({
    updatePwdBtn: false,
    resetEmailBtn: false,
    resetPhoneBtn: false,
  });
  const { styles } = useStyles();
  const { message } = App.useApp();

  const passwordRules = [
    { required: true, message: "密码是必填项!" },
    {
      min: PASSWORD_MIN_LENGTH,
      message: `密码长度不小于 ${PASSWORD_MIN_LENGTH} 位!`,
    },
    {
      max: PASSWORD_MAX_LENGTH,
      message: `密码长度不大于 ${PASSWORD_MAX_LENGTH} 位!`,
    },
    { pattern: PWD_REGEX, message: "密码需包含大小写字母、数字和特殊字符" },
  ];

  // Email captcha sender (RESET_PWD scene)
  const emailCaptchaSender = useCaptchaSender(
    "EMAIL",
    "RESET_PWD",
    () => resetEmailForm.getFieldValue("userEmail"),
    "请输入邮箱地址以获取验证码",
  );

  // Phone captcha sender (RESET_PWD scene)
  const phoneCaptchaSender = useCaptchaSender(
    "SMS",
    "RESET_PWD",
    () => resetPhoneForm.getFieldValue("userPhone"),
    "请输入手机号以获取验证码",
  );

  useEffect(() => {
    if (currentUser) {
      updatePwdForm.setFieldsValue({ id: currentUser.id });
      if (currentUser.userEmail) {
        resetEmailForm.setFieldsValue({
          userEmail: currentUser.userEmail,
        });
      }
      if (currentUser.userPhone) {
        resetPhoneForm.setFieldsValue({
          userPhone: currentUser.userPhone,
        });
      }
    }
  }, [currentUser, updatePwdForm, resetEmailForm, resetPhoneForm]);

  const handleUpdatePwd = async () => {
    if (!currentUser?.id) {
      message.error("用户信息不存在！");
      return;
    }
    try {
      await updatePwdForm.validateFields();
    } catch {
      message.error("请修正表单中的错误后再提交");
      return;
    }
    setSubmitting((prev) => ({ ...prev, updatePwdBtn: true }));
    try {
      const values = updatePwdForm.getFieldsValue();
      const response = await userUpdatePwd({
        ...values,
        id: currentUser.id,
      });
      if (response.code === BusinessCode.SUCCESS && response.success) {
        message.success("密码修改成功");
        updatePwdForm.resetFields();
        await authStore.refreshCurrentUser();
      }
    } catch (error) {
      console.log("原密码修改失败！", error);
    } finally {
      setSubmitting((prev) => ({ ...prev, updatePwdBtn: false }));
    }
  };

  const handleResetPwdByEmail = async () => {
    try {
      await resetEmailForm.validateFields();
    } catch {
      message.error("请修正表单中的错误后再提交");
      return;
    }
    setSubmitting((prev) => ({ ...prev, resetEmailBtn: true }));
    try {
      const values = resetEmailForm.getFieldsValue();
      const response = await userResetPwd(values);
      if (response.code === BusinessCode.SUCCESS && response.success) {
        message.success("密码重置成功");
        resetEmailForm.setFieldsValue({
          captchaCode: "",
          newPassword: "",
          checkPassword: "",
        });
        await authStore.refreshCurrentUser();
      }
    } catch (error) {
      console.log("邮箱重置密码失败！", error);
    } finally {
      setSubmitting((prev) => ({ ...prev, resetEmailBtn: false }));
    }
  };

  const handleResetPwdByPhone = async () => {
    try {
      await resetPhoneForm.validateFields();
    } catch {
      message.error("请修正表单中的错误后再提交");
      return;
    }
    setSubmitting((prev) => ({ ...prev, resetPhoneBtn: true }));
    try {
      const values = resetPhoneForm.getFieldsValue();
      const response = await userPhoneResetPwd(values);
      if (response.code === BusinessCode.SUCCESS && response.success) {
        message.success("密码重置成功");
        resetPhoneForm.setFieldsValue({
          captchaCode: "",
          newPassword: "",
          checkPassword: "",
        });
        await authStore.refreshCurrentUser();
      }
    } catch (error) {
      console.log("手机号重置密码失败！", error);
    } finally {
      setSubmitting((prev) => ({ ...prev, resetPhoneBtn: false }));
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
        <LockOutlined className={styles.cardIcon} />
        <span className={styles.cardTitle}>密码管理</span>
      </div>
      <Alert
        message="密码安全建议"
        description="密码需 8-20 位且包含大小写字母、数字和特殊字符，建议定期更换密码以保障账号安全。"
        type="info"
        showIcon
        icon={<SafetyOutlined />}
        className={styles.pwdAlert}
      />
      <Tabs
        size="small"
        items={[
          {
            key: "raw",
            label: "原密码修改",
            children: (
              <Form
                form={updatePwdForm}
                layout="vertical"
                onFinish={handleUpdatePwd}
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Form.Item
                  label="当前密码"
                  name="rawPassword"
                  rules={passwordRules}
                >
                  <Input.Password
                    size="large"
                    placeholder="请输入当前密码"
                    prefix={<LockOutlined />}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  label="新密码"
                  name="newPassword"
                  rules={passwordRules}
                >
                  <Input.Password
                    size="large"
                    placeholder="请输入新密码"
                    prefix={<LockOutlined />}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  label="确认新密码"
                  name="checkPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "请确认新密码" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("两次输入的密码不一致"),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="请再次输入新密码"
                    prefix={<LockOutlined />}
                    allowClear
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting.updatePwdBtn}
                >
                  更新密码
                </Button>
              </Form>
            ),
          },
          {
            key: "email",
            label: "邮箱重置",
            children: (
              <Form
                form={resetEmailForm}
                layout="vertical"
                onFinish={handleResetPwdByEmail}
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
                <Form.Item
                  label="新密码"
                  name="newPassword"
                  rules={passwordRules}
                >
                  <Input.Password
                    size="large"
                    placeholder="请输入新密码"
                    prefix={<LockOutlined />}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  label="确认新密码"
                  name="checkPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "请确认新密码" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("两次输入的密码不一致"),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="请再次输入新密码"
                    prefix={<LockOutlined />}
                    allowClear
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting.resetEmailBtn}
                >
                  通过邮箱重置密码
                </Button>
              </Form>
            ),
          },
          {
            key: "phone",
            label: "手机号重置",
            children: (
              <Form
                form={resetPhoneForm}
                layout="vertical"
                onFinish={handleResetPwdByPhone}
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
                <Form.Item
                  label="新密码"
                  name="newPassword"
                  rules={passwordRules}
                >
                  <Input.Password
                    size="large"
                    placeholder="请输入新密码"
                    prefix={<LockOutlined />}
                    allowClear
                  />
                </Form.Item>
                <Form.Item
                  label="确认新密码"
                  name="checkPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "请确认新密码" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("两次输入的密码不一致"),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="请再次输入新密码"
                    prefix={<LockOutlined />}
                    allowClear
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting.resetPhoneBtn}
                >
                  通过手机号重置密码
                </Button>
              </Form>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default PasswordManagement;

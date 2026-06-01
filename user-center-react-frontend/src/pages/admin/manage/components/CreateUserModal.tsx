import { Form, Input, Modal, Progress, Radio, Select } from "antd";
import React, { useState } from "react";
import { USER_GENDER, USER_ROLE } from "@/constants/user";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PWD_REGEX,
} from "@/constants/validation";
import { useUserOperations } from "@/hooks/useUserOperations";

interface CreateUserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) score += 25;
  if (password.length >= PASSWORD_MIN_LENGTH + 2) score += 10;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[^a-zA-Z\d]/.test(password)) score += 20;
  return Math.min(100, score);
};

const getStrengthColor = (score: number): string => {
  if (score >= 80) return "#52c41a";
  if (score >= 60) return "#1890ff";
  if (score >= 40) return "#faad14";
  return "#ff4d4f";
};

const getStrengthText = (score: number): string => {
  if (score >= 80) return "强";
  if (score >= 60) return "中";
  if (score >= 40) return "弱";
  return "很弱";
};

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { submitting, handleAdminAddUser } = useUserOperations();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const success = await handleAdminAddUser(values);
      if (success) {
        form.resetFields();
        setPasswordStrength(0);
        onSuccess();
      }
    } catch {
      // Form validation error handled by antd
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPasswordStrength(0);
    onCancel();
  };

  return (
    <Modal
      title="新建用户"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={submitting}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          label="登录账号"
          name="userAccount"
          rules={[
            { required: true, message: "登录账号是必填项!" },
            { min: 4, message: "账号长度不小于 4 位!" },
            { max: 16, message: "账号长度不大于 16 位!" },
          ]}
        >
          <Input placeholder="请输入登录账号" allowClear />
        </Form.Item>
        <Form.Item
          label="登录密码"
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
            placeholder="请输入登录密码"
            allowClear
            onChange={(e) =>
              setPasswordStrength(getPasswordStrength(e.target.value))
            }
          />
        </Form.Item>
        {passwordStrength > 0 && (
          <div style={{ marginTop: -16, marginBottom: 16 }}>
            <Progress
              percent={passwordStrength}
              strokeColor={getStrengthColor(passwordStrength)}
              size="small"
              format={() => getStrengthText(passwordStrength)}
            />
          </div>
        )}
        <Form.Item
          label="确认密码"
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
          <Input.Password placeholder="请再次输入密码" allowClear />
        </Form.Item>
        <Form.Item label="用户角色" name="userRole" initialValue="user">
          <Select>
            <Select.Option value={USER_ROLE.USER}>普通用户</Select.Option>
            <Select.Option value={USER_ROLE.ADMIN}>管理员</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="性别" name="userGender">
          <Radio.Group>
            <Radio value={USER_GENDER.FEMALE}>女</Radio>
            <Radio value={USER_GENDER.MALE}>男</Radio>
            <Radio value={USER_GENDER.UNKNOWN}>未知</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="手机号"
          name="userPhone"
          rules={[
            {
              pattern: /^1[3-9]\d{9}$/,
              message: "手机号格式不正确!",
            },
          ]}
        >
          <Input placeholder="请输入手机号" allowClear />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="userEmail"
          rules={[{ type: "email", message: "邮箱格式不正确!" }]}
        >
          <Input placeholder="请输入邮箱" allowClear />
        </Form.Item>
        <Form.Item
          label="个人简介"
          name="userProfile"
          rules={[{ max: 200, message: "简介长度不超过 200 个字符" }]}
        >
          <Input.TextArea
            placeholder="请输入个人简介"
            autoSize={{ minRows: 2, maxRows: 4 }}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;

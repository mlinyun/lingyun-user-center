import { Form, Input, Modal, Typography } from "antd";
import React, { useEffect } from "react";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PWD_REGEX,
} from "@/constants/validation";
import { useUserOperations } from "@/hooks/useUserOperations";

const { Text } = Typography;

interface ResetPasswordModalProps {
  open: boolean;
  user?: API.UserVo;
  onCancel: () => void;
  onSuccess: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  user,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { submitting, handleAdminResetUserPwd } = useUserOperations();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    if (!user?.id) return;
    try {
      const values = await form.validateFields();
      const success = await handleAdminResetUserPwd({
        id: user.id,
        newPassword: values.newPassword,
      });
      if (success) {
        onSuccess();
      }
    } catch {
      // Form validation error
    }
  };

  return (
    <Modal
      title="重置用户密码"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={submitting}
      destroyOnClose
    >
      <div style={{ marginBottom: 16, marginTop: 16 }}>
        <Text>
          正在为用户
          <Text strong>{user?.userName || user?.userAccount || "-"}</Text>
          重置密码
        </Text>
      </div>
      <Form form={form} layout="vertical">
        <Form.Item
          label="新密码"
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
          <Input.Password placeholder="请输入新密码" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;

import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Form, Input, Modal, Select, Typography, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { DEFAULT_AVATAR } from "@/constants";
import { USER_ROLE } from "@/constants/user";
import { useUserOperations } from "@/hooks/useUserOperations";

const { Text } = Typography;

interface EditUserModalProps {
  open: boolean;
  user?: API.UserVo;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  user,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const {
    submitting,
    uploading,
    handleAdminUpdateUserInfo,
    handleAvatarUpload,
  } = useUserOperations();
  const [avatarUrl, setAvatarUrl] = useState<string>(
    user?.userAvatar || DEFAULT_AVATAR,
  );

  useEffect(() => {
    if (user && open) {
      form.setFieldsValue({
        userName: user.userName || "",
        userRole: user.userRole || USER_ROLE.USER,
        userProfile: user.userProfile || "",
      });
      setAvatarUrl(user.userAvatar || DEFAULT_AVATAR);
    }
  }, [user, open, form]);

  const handleSubmit = async () => {
    if (!user?.id) return;
    try {
      const values = await form.validateFields();
      const success = await handleAdminUpdateUserInfo({
        id: user.id,
        userName: values.userName,
        userRole: values.userRole,
        userProfile: values.userProfile,
        userAvatar: avatarUrl,
      });
      if (success) {
        onSuccess();
      }
    } catch {
      // Form validation error
    }
  };

  const beforeUpload: UploadProps["beforeUpload"] = async (file) => {
    if (!user?.id) return false;
    const result = await handleAvatarUpload(file, user.id);
    if (result) {
      setAvatarUrl(result);
    }
    return false; // Prevent default upload behavior
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="编辑用户信息"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={submitting}
      destroyOnClose
      width={560}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item label="头像">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 8,
            }}
          >
            <img
              src={avatarUrl}
              alt="avatar"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <Upload
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept="image/*"
              disabled={uploading}
            >
              <a>
                <UploadOutlined /> {uploading ? "上传中..." : "更换头像"}
              </a>
            </Upload>
          </div>
        </Form.Item>
        <Form.Item
          label="用户昵称"
          name="userName"
          rules={[{ max: 20, message: "昵称长度不超过 20 个字符" }]}
        >
          <Input placeholder="请输入昵称" allowClear />
        </Form.Item>
        <Form.Item label="用户角色" name="userRole">
          <Select>
            <Select.Option value={USER_ROLE.USER}>普通用户</Select.Option>
            <Select.Option value={USER_ROLE.ADMIN}>管理员</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="手机号">
          <Input value={user?.userPhone || ""} disabled placeholder="未设置" />
          <Text type="secondary" style={{ fontSize: 12 }}>
            手机号不支持在编辑页面修改
          </Text>
        </Form.Item>
        <Form.Item label="邮箱">
          <Input value={user?.userEmail || ""} disabled placeholder="未设置" />
          <Text type="secondary" style={{ fontSize: 12 }}>
            邮箱不支持在编辑页面修改
          </Text>
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

export default EditUserModal;

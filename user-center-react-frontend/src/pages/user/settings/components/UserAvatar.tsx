import { PictureOutlined, UserOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import type { UploadProps } from "antd";
import { Avatar, Card, Typography, Upload } from "antd";
import { createStyles } from "antd-style";
import React from "react";
import { DEFAULT_AVATAR } from "@/constants";
import { useUserOperations } from "@/hooks/useUserOperations";
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
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 24px",
    textAlign: "center",
  },
  avatarMeta: {
    margin: "20px 0",
  },
  avatarName: {
    marginBottom: "8px !important",
  },
  avatarAccount: {
    fontSize: 14,
  },
  avatarUploadBtn: {
    display: "inline-block",
    padding: "10px 32px",
    color: "#fff",
    textDecoration: "none",
    cursor: "pointer",
    background: token.colorPrimary,
    borderRadius: 8,
    transition: "all 0.3s",
    "&:hover": {
      color: "#fff",
      boxShadow: "0 6px 16px rgb(24 144 255 / 30%)",
      transform: "translateY(-2px)",
    },
  },
  avatarTip: {
    display: "block",
    marginTop: 16,
    fontSize: 12,
  },
}));

const UserAvatar: React.FC = () => {
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.auth?.user;
  const { uploading, handleAvatarUpload } = useUserOperations();
  const { styles } = useStyles();

  const beforeUpload: UploadProps["beforeUpload"] = async (file) => {
    if (!file) return false;
    try {
      const avatarUploadResult = await handleAvatarUpload(file);
      if (avatarUploadResult) {
        await authStore.refreshCurrentUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error("头像上传失败:", error);
      return false;
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
        <PictureOutlined className={styles.cardIcon} />
        <span className={styles.cardTitle}>用户头像</span>
      </div>
      <div className={styles.avatarSection}>
        <Avatar
          size={120}
          src={currentUser?.userAvatar || DEFAULT_AVATAR}
          icon={<UserOutlined />}
        />
        <div className={styles.avatarMeta}>
          <Title level={4} className={styles.avatarName}>
            {currentUser?.userName || "未设置昵称"}
          </Title>
          <Text type="secondary" className={styles.avatarAccount}>
            @{currentUser?.userAccount || ""}
          </Text>
        </div>
        <Upload
          beforeUpload={beforeUpload}
          disabled={uploading}
          showUploadList={false}
          accept="image/*"
        >
          <a className={styles.avatarUploadBtn}>
            {uploading ? "上传中..." : "更换头像"}
          </a>
        </Upload>
        <Text type="secondary" className={styles.avatarTip}>
          支持 JPG、JPEG、PNG、GIF 格式
          <br />
          大小不超过 2MB
        </Text>
      </div>
    </Card>
  );
};

export default UserAvatar;

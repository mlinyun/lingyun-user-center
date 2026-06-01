import { Descriptions, Drawer, Image, Spin, Tag } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { DEFAULT_AVATAR } from "@/constants";
import { USER_ROLE, USER_STATUS } from "@/constants/user";
import { useUserOperations } from "@/hooks/useUserOperations";
import GenderDisplay from "@/pages/user/profiles/components/GenderDisplay";

interface ViewUserDrawerProps {
  open: boolean;
  user?: API.UserVo;
  onClose: () => void;
}

const ViewUserDrawer: React.FC<ViewUserDrawerProps> = ({
  open,
  user,
  onClose,
}) => {
  const { handleAdminGetUserById } = useUserOperations();
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState<API.UserVo | undefined>(user);

  useEffect(() => {
    if (open && user?.id) {
      setLoading(true);
      handleAdminGetUserById(user.id)
        .then((data) => {
          if (data) setUserDetail(data);
        })
        .finally(() => setLoading(false));
    } else {
      setUserDetail(user);
    }
  }, [open, user?.id]);

  const detail = userDetail || user;

  return (
    <Drawer
      title="用户详情"
      open={open}
      onClose={onClose}
      width={600}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Image
            src={detail?.userAvatar || DEFAULT_AVATAR}
            alt="avatar"
            width={100}
            height={100}
            style={{ borderRadius: "50%", objectFit: "cover" }}
            fallback={DEFAULT_AVATAR}
          />
        </div>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="用户 ID">
            {detail?.id || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="登录账号">
            {detail?.userAccount || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="用户昵称">
            {detail?.userName || "未设置"}
          </Descriptions.Item>
          <Descriptions.Item label="用户角色">
            <Tag color={detail?.userRole === USER_ROLE.ADMIN ? "gold" : "blue"}>
              {detail?.userRole === USER_ROLE.ADMIN ? "管理员" : "普通用户"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="账号状态">
            <Tag
              color={
                detail?.userStatus === USER_STATUS.NORMAL ? "success" : "error"
              }
            >
              {detail?.userStatus === USER_STATUS.NORMAL ? "正常" : "封禁"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="性别">
            <GenderDisplay gender={detail?.userGender} />
          </Descriptions.Item>
          <Descriptions.Item label="手机号">
            {detail?.userPhone || "未设置"}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {detail?.userEmail || "未设置"}
          </Descriptions.Item>
          <Descriptions.Item label="个人简介">
            {detail?.userProfile || "未设置"}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {detail?.createTime
              ? dayjs(detail.createTime).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {detail?.updateTime
              ? dayjs(detail.updateTime).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </Drawer>
  );
};

export default ViewUserDrawer;

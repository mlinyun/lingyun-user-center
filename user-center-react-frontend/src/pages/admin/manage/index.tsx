import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  KeyOutlined,
  LockOutlined,
  PlusOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { App, Button, Dropdown, Modal, Tag } from "antd";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { USER_ROLE, USER_STATUS } from "@/constants/user";
import { useUserOperations } from "@/hooks/useUserOperations";
import { authStore } from "@/stores/auth";
import CreateUserModal from "./components/CreateUserModal";
import EditUserModal from "./components/EditUserModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import ViewUserDrawer from "./components/ViewUserDrawer";

const UserManage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined);
  const { message, modal } = App.useApp();
  const {
    handleAdminGetUserInfoByPage,
    handleAdminDeleteUser,
    handleAdminBanOrUnbanUser,
  } = useUserOperations();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resetPwdModalOpen, setResetPwdModalOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<API.UserVo | undefined>();

  const columns: ProColumns<API.UserVo>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "头像",
      dataIndex: "userAvatar",
      search: false,
      render: (_, record) => (
        <img
          src={record.userAvatar}
          alt="avatar"
          style={{ width: 32, height: 32, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "登录账号",
      dataIndex: "userAccount",
    },
    {
      title: "用户昵称",
      dataIndex: "userName",
    },
    {
      title: "用户角色",
      dataIndex: "userRole",
      valueType: "select",
      valueEnum: {
        user: { text: "普通用户", status: "Default" },
        admin: { text: "管理员", status: "Processing" },
      },
      render: (_, record) => (
        <Tag color={record.userRole === USER_ROLE.ADMIN ? "gold" : "blue"}>
          {record.userRole === USER_ROLE.ADMIN ? "管理员" : "普通用户"}
        </Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "userStatus",
      valueType: "select",
      valueEnum: {
        [USER_STATUS.NORMAL]: { text: "正常", status: "Success" },
        [USER_STATUS.BANNED]: { text: "封禁", status: "Error" },
      },
      render: (_, record) => (
        <Tag
          color={record.userStatus === USER_STATUS.NORMAL ? "success" : "error"}
        >
          {record.userStatus === USER_STATUS.NORMAL ? "正常" : "封禁"}
        </Tag>
      ),
    },
    {
      title: "性别",
      dataIndex: "userGender",
      valueType: "select",
      valueEnum: {
        0: { text: "女" },
        1: { text: "男" },
        2: { text: "未知" },
      },
      search: false,
    },
    {
      title: "手机号",
      dataIndex: "userPhone",
      search: true,
    },
    {
      title: "邮箱",
      dataIndex: "userEmail",
      search: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "dateRange",
      search: {
        transform: (value: any) => ({
          createTimeStart: value?.[0],
          createTimeEnd: value?.[1],
        }),
      },
      render: (_, record) =>
        record.createTime
          ? dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss")
          : "-",
    },
    {
      title: "操作",
      valueType: "option",
      width: 200,
      render: (_, record) => {
        const isBanned = record.userStatus === USER_STATUS.BANNED;
        const isAdmin =
          record.userRole === USER_ROLE.ADMIN &&
          record.id !== authStore.getState().user?.id;
        return (
          <>
            <a
              onClick={() => {
                setSelectedUser(record);
                setViewDrawerOpen(true);
              }}
            >
              <EyeOutlined /> 查看
            </a>
            <a
              style={{ marginLeft: 8 }}
              onClick={() => {
                setSelectedUser(record);
                setEditModalOpen(true);
              }}
            >
              <EditOutlined /> 编辑
            </a>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "resetPwd",
                    icon: <KeyOutlined />,
                    label: "重置密码",
                    onClick: () => {
                      setSelectedUser(record);
                      setResetPwdModalOpen(true);
                    },
                  },
                  {
                    key: "ban",
                    icon: isBanned ? <UserOutlined /> : <StopOutlined />,
                    label: isBanned ? "解封用户" : "封禁用户",
                    disabled: isAdmin,
                    onClick: async () => {
                      const success = await handleAdminBanOrUnbanUser({
                        id: record.id!,
                        userStatus: isBanned
                          ? USER_STATUS.NORMAL
                          : USER_STATUS.BANNED,
                      });
                      if (success) {
                        message.success(isBanned ? "解封成功" : "封禁成功");
                        actionRef.current?.reload();
                      }
                    },
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "delete",
                    icon: <DeleteOutlined />,
                    label: "删除用户",
                    danger: true,
                    disabled: isAdmin,
                    onClick: () => {
                      modal.confirm({
                        title: "确认删除",
                        content: `确定要删除用户 "${record.userName || record.userAccount}" 吗？此操作不可撤销。`,
                        okText: "确认删除",
                        okType: "danger",
                        cancelText: "取消",
                        onOk: async () => {
                          const success = await handleAdminDeleteUser(
                            record.id!,
                          );
                          if (success) {
                            message.success("删除成功");
                            actionRef.current?.reload();
                          }
                        },
                      });
                    },
                  },
                ],
              }}
            >
              <a style={{ marginLeft: 8 }}>更多 ▼</a>
            </Dropdown>
          </>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserVo, API.AdminQueryUserRequest>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => setCreateModalOpen(true)}
          >
            <PlusOutlined />
            新建用户
          </Button>,
        ]}
        request={async (params, sort) => {
          const response = await handleAdminGetUserInfoByPage({
            pageNum: params.current ?? 1,
            pageSize: params.pageSize ?? 10,
            userAccount: params.userAccount,
            userName: params.userName,
            userRole: params.userRole,
            userStatus: params.userStatus,
            userPhone: params.userPhone,
            userEmail: params.userEmail,
            createTimeStart: params.createTimeStart,
            createTimeEnd: params.createTimeEnd,
            sortField: Object.keys(sort)[0],
            sortOrder: Object.values(sort)[0] as
              | "ascend"
              | "descend"
              | undefined,
          });
          return {
            data: response?.records ?? [],
            success: true,
            total: response?.total ?? 0,
          };
        }}
        columns={columns}
      />

      <CreateUserModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          actionRef.current?.reload();
        }}
      />

      <EditUserModal
        open={editModalOpen}
        user={selectedUser}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedUser(undefined);
        }}
        onSuccess={() => {
          setEditModalOpen(false);
          setSelectedUser(undefined);
          actionRef.current?.reload();
        }}
      />

      <ResetPasswordModal
        open={resetPwdModalOpen}
        user={selectedUser}
        onCancel={() => {
          setResetPwdModalOpen(false);
          setSelectedUser(undefined);
        }}
        onSuccess={() => {
          setResetPwdModalOpen(false);
          setSelectedUser(undefined);
        }}
      />

      <ViewUserDrawer
        open={viewDrawerOpen}
        user={selectedUser}
        onClose={() => {
          setViewDrawerOpen(false);
          setSelectedUser(undefined);
        }}
      />
    </PageContainer>
  );
};

export default UserManage;

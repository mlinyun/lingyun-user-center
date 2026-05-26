<script setup lang="ts">
/**
 * 用户表格组件.
 */
import { reactive, ref, onMounted, createVNode } from "vue";
import type { MenuProps, PaginationProps } from "ant-design-vue";
import type { Api } from "@/types/api/typings";
import { Modal, type TableColumnsType, type TableProps } from "ant-design-vue/lib";
import { useUserOperations } from "@/composable/user-operations.ts";
import { USER_ROLE, USER_STATUS } from "@/constants/user.ts";
import {
    UserOutlined,
    SafetyOutlined,
    PhoneOutlined,
    MailOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    EditOutlined,
    MoreOutlined,
    KeyOutlined,
    StopOutlined,
    CheckCircleOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { formatDateTime } from "@/utils/date";

defineOptions({ name: "UserTable" });

const props = defineProps<{
    searchForm?: Api.UserAdmin.SearchForm;
}>();

const emit = defineEmits<{
    (event: "view", value: Api.UserAdmin.UserVo): void;
    (event: "edit", value: Api.UserAdmin.UserVo): void;
    (event: "reset", value: Api.UserAdmin.UserVo): void;
}>();

const userData = ref<Api.UserAdmin.UserVo[]>([]);

const tableColumns: TableColumnsType<Api.UserAdmin.UserVo> = [
    { title: "序号", dataIndex: "index", key: "index", width: 80, align: "center", fixed: "left" },
    { title: "用户信息", dataIndex: "userInfo", key: "userInfo", width: 200, fixed: "left" },
    { title: "性别", dataIndex: "userGender", key: "userGender", width: 100, align: "center" },
    { title: "联系方式", dataIndex: "contact", key: "contact", width: 200 },
    { title: "角色", dataIndex: "userRole", key: "userRole", width: 120, align: "center" },
    { title: "状态", dataIndex: "userStatus", key: "userStatus", width: 110, align: "center" },
    { title: "创建时间", dataIndex: "createTime", key: "createTime", width: 180 },
    { title: "操作", dataIndex: "actions", key: "actions", width: 220, fixed: "right", align: "center" },
];

const pagination = reactive<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ["5", "10", "20", "50", "100"],
    showTotal: (total: number) => `共 ${total} 条记录`,
});

type SortState = {
    field: string;
    order: "ascend" | "descend";
};

const sortState = ref<SortState | null>(null);

const handleTableChange: TableProps<Api.UserAdmin.UserVo>["onChange"] = (pager, _filters, sorter) => {
    pagination.current = pager.current ?? 1;
    pagination.pageSize = pager.pageSize ?? 10;

    if (!Array.isArray(sorter) && sorter?.order) {
        if (sorter.field) {
            sortState.value = {
                field: String(sorter.field),
                order: sorter.order,
            };
        }
    } else {
        sortState.value = null;
    }

    fetchUserData();
};

const userOperations = useUserOperations();

const buildRequestPayload = (): Api.UserAdmin.AdminQueryUserRequest => {
    const payload: Api.UserAdmin.AdminQueryUserRequest = {
        pageNum: pagination.current ?? 1,
        pageSize: pagination.pageSize ?? 10,
    };

    if (props.searchForm) {
        if (props.searchForm.userAccount !== "") {
            payload.userAccount = props.searchForm.userAccount;
        }

        if (props.searchForm.userName !== "") {
            payload.userName = props.searchForm.userName;
        }

        if (props.searchForm.userPhone !== "") {
            payload.userPhone = props.searchForm.userPhone;
        }

        if (props.searchForm.userEmail !== "") {
            payload.userEmail = props.searchForm.userEmail;
        }

        if (props.searchForm.userRole !== undefined) {
            payload.userRole = props.searchForm.userRole;
        }

        if (props.searchForm.userGender !== undefined) {
            payload.userGender = props.searchForm.userGender;
        }

        if (props.searchForm.userStatus !== undefined) {
            payload.userStatus = props.searchForm.userStatus;
        }

        if (props.searchForm.createTimeRange) {
            payload.createTimeStart = props.searchForm.createTimeRange[0];
            payload.createTimeEnd = props.searchForm.createTimeRange[1];
        }
    }

    return payload;
};

/**
 * 获取用户数据
 */
const fetchUserData = async () => {
    try {
        const pageData = await userOperations.handleAdminGetUserInfoByPage(buildRequestPayload());
        if (pageData !== null) {
            userData.value = pageData.records ?? [];
            pagination.total = pageData.total ?? 0;
        }
    } catch (error) {
        console.error("获取用户数据失败:", error);
    }
};

const genderTextMap: Record<number, string> = {
    0: "女",
    1: "男",
    2: "未知",
};

const genderColorMap: Record<number, string> = {
    0: "#ff85c0",
    1: "#1677ff",
    2: "#8c8c8c",
};

/**
 * 处理查看用户详情的操作
 * @param record 当前行的用户数据记录
 */
const handleView = async (record: Api.UserAdmin.UserVo) => {
    if (!record.id) {
        return;
    }
    // 尝试获取更完整的用户信息以显示在详情抽屉中，如果获取失败则使用当前行的数据
    const userInfo = await userOperations.handleAdminGetUserById(record.id);
    if (userInfo !== null) {
        emit("view", userInfo);
    } else {
        emit("view", record);
    }
};

/**
 * 处理编辑用户信息的操作
 * @param record 当前行的用户数据记录
 */
const handleEdit = async (record: Api.UserAdmin.UserVo) => {
    if (!record.id) {
        return;
    }
    // 尝试获取更完整的用户信息以显示在详情抽屉中，如果获取失败则使用当前行的数据
    const userInfo = await userOperations.handleAdminGetUserById(record.id);
    if (userInfo !== null) {
        emit("edit", userInfo);
    } else {
        emit("edit", record);
    }
};

/**
 * 处理重置用户密码的操作
 * @param record 当前行的用户数据记录
 */
const handleResetPassword = async (record: Api.UserAdmin.UserVo) => {
    if (!record.id) {
        return;
    }
    emit("reset", record);
};

/**
 * 处理切换用户状态（封禁/解禁）的操作
 * @param record 当前行的用户数据记录
 */
const handleToggleStatus = async (record: Api.UserAdmin.UserVo) => {
    if (!record.id || record.userStatus === undefined) {
        return;
    }
    const nextStatus = record.userStatus === 0 ? 1 : 0;
    const toggleResult = await userOperations.handleAdminBanOrUnbanUser({ id: record.id, userStatus: nextStatus });
    if (toggleResult) {
        await fetchUserData();
    }
};

/**
 * 处理删除用户的操作
 * @param record 当前行的用户数据记录
 */
const handleDeleteUser = async (record: Api.UserAdmin.UserVo) => {
    if (!record.id) {
        return;
    }
    const deleteResult = await userOperations.handleAdminDeleteUser(record.id);
    if (deleteResult) {
        await fetchUserData();
    }
};

type MenuClickInfo = Parameters<NonNullable<MenuProps["onClick"]>>[0];

/**
 * 处理更多操作菜单的点击事件，根据不同的操作类型调用相应的处理函数
 * @param key 点击的菜单项 key，表示操作类型（如 "reset"、"ban"、"delete"）
 * @param record 当前行的用户数据记录
 */
const handleMoreAction = (key: string, record: Api.UserAdmin.UserVo) => {
    switch (key) {
        case "reset":
            handleResetPassword(record);
            break;
        case "ban":
            handleToggleStatus(record);
            break;
        case "delete":
            if (!record.id) {
                return;
            }
            Modal.confirm({
                title: "确认删除用户",
                icon: createVNode(ExclamationCircleOutlined),
                content: `您确定要删除用户 "${record.userName || record.userAccount}" 吗？此操作不可恢复。`,
                okText: "确认",
                cancelText: "取消",
                okButtonProps: { danger: true },
                onOk: () => handleDeleteUser(record),
            });
            break;
        default:
            break;
    }
};

const refreshData = async (resetPage = false) => {
    if (resetPage) {
        pagination.current = 1;
    }
    await fetchUserData();
};

defineExpose({
    refreshData,
});

watch(
    () => props.searchForm,
    () => {
        pagination.current = 1;
        fetchUserData();
    }
);

onMounted(() => {
    fetchUserData();
});
</script>

<template>
    <a-table
        :data-source="userData"
        :columns="tableColumns"
        :loading="userOperations.loading.value"
        :pagination="pagination"
        :scroll="{ x: 1300 }"
        row-key="id"
        @change="handleTableChange"
    >
        <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
                <span>
                    {{ ((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10) + index + 1 }}
                </span>
            </template>
            <template v-else-if="column.key === 'userInfo'">
                <a-space size="middle">
                    <a-badge
                        :count="record.userRole === USER_ROLE.ADMIN ? '管理员' : 0"
                        :offset="[-6, 6]"
                        color="#1677ff"
                    >
                        <a-avatar :size="48" :src="record.userAvatar">
                            <template #icon><UserOutlined /></template>
                        </a-avatar>
                    </a-badge>
                    <div class="user-info-meta">
                        <div class="user-info-name">
                            {{ record.userName || "未设置昵称" }}
                            <a-tag v-if="record.userRole === USER_ROLE.ADMIN" color="gold">
                                <SafetyOutlined /> 管理员
                            </a-tag>
                        </div>
                        <div class="user-info-account"><UserOutlined /> {{ record.userAccount }}</div>
                    </div>
                </a-space>
            </template>
            <template v-else-if="column.key === 'userGender'">
                <a-tag :color="genderColorMap[record.userGender ?? 2]">
                    {{ genderTextMap[record.userGender ?? 2] }}
                </a-tag>
            </template>
            <template v-else-if="column.key === 'contact'">
                <div class="contact-cell">
                    <div v-if="record.userPhone" class="contact-item"><PhoneOutlined /> {{ record.userPhone }}</div>
                    <div v-if="record.userEmail" class="contact-item"><MailOutlined /> {{ record.userEmail }}</div>
                    <div v-if="!record.userPhone && !record.userEmail" class="contact-empty">暂无联系方式</div>
                </div>
            </template>
            <template v-else-if="column.key === 'userRole'">
                <a-tag :color="record.userRole === USER_ROLE.ADMIN ? 'gold' : 'blue'">
                    <template v-if="record.userRole === USER_ROLE.ADMIN"> <SafetyOutlined /> 管理员 </template>
                    <template v-else><TeamOutlined /> 普通用户</template>
                </a-tag>
            </template>
            <template v-else-if="column.key === 'userStatus'">
                <a-badge
                    :status="record.userStatus === USER_STATUS.NORMAL ? 'success' : 'error'"
                    :text="record.userStatus === USER_STATUS.NORMAL ? '正常' : '封禁'"
                />
            </template>
            <template v-else-if="column.key === 'createTime'">
                <a-tooltip :title="formatDateTime(record.createTime)">
                    <ClockCircleOutlined />
                    {{ formatDateTime(record.createTime) }}
                </a-tooltip>
            </template>
            <template v-else-if="column.key === 'actions'">
                <a-space size="small">
                    <a-button size="small" type="link" @click="handleView(record)"><EyeOutlined /> 查看</a-button>
                    <a-button size="small" type="link" @click="handleEdit(record)"><EditOutlined /> 编辑</a-button>
                    <a-dropdown :trigger="['click']" placement="bottomRight">
                        <a-button size="small" type="link"> <MoreOutlined /> 更多 </a-button>
                        <template #overlay>
                            <a-menu @click="(info: MenuClickInfo) => handleMoreAction(String(info.key), record)">
                                <a-menu-item key="reset"><KeyOutlined class="action-icon" /> 重置密码</a-menu-item>
                                <a-menu-item key="ban">
                                    <component
                                        :is="
                                            record.userStatus === USER_STATUS.NORMAL
                                                ? StopOutlined
                                                : CheckCircleOutlined
                                        "
                                        class="action-icon"
                                    />
                                    {{ record.userStatus === USER_STATUS.NORMAL ? "封禁用户" : "解禁用户" }}
                                </a-menu-item>
                                <a-menu-divider />
                                <a-menu-item key="delete" danger>
                                    <DeleteOutlined class="action-icon" /> 删除用户
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<style scoped>
.user-info-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.user-info-name {
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 600;
    color: rgb(0 0 0 / 85%);
}

.user-info-account {
    display: flex;
    gap: 4px;
    align-items: center;
    font-size: 12px;
    color: rgb(0 0 0 / 45%);
}

.contact-cell {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.contact-item {
    display: flex;
    gap: 6px;
    align-items: center;
    color: rgb(0 0 0 / 65%);
}

.contact-empty {
    color: rgb(0 0 0 / 35%);
}
</style>

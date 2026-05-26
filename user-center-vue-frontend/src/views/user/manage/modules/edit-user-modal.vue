<script setup lang="ts">
/**
 * 编辑用户信息的模态框组件.
 */
import { reactive, ref, watch } from "vue";
import { useUserOperations } from "@/composable/user-operations.ts";
import type { Api } from "@/types/api/typings";
import {
    EditOutlined,
    IdcardOutlined,
    UserOutlined,
    CameraOutlined,
    PhoneOutlined,
    MailOutlined,
    TeamOutlined,
    SafetyOutlined,
    WomanOutlined,
    ManOutlined,
} from "@ant-design/icons-vue";
import { formatDateTime } from "@/utils/date";
import type { FormInstance, UploadProps } from "ant-design-vue";
import { USER_ROLE } from "@/constants/user.ts";
import type { Rule } from "ant-design-vue/es/form";
import { messageUtils } from "@/utils/message";
import { formDataValidate } from "@/utils/form/form-data-validate.ts";

defineOptions({ name: "EditUserModal" });

const props = defineProps<{
    visible: boolean;
    user: Api.UserAdmin.UserVo | null;
}>();

const emit = defineEmits<{
    (event: "update:visible", value: boolean): void;
    (event: "success"): void;
}>();

const labelCol = { span: 6 };
const wrapperCol = { span: 16 };

// 管理员编辑用户表单引用
const editUserFormRef = ref<FormInstance>();

// 管理员编辑用户表单数据
const editUserForm = reactive<Api.UserAdmin.AdminUpdateUserInfoRequest>({
    id: "",
    userName: "",
    userAvatar: "",
    userProfile: "",
    userRole: USER_ROLE.USER,
});

// 表单验证规则
const FormRules: Record<string, Rule[]> = {
    userName: [{ max: 20, message: "昵称长度不超过 20 个字符", trigger: "blur" }],
    userProfile: [{ max: 200, message: "简介长度不超过 200 个字符", trigger: "blur" }],
};

const userOperations = useUserOperations();

const beforeAvatarUpload: UploadProps["beforeUpload"] = async (file) => {
    if (!props.user?.id) {
        messageUtils.error("用户信息不存在");
        return false;
    }
    if (!file) {
        return false;
    }
    try {
        const avatarUploadResult = await userOperations.handleAvatarUpload(file, props.user.id);
        if (avatarUploadResult !== null) {
            editUserForm.userAvatar = avatarUploadResult;
            return true;
        } else {
            return false; // 阻止默认的上传行为
        }
    } catch (error) {
        console.error("头像上传失败:", error);
    }
};

const handleCancel = () => {
    emit("update:visible", false);
};

const handleSubmit = async () => {
    if (!props.user?.id || userOperations.submitting.value) {
        messageUtils.error("用户信息不存在或正在提交中");
        return;
    }
    // 表单数据验证
    const validated = await formDataValidate(editUserFormRef.value!);
    if (!validated) {
        messageUtils.error("请修正表单中的错误后再提交");
        return;
    }
    try {
        const updateUserResult = await userOperations.handleAdminUpdateUserInfo(editUserForm);
        if (updateUserResult) {
            emit("success");
            emit("update:visible", false);
            resetForm();
        }
    } catch (error) {
        console.error("更新用户信息失败:", error);
    }
};

watch(
    () => props.visible,
    (visible) => {
        if (visible) {
            populateForm();
        } else {
            resetForm();
        }
    }
);

/**
 * 填充表单数据
 */
const populateForm = () => {
    if (!props.user) {
        return;
    }
    editUserForm.id = props.user.id || "";
    editUserForm.userName = props.user.userName || "";
    editUserForm.userAvatar = props.user.userAvatar || "";
    editUserForm.userProfile = props.user.userProfile || "";
    editUserForm.userRole = props.user.userRole || USER_ROLE.USER;
    editUserFormRef.value?.clearValidate();
};

/**
 * 重置表单数据和验证状态
 */
const resetForm = () => {
    editUserFormRef.value?.resetFields();
    editUserFormRef.value?.clearValidate();
};
</script>

<template>
    <a-modal
        :confirm-loading="userOperations.submitting.value"
        :mask-closable="false"
        :ok-button-props="{
            disabled: !props.user,
            loading: userOperations.submitting.value || userOperations.uploading.value,
        }"
        :open="props.visible"
        destroy-on-close
        title="编辑用户信息"
        width="720px"
        @cancel="handleCancel"
        @ok="handleSubmit"
    >
        <div v-if="props.user" class="modal-header-card">
            <a-space>
                <EditOutlined class="header-icon" />
                <div class="header-text">
                    <strong>账号：{{ props.user.userAccount }}</strong>
                    <span>创建时间：{{ formatDateTime(props.user.createTime) }}</span>
                </div>
            </a-space>
        </div>

        <div class="section">
            <a-divider orientation="left">
                <a-space>
                    <IdcardOutlined />
                    <span>用户头像</span>
                </a-space>
            </a-divider>
            <div class="avatar-wrapper">
                <a-upload
                    :before-upload="beforeAvatarUpload"
                    :disabled="userOperations.uploading.value || !user"
                    :show-upload-list="false"
                    accept="image/*"
                >
                    <div class="avatar-upload">
                        <a-spin :spinning="userOperations.uploading.value">
                            <a-avatar :size="120" :src="editUserForm.userAvatar">
                                <template #icon><UserOutlined /></template>
                            </a-avatar>
                        </a-spin>
                        <div class="avatar-mask">
                            <CameraOutlined />
                            <span>{{ userOperations.uploading.value ? "上传中..." : "点击更换头像" }}</span>
                        </div>
                    </div>
                </a-upload>
            </div>
        </div>

        <a-form
            ref="editUserFormRef"
            :model="editUserForm"
            :rules="FormRules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            autocomplete="off"
            layout="horizontal"
        >
            <div class="section">
                <a-divider orientation="left">
                    <a-space>
                        <UserOutlined />
                        <span>基本信息</span>
                    </a-space>
                </a-divider>
                <a-form-item label="用户昵称" name="userName">
                    <a-input
                        v-model:value="editUserForm.userName"
                        allow-clear
                        class="rounded-input"
                        placeholder="请输入用户昵称"
                    >
                        <template #prefix><UserOutlined /></template>
                    </a-input>
                </a-form-item>
                <a-form-item label="用户角色" name="userRole">
                    <a-radio-group v-model:value="editUserForm.userRole">
                        <a-radio value="user"><TeamOutlined /> 普通用户</a-radio>
                        <a-radio value="admin"><SafetyOutlined /> 管理员</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="性别" name="userGender">
                    <a-radio-group :value="props.user?.userGender" disabled>
                        <a-radio :value="0"><WomanOutlined style="color: #eb2f96" /> 女</a-radio>
                        <a-radio :value="1"><ManOutlined style="color: #1890ff" /> 男</a-radio>
                        <a-radio :value="2"><UserOutlined style="color: rgb(0 0 0 / 25%)" /> 未知</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="个人简介" name="userProfile">
                    <a-textarea
                        v-model:value="editUserForm.userProfile"
                        :maxlength="200"
                        :rows="3"
                        placeholder="请输入个人简介"
                        show-count
                        allow-clear
                    />
                </a-form-item>
            </div>

            <div class="section">
                <a-divider orientation="left">
                    <a-space>
                        <PhoneOutlined />
                        <span>联系方式</span>
                    </a-space>
                </a-divider>
                <a-form-item label="手机号码" name="userPhone">
                    <a-input
                        :value="props.user?.userPhone"
                        disabled
                        allow-clear
                        class="rounded-input"
                        placeholder="请输入手机号码"
                    >
                        <template #prefix><PhoneOutlined /></template>
                    </a-input>
                </a-form-item>
                <a-form-item label="邮箱地址" name="userEmail">
                    <a-input
                        :value="props.user?.userEmail"
                        disabled
                        allow-clear
                        class="rounded-input"
                        placeholder="请输入邮箱地址"
                    >
                        <template #prefix><MailOutlined /></template>
                    </a-input>
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>

<style scoped>
.modal-header-card {
    padding: 16px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    border: 1px solid #91d5ff;
    border-radius: 12px;
}

.header-icon {
    font-size: 24px;
    color: #1677ff;
}

.header-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: rgb(0 0 0 / 65%);
}

.section {
    margin-bottom: 24px;
}

.avatar-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    margin-top: 12px;
}

.avatar-upload {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.avatar-mask {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #fff;
    background: rgb(0 0 0 / 45%);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.avatar-upload:hover .avatar-mask {
    opacity: 1;
}

.rounded-input :deep(.ant-input),
.rounded-input :deep(.ant-input-affix-wrapper) {
    border-radius: 8px;
}
</style>

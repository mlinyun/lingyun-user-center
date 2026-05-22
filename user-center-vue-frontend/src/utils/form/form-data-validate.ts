import { messageUtils } from "@/utils/message";
import type { FormInstance } from "ant-design-vue";

/**
 * 表单数据验证
 */
export const formDataValidate = async (targetForm: FormInstance) => {
    try {
        await targetForm.validate();
        return true;
    } catch (error) {
        messageUtils.error(`表单数据校验失败：${error}`);
        return false;
    }
};

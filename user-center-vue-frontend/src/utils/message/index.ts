import { message, notification } from "ant-design-vue";
import type { MessageConfig } from "@/types/message";

/**
 * 统一的消息提示工具类.
 */
export const messageUtils = {
    /**
     * 成功提示
     * @param msg 提示内容
     *
     * @param msgConfig 消息配置选项
     */
    success: (msg: string, msgConfig?: MessageConfig): void => {
        const { useNotification = false, title = "成功", duration, ...rest } = msgConfig || {};
        // 如果配置项中 useNotification 为 true，则使用 Notification 组件进行提示
        if (useNotification) {
            notification.success({
                message: title,
                description: msg,
                duration: duration ?? 4.5,
                ...rest,
            });
        } else {
            // 否则使用 Message 组件进行提示
            void message.success({
                content: msg,
                duration: duration ?? 3,
            });
        }
    },

    /**
     * 普通提示
     * @param msg 提示内容
     * @param msgConfig 消息配置选项
     */
    info: (msg: string, msgConfig?: MessageConfig): void => {
        const { useNotification = false, title = "提示", duration, ...rest } = msgConfig || {};
        if (useNotification) {
            notification.info({
                message: title,
                description: msg,
                duration: duration ?? 4.5,
                ...rest,
            });
        } else {
            void message.info({
                content: msg,
                duration: duration ?? 3,
            });
        }
    },

    /**
     * 警告提示
     * @param msg 提示内容
     * @param msgConfig 消息配置选项
     */
    warning: (msg: string, msgConfig?: MessageConfig): void => {
        const { useNotification = false, title = "警告", duration, ...rest } = msgConfig || {};
        if (useNotification) {
            notification.warning({
                message: title,
                description: msg,
                duration: duration ?? 4.5,
                ...rest,
            });
        } else {
            void message.warning({
                content: msg,
                duration: duration ?? 3,
            });
        }
    },

    /**
     * 错误提示
     * @param msg 提示内容
     * @param msgConfig 消息配置选项
     */
    error: (msg: string, msgConfig?: MessageConfig): void => {
        const { useNotification = false, title = "错误", duration, ...rest } = msgConfig || {};
        if (useNotification) {
            notification.error({
                message: title,
                description: msg,
                duration: duration ?? 4.5,
                ...rest,
            });
        } else {
            void message.error({
                content: msg,
                duration: duration ?? 3,
            });
        }
    },

    /**
     * 销毁所有消息提示
     */
    destroy: (): void => {
        message.destroy();
        notification.destroy();
    },
};

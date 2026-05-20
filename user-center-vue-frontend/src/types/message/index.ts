/**
 * 消息配置选项
 *
 * @description 定义消息组件的配置选项接口
 * @module types/message
 */
import type { NotificationArgsProps } from "ant-design-vue/es/notification";

/** 消息配置选项接口定义 */
export interface MessageConfig extends NotificationArgsProps {
    /** 是否使用 Notification (默认 false) */
    useNotification?: boolean;
}

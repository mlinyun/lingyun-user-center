/**
 * 系统基础模块 - API 接口定义
 *
 * @description 该模块包含系统基础功能相关的 API 接口定义，如健康检查等
 *
 * ## 主要功能
 * - 健康检查接口：用于检查系统的健康状态，确保系统正常运行
 *
 * @module api/main
 */
import { http } from "@/utils/request/http.ts";
import type { AxiosResponse } from "axios";
import type { Api } from "@/types/api/typings";
import type { MessageConfig } from "@/types/message";

/**
 * 消息配置选项，定义了健康检查接口使用 Notification 组件显示消息
 *
 * 注意：message 是通知提醒标题，而不是通知提醒内容
 */
const messageConfig: MessageConfig = {
    useNotification: true,
    message: "健康检查",
};

/**
 * 健康检查.
 * @name healthCheck
 * @tags 主模块
 * @description 健康检查接口，用于检查系统的健康状态
 * @request GET `/health`
 * @return 健康检查响应结果，详见 {@linkcode Api.Main.HealthCheckResponse}
 */
export const healthCheck = (): Promise<AxiosResponse<Api.Main.HealthCheckResponse>> => {
    return http.get<Api.Main.HealthCheckResponseData>("/health", undefined, {
        showSuccessMessage: true,
        successMessage: "健康检查成功",
        messageConfig: messageConfig,
    });
};

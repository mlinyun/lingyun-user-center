/**
 * 验证码模块 API 接口定义
 *
 * @description 该模块包含验证码相关的 API 接口定义，如发送验证码等
 *
 * ## 主要功能
 * - 发送验证码接口：支持发送邮箱验证码或短信验证码，适用于用户注册、登录、重置密码等场景
 *
 * @module api/captcha
 */
import { http } from "@/utils/request";
import type { AxiosResponse } from "axios";
import type { Api } from "@/types/api/typings";

/**
 * 发送验证码.
 * @name sendCaptcha
 * @tags 验证码模块
 * @description 发送验证码接口，支持邮箱验证码或短信验证码
 * @request POST `/captcha/send`
 * @param data 发送验证码请求体，详见 {@linkcode Api.Captcha.SendCaptchaRequest}
 * @returns 通用操作响应结果，详见 {@linkcode Api.Common.OperationResultResponse}
 */
export const sendCaptcha = (
    data: Api.Captcha.SendCaptchaRequest
): Promise<AxiosResponse<Api.Common.OperationResultResponse>> => {
    return http.post<Api.Common.OperationResultResponseData>("/captcha/send", data, {
        showSuccessMessage: true,
        successMessage: "验证码发送成功",
    });
};

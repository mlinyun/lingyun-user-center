// @ts-ignore
/* eslint-disable */
import { request } from "@umijs/max";

/** 发送验证码 发送邮箱或短信验证码，60秒内不可重复发送 POST /captcha/send */
export async function sendCaptcha(
  body: API.SendCaptchaRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/captcha/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

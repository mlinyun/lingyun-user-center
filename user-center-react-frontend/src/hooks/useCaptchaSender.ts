import { message } from "antd";
import { useCallback, useState } from "react";
import { useCaptchaCooldown } from "@/hooks/useCaptchaCooldown";
import { sendCaptcha } from "@/services/ant-design-pro/captcha";

/**
 * 验证码发送 Hook.
 *
 * 统一处理验证码发送逻辑，封装了：
 * - 发送状态控制（防重复点击）
 * - 倒计时冷却
 * - 空值校验
 * - 请求防重复提交
 *
 * @param type 验证码类型（EMAIL / SMS）
 * @param scene 验证码业务场景（REGISTER / LOGIN / RESET_PWD / BIND_CHANGE）
 * @param getTarget 获取验证码接收目标的方法（如邮箱或手机号）
 * @param emptyWarning 接收目标为空时的提示信息
 * @param cooldownSeconds 验证码发送冷却时间（单位：秒），默认 60 秒
 */
export const useCaptchaSender = (
  type: API.SendCaptchaRequest["type"],
  scene: API.SendCaptchaRequest["scene"],
  getTarget: () => string,
  emptyWarning: string,
  cooldownSeconds = 60,
) => {
  const [sending, setSending] = useState(false);
  const { countdown, start: startCooldown } = useCaptchaCooldown();

  const send = useCallback(async () => {
    // 正在发送或冷却期间禁止重复发送
    if (sending || countdown > 0) {
      return;
    }

    // 获取验证码接收目标
    const target = getTarget();
    // 校验接收目标是否为空
    if (!target) {
      message.warning(emptyWarning);
      return;
    }

    setSending(true);
    try {
      // 调用验证码发送接口
      await sendCaptcha({ type, scene, target });
      // 启动冷却倒计时
      startCooldown(cooldownSeconds);
    } catch (error) {
      console.log(`验证码发送失败：${error}`);
    } finally {
      setSending(false);
    }
  }, [
    sending,
    countdown,
    getTarget,
    emptyWarning,
    type,
    scene,
    startCooldown,
    cooldownSeconds,
  ]);

  return { sending, countdown, send };
};

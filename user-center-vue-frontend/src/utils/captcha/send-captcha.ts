import type { Api } from "@/types/api/typings";
import { messageUtils } from "@/utils/message";
import { sendCaptcha } from "@/api/captcha.ts";

export const createSendCaptchaHandler =
    (type: Api.Captcha.CaptchaType, scene: Api.Captcha.CaptchaScene, getTarget: () => string, emptyWarning: string) =>
    async (): Promise<void> => {
        const target = getTarget();
        if (!target) {
            messageUtils.warning(emptyWarning);
            return;
        }
        try {
            const captchaRequest: Api.Captcha.SendCaptchaRequest = {
                type,
                scene,
                target,
            };
            await sendCaptcha(captchaRequest);
        } catch (error) {
            console.error("发送验证码失败:", error);
        }
    };

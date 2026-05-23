import { ref, computed, onBeforeUnmount } from "vue";
import type { Api } from "@/types/api/typings";
import { messageUtils } from "@/utils/message";
import { sendCaptcha } from "@/api/captcha.ts";
import { useCaptchaCooldown } from "@/composable/captcha-cooldown.ts";

/**
 * 验证码发送组合式函数.
 *
 * 该方法用于统一处理验证码发送逻辑，封装了：
 * - 发送状态控制
 * - 倒计时冷却
 * - 空值校验
 * - 请求防重复提交
 * - 组件卸载时清理定时器
 *
 * 适用于：
 * - 邮箱验证码发送
 * - 手机验证码发送
 * - 登录 / 注册 / 重置密码等验证码场景
 *
 * @param type 验证码类型
 * @param scene 验证码业务场景
 * @param getTarget 获取验证码接收目标的方法（如邮箱或手机号）
 * @param emptyWarning 接收目标为空时的提示信息
 * @param cooldownSeconds 验证码发送冷却时间（单位：秒），默认 60 秒
 *
 * @returns 返回验证码发送相关状态与方法
 * @returns returns.sending 当前是否正在发送验证码
 * @returns returns.countdown 当前剩余冷却倒计时（秒）
 * @returns returns.send 发送验证码方法
 */
export const useCaptchaSender = (
    type: Api.Captcha.CaptchaType,
    scene: Api.Captcha.CaptchaScene,
    getTarget: () => string,
    emptyWarning: string,
    cooldownSeconds = 60
) => {
    /**
     * 当前是否处于验证码发送中状态
     *
     * 用于：
     * - 防止重复点击
     * - 控制按钮 loading 状态
     */
    const sending = ref(false);

    /**
     * 验证码冷却控制器
     */
    const cooldown = useCaptchaCooldown();

    /**
     * 当前验证码剩余冷却时间（秒）
     */
    const countdown = computed(() => cooldown.countdown.value);

    /**
     * 发送验证码
     *
     * 执行流程：
     * 1. 检查是否正在发送或处于冷却中
     * 2. 获取验证码接收目标
     * 3. 校验目标是否为空
     * 4. 调用后端接口发送验证码
     * 5. 启动冷却倒计时
     */
    const send = async () => {
        // 正在发送或冷却期间禁止重复发送
        if (sending.value || countdown.value > 0) {
            return;
        }

        // 获取验证码接收目标
        const target = getTarget();

        // 校验接收目标是否为空
        if (!target) {
            messageUtils.warning(emptyWarning);
            return;
        }

        sending.value = true;

        try {
            // 调用验证码发送接口
            await sendCaptcha({ type, scene, target });

            // 启动冷却倒计时
            cooldown.start(cooldownSeconds);
        } catch (error) {
            console.log(`验证码发送失败：${error}`);
        } finally {
            sending.value = false;
        }
    };

    /**
     * 组件卸载前清理倒计时，避免内存泄漏
     */
    onBeforeUnmount(() => cooldown.stop());

    return { sending, countdown, send };
};

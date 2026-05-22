import { ref } from "vue";

/**
 * 验证码发送冷却机制
 * 提供倒计时功能，防止用户频繁发送验证码
 */
export const useCaptchaCooldown = () => {
    const countdown = ref(0);
    let timer: ReturnType<typeof setInterval> | null = null;

    const start = (seconds = 60) => {
        countdown.value = seconds;
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(() => {
            if (countdown.value <= 1) {
                countdown.value = 0;
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            } else {
                countdown.value -= 1;
            }
        }, 1000);
    };

    const stop = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        countdown.value = 0;
    };

    return { countdown, start, stop };
};

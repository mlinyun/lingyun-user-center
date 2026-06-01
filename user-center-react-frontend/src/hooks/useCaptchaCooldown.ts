import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 验证码发送冷却机制 Hook.
 *
 * 提供倒计时功能，防止用户频繁发送验证码。
 * 组件卸载时自动清理定时器，避免内存泄漏。
 */
export const useCaptchaCooldown = () => {
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCountdown(0);
  }, []);

  const start = useCallback(
    (seconds = 60) => {
      stop();
      setCountdown(seconds);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [stop],
  );

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { countdown, start, stop };
};

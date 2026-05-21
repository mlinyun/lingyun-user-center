import type { Api } from "@/types/api/typings";

/**
 * 获取当前年份
 *
 * 此函数返回系统当前的年份，如 2024、2025 等，以四位数字格式表示
 *
 * @example
 * ```typescript
 * const year: number = getCurrentYear(); // 返回当前年份，例如 2025
 * ```
 *
 * @returns {number} 当前年份，四位数字格式（如 2025）
 */
export const getCurrentYear = (): number => {
    return new Date().getFullYear();
};

/**
 * 格式化日期时间
 *
 * 将时间戳或日期字符串格式化为 `yyyy/MM/dd HH:mm:ss`（中文地区格式），
 *
 * @param dateTime 时间戳或日期时间字符串，默认当前时间
 * @returns 可读的日期时间字符串
 */
export const formatDateTime = (dateTime?: Api.Common.DateTimeString | number): string => {
    if (!dateTime) {
        return "-";
    }
    // 转换数字时间戳
    const date = new Date(dateTime);
    return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

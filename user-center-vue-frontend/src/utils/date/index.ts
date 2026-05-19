/**
 * 获取当前年份。
 *
 * 此函数返回系统当前的年份，如 2024、2025 等。
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
 * 格式化日期时间。
 *
 * 将时间戳或日期字符串格式化为 `yyyy/MM/dd HH:mm:ss`（中文地区格式）。
 * 若输入已是日期字符串格式，直接返回；若是时间戳（数字），则进行转换。
 *
 * @param value 时间戳或日期时间字符串，默认当前时间
 * @returns 可读的日期时间字符串；无效值时返回 `-`
 */
export const formatDateTime = (value?: number | string): string => {
    if (!value) return "-";

    // 转换数字时间戳
    const date = new Date(value);
    return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

/**
 * 将格式化的日期时间字符串解析为时间戳。
 *
 * 支持 `toLocaleString("zh-CN")` 生成的格式（如 `2025/05/20 14:30:45`）。
 *
 * @param value 日期时间字符串
 * @returns 解析后的时间戳；解析失败时返回 `null`
 */
export const parseDateTime = (value: string): number | null => {
    if (!value || value === "-") {
        return null;
    }

    const [datePart, timePart] = value.split(" ");
    if (!datePart || !timePart) {
        return null;
    }

    const dateParts = datePart.split("/").map(Number);
    const timeParts = timePart.split(":").map(Number);

    if (dateParts.length !== 3 || timeParts.length !== 3) {
        return null;
    }

    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const hour = timeParts[0];
    const minute = timeParts[1];
    const second = timeParts[2];

    if (
        year === undefined ||
        month === undefined ||
        day === undefined ||
        hour === undefined ||
        minute === undefined ||
        second === undefined
    ) {
        return null;
    }

    if ([year, month, day, hour, minute, second].some((item) => Number.isNaN(item))) {
        return null;
    }

    return new Date(year, month - 1, day, hour, minute, second).getTime();
};

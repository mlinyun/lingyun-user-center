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

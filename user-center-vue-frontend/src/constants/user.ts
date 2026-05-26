/**
 * 用户相关常量
 */
// 用户角色
export const USER_ROLE = {
    USER: "user",
    ADMIN: "admin",
} as const;

// 用户状态
export const USER_STATUS = {
    NORMAL: 0, // 正常
    BANNED: 1, // 封禁
} as const;

// 性别
export const USER_GENDER = {
    FEMALE: 0, // 女
    MALE: 1, // 男
    UNKNOWN: 2, // 未知
} as const;

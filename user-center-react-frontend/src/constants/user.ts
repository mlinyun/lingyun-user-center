/**
 * 用户相关常量
 */
export const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
} as const;

export const USER_STATUS = {
  NORMAL: 0,
  BANNED: 1,
} as const;

export const USER_GENDER = {
  FEMALE: 0,
  MALE: 1,
  UNKNOWN: 2,
} as const;

/**
 * HTTP 相关常量定义.
 */
export const REQUEST_TIMEOUT = 10000;

export const CONTENT_TYPE = {
  JSON: "application/json;charset=UTF-8",
  FORM: "application/x-www-form-urlencoded;charset=UTF-8",
  MULTIPART: "multipart/form-data",
  TEXT: "text/plain;charset=UTF-8",
} as const;

import type { AxiosResponse, RequestConfig, RequestOptions } from "@umijs/max";
import { history } from "@umijs/max";
import { message, notification } from "antd";
import type { ReactNode } from "react";
import {
  getMessageByCode,
  isAuthError,
  isPermissionError,
  isServerError,
  isSuccess,
} from "@/constants/code";
import { ROUTES } from "@/constants/routes";

interface ApiResponse<T = unknown> {
  success?: boolean;
  code?: number;
  message?: string;
  data?: T;
}

interface MessageConfig {
  useNotification?: boolean;
  message?: ReactNode;
  duration?: number | false;
}

interface CustomRequestOptions extends RequestOptions {
  showErrorMessage?: boolean;
  showSuccessMessage?: boolean;
  successMessage?: string;
  messageConfig?: MessageConfig;
}

interface BizErrorInfo<T = unknown> {
  code?: number;
  message?: string;
  data?: T;
  response?: ApiResponse<T>;
}

interface BizError extends Error {
  name: "BizError";
  info: BizErrorInfo;
}

const loginPath = ROUTES.LOGIN.path;
const authExpiredNotifyCooldownMs = 2000;

let isRedirectingToLogin = false;
let isAuthExpiredNotified = false;
let authExpiredNotifyTimer: ReturnType<typeof setTimeout> | null = null;
let redirectLockTimer: ReturnType<typeof setTimeout> | null = null;
let authExpiredHandler: (() => void) | undefined;

export const setAuthExpiredHandler = (handler: () => void): void => {
  authExpiredHandler = handler;
};

const isApiResponse = (data: unknown): data is ApiResponse =>
  typeof data === "object" &&
  data !== null &&
  "success" in data &&
  "code" in data;

const isSuccessfulResponse = (data: ApiResponse): boolean =>
  data.success === true && isSuccess(data.code);

const getBusinessMessage = (data: ApiResponse): string =>
  data.message || getMessageByCode(data.code) || "请求失败，请稍后再试！";

const createBizError = (data: ApiResponse): BizError => {
  const error = new Error(getBusinessMessage(data)) as BizError;
  error.name = "BizError";
  error.info = {
    code: data.code,
    message: data.message,
    data: data.data,
    response: data,
  };
  return error;
};

const getMessageDuration = (
  duration: MessageConfig["duration"],
  fallback: number,
): number => (typeof duration === "number" ? duration : fallback);

const showSuccess = (content: string, config?: MessageConfig): void => {
  const { useNotification = false, message: title, duration } = config || {};
  if (useNotification) {
    notification.success({
      message: title || "操作成功",
      description: content,
      duration: duration ?? 4.5,
    });
    return;
  }
  void message.success({
    content,
    duration: getMessageDuration(duration, 3),
  });
};

const showError = (content: string, config?: MessageConfig): void => {
  const { useNotification = false, message: title, duration } = config || {};
  if (useNotification) {
    notification.error({
      message: title || "请求错误",
      description: content,
      duration: duration ?? 4.5,
    });
    return;
  }
  void message.error({
    content,
    duration: getMessageDuration(duration, 3),
  });
};

const tryNotifyAuthExpired = (errorMessage: string): void => {
  if (isAuthExpiredNotified) {
    return;
  }
  isAuthExpiredNotified = true;

  showError(errorMessage || "登录状态已失效，请重新登录！", {
    useNotification: true,
    message: "认证失效",
  });

  if (authExpiredNotifyTimer) {
    clearTimeout(authExpiredNotifyTimer);
  }
  authExpiredNotifyTimer = setTimeout(() => {
    isAuthExpiredNotified = false;
    authExpiredNotifyTimer = null;
  }, authExpiredNotifyCooldownMs);
};

const getCurrentPath = (): string => {
  const { pathname, search, hash } = history.location;
  return `${pathname}${search}${hash}`;
};

const handleAuthExpired = (
  errorMessage: string,
  shouldShowError: boolean,
): void => {
  if (shouldShowError) {
    tryNotifyAuthExpired(errorMessage);
  }
  if (isRedirectingToLogin) {
    return;
  }
  isRedirectingToLogin = true;

  try {
    authExpiredHandler?.();

    const { pathname } = history.location;
    if (pathname === loginPath) {
      return;
    }
    history.replace(
      `${loginPath}?redirect=${encodeURIComponent(getCurrentPath())}`,
    );
  } finally {
    if (redirectLockTimer) {
      clearTimeout(redirectLockTimer);
    }
    redirectLockTimer = setTimeout(() => {
      isRedirectingToLogin = false;
      redirectLockTimer = null;
    }, 500);
  }
};

const handleBizError = (
  errorInfo: BizErrorInfo,
  options: CustomRequestOptions,
): void => {
  const errorMessage =
    errorInfo.message ||
    getMessageByCode(errorInfo.code) ||
    "请求失败，请稍后再试！";
  const shouldShowError = options.showErrorMessage !== false;

  if (isAuthError(errorInfo.code)) {
    handleAuthExpired(errorMessage, shouldShowError);
    return;
  }
  if (!shouldShowError) {
    return;
  }
  if (isPermissionError(errorInfo.code)) {
    showError(errorMessage, {
      useNotification: true,
      message: "权限不足",
    });
    return;
  }
  if (isServerError(errorInfo.code)) {
    showError(errorMessage, {
      useNotification: true,
      message: "服务器错误",
    });
    return;
  }
  showError(errorMessage, options.messageConfig);
};

const getHttpErrorMessage = (error: any): string => {
  const responseData = error.response?.data as ApiResponse | undefined;
  if (responseData?.message) {
    return responseData.message;
  }
  const statusCode = error.response?.status;
  const statusText = error.response?.statusText;
  return `请求失败，状态码：${statusCode} ${statusText || ""}`.trim();
};

const handleHttpError = (error: any, options: CustomRequestOptions): void => {
  const shouldShowError = options.showErrorMessage !== false;

  if (error.response) {
    const statusCode = error.response.status;
    if (statusCode === 401) {
      handleAuthExpired("登录状态已失效，请重新登录！", shouldShowError);
      return;
    }
    if (shouldShowError) {
      showError(getHttpErrorMessage(error), {
        useNotification: true,
        message: `请求错误 ${statusCode}`,
      });
    }
    return;
  }

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    if (shouldShowError) {
      showError("网络不可用，请检查网络连接后重试。", {
        useNotification: true,
        message: "网络错误",
      });
    }
    return;
  }

  if (error.request) {
    if (shouldShowError) {
      const isTimeout = error.code === "ECONNABORTED";
      showError(
        isTimeout ? "请求超时，请稍后再试" : "请求未响应，请检查网络连接",
        {
          useNotification: true,
          message: isTimeout ? "请求超时" : "网络错误",
        },
      );
    }
    return;
  }

  if (shouldShowError) {
    showError(error.message || "Request error, please retry.", {
      useNotification: true,
      message: "请求错误",
    });
  }
};

const handleResponse = <T>(response: AxiosResponse<T>): AxiosResponse<T> => {
  const requestConfig = response.config as CustomRequestOptions;
  const responseData = response.data as unknown;

  if (process.env.NODE_ENV === "development") {
    console.log(`[Response] ${requestConfig.url}`, responseData);
  }

  if (!isApiResponse(responseData)) {
    return response;
  }

  if (isSuccessfulResponse(responseData)) {
    if (requestConfig.showSuccessMessage) {
      showSuccess(
        requestConfig.successMessage || responseData.message || "操作成功！",
        requestConfig.messageConfig,
      );
    }
    return response;
  }
  return response;
};

/**
 * @name 错误处理
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  errorConfig: {
    errorThrower: (res) => {
      const responseData = res as ApiResponse;
      if (isApiResponse(responseData) && !isSuccessfulResponse(responseData)) {
        throw createBizError(responseData);
      }
    },
    errorHandler: (error: any, opts: RequestOptions) => {
      if (opts?.skipErrorHandler) {
        throw error;
      }

      const options = opts as CustomRequestOptions;

      if (error.name === "BizError" && error.info) {
        handleBizError(error.info, options);
        return;
      }

      handleHttpError(error, options);
    },
  },

  requestInterceptors: [
    [
      (config: RequestOptions) => config,
      (error: Error) => {
        if (process.env.NODE_ENV === "development") {
          console.error("[Request Error]:", error);
        }
        message.error(error.message);
        return Promise.reject(error);
      },
    ],
  ],

  responseInterceptors: [handleResponse],
};

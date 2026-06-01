import { BusinessCode } from "@/constants/code";
import { USER_ROLE } from "@/constants/user";
import { getLoginUserInfo, userLogout } from "@/services/ant-design-pro/user";

export type AuthStatus = "unknown" | "checking" | "authenticated" | "guest";

export interface AuthState {
  authStatus: AuthStatus;
  user: API.UserLoginVo | null;
  initialized: boolean;
  lastValidatedAt: number | null;
  cacheExpiresAt: number | null;
}

interface BootstrapOptions {
  force?: boolean;
  strict?: boolean;
}

const AUTH_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_HEARTBEAT_INTERVAL_MS = 20 * 60 * 1000;

const DEFAULT_AUTH_STATE: AuthState = {
  authStatus: "unknown",
  user: null,
  initialized: false,
  lastValidatedAt: null,
  cacheExpiresAt: null,
};

type InitialStateValue = { auth?: AuthState } & object;
type InitialStateUpdater = (state?: InitialStateValue) => InitialStateValue;
type SetInitialState = (updater: InitialStateUpdater) => void | Promise<void>;

let authState: AuthState = { ...DEFAULT_AUTH_STATE };
let bootstrapPromise: Promise<void> | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let setInitialStateRef: SetInitialState | null = null;

const syncAuthState = (): void => {
  if (!setInitialStateRef) {
    return;
  }
  setInitialStateRef((state) => ({
    ...(state ?? {}),
    auth: { ...authState },
  }));
};

export const bindAuthStore = (setInitialState: SetInitialState): void => {
  setInitialStateRef = setInitialState;
  syncAuthState();
};

export const getAuthState = (): AuthState => authState;

export const isAuthenticated = (): boolean =>
  authState.authStatus === "authenticated" && !!authState.user;

export const isAdmin = (): boolean =>
  authState.user?.userRole === USER_ROLE.ADMIN;

const isCacheValid = (): boolean =>
  authState.cacheExpiresAt !== null && authState.cacheExpiresAt > Date.now();

const applyAuthenticated = (loginUser: API.UserLoginVo): void => {
  const now = Date.now();
  authState = {
    ...authState,
    authStatus: "authenticated",
    user: loginUser,
    initialized: true,
    lastValidatedAt: now,
    cacheExpiresAt: now + AUTH_CACHE_TTL_MS,
  };
  syncAuthState();
};

const applyGuest = (): void => {
  const now = Date.now();
  authState = {
    ...authState,
    authStatus: "guest",
    user: null,
    initialized: true,
    lastValidatedAt: now,
    cacheExpiresAt: now + AUTH_CACHE_TTL_MS,
  };
  syncAuthState();
};

const ensureCacheFreshness = (): void => {
  if (
    authState.cacheExpiresAt !== null &&
    authState.cacheExpiresAt <= Date.now()
  ) {
    authState = { ...DEFAULT_AUTH_STATE };
    syncAuthState();
  }
};

const fetchCurrentUser = async (): Promise<void> => {
  const wasAuthenticated = isAuthenticated();

  authState = {
    ...authState,
    authStatus: "checking",
  };
  syncAuthState();

  try {
    const response = await getLoginUserInfo();
    if (
      response.code === BusinessCode.SUCCESS &&
      response.success &&
      response.data
    ) {
      applyAuthenticated(response.data);
      return;
    }
    applyGuest();
  } catch {
    if (wasAuthenticated) {
      // Transient failure — restore previous auth state so the user
      // doesn't lose authentication due to a network hiccup or a
      // timing issue (e.g. session cookie not yet propagated).
      authState = {
        ...authState,
        authStatus: "authenticated",
        lastValidatedAt: null,
      };
      syncAuthState();
    } else {
      applyGuest();
    }
  }
};

export const bootstrap = async (
  options: BootstrapOptions = {},
): Promise<void> => {
  const { force = false, strict = false } = options;

  ensureCacheFreshness();

  if (!force && !strict) {
    if (
      authState.initialized &&
      (authState.authStatus === "authenticated" ||
        authState.authStatus === "guest")
    ) {
      return;
    }
    if (isAuthenticated() && isCacheValid()) {
      authState = {
        ...authState,
        initialized: true,
      };
      syncAuthState();
      return;
    }
  }

  if (bootstrapPromise) {
    await bootstrapPromise;
    return;
  }

  bootstrapPromise = fetchCurrentUser().finally(() => {
    bootstrapPromise = null;
  });
  await bootstrapPromise;
};

export const markAuthenticated = (loginUser: API.UserLoginVo): void => {
  applyAuthenticated(loginUser);
};

export const refreshCurrentUser = async (): Promise<void> => {
  await bootstrap({ force: true, strict: true });
};

export const clearAuthState = (): void => {
  authState = {
    ...authState,
    authStatus: "guest",
    user: null,
    initialized: true,
    lastValidatedAt: null,
    cacheExpiresAt: null,
  };
  stopSessionHeartbeat();
  syncAuthState();
};

export const logout = async (): Promise<void> => {
  try {
    await userLogout();
  } finally {
    clearAuthState();
  }
};

export const startSessionHeartbeat = (): void => {
  stopSessionHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (!isAuthenticated()) {
      stopSessionHeartbeat();
      return;
    }
    void bootstrap({ strict: true });
  }, SESSION_HEARTBEAT_INTERVAL_MS);
};

export const stopSessionHeartbeat = (): void => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
};

export const authStore = {
  getState: getAuthState,
  isAuthenticated,
  isAdmin,
  bootstrap,
  markAuthenticated,
  refreshCurrentUser,
  clearAuthState,
  logout,
  startSessionHeartbeat,
  stopSessionHeartbeat,
};

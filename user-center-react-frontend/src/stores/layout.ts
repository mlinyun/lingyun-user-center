export interface LayoutState {
  sidebarCollapsed: boolean;
}

const STORAGE_KEY = "user-center-layout";

type InitialStateValue = { layout?: LayoutState } & object;
type InitialStateUpdater = (state?: InitialStateValue) => InitialStateValue;
type SetInitialState = (updater: InitialStateUpdater) => void | Promise<void>;

const readPersistedLayout = (): LayoutState => {
  if (typeof window === "undefined") {
    return { sidebarCollapsed: false };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { sidebarCollapsed: false };
    }
    const parsed = JSON.parse(raw) as Partial<LayoutState>;
    return {
      sidebarCollapsed: Boolean(parsed.sidebarCollapsed),
    };
  } catch (error) {
    console.log("Failed to read layout state:", error);
    return { sidebarCollapsed: false };
  }
};

let layoutState: LayoutState = readPersistedLayout();
let setInitialStateRef: SetInitialState | null = null;

const persistLayoutState = (): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ sidebarCollapsed: layoutState.sidebarCollapsed }),
  );
};

const syncLayoutState = (): void => {
  if (!setInitialStateRef) {
    return;
  }
  setInitialStateRef((state) => ({
    ...(state ?? {}),
    layout: { ...layoutState },
  }));
};

export const bindLayoutStore = (setInitialState: SetInitialState): void => {
  setInitialStateRef = setInitialState;
  syncLayoutState();
};

export const getLayoutState = (): LayoutState => layoutState;

export const setSidebarCollapsed = (value: boolean): void => {
  layoutState = {
    ...layoutState,
    sidebarCollapsed: value,
  };
  persistLayoutState();
  syncLayoutState();
};

export const toggleSidebarCollapsed = (): void => {
  setSidebarCollapsed(!layoutState.sidebarCollapsed);
};

export const layoutStore = {
  getState: getLayoutState,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
};

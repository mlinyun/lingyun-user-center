import { ref } from "vue";
import { defineStore } from "pinia";

export const useLayoutStore = defineStore(
    "layout",
    () => {
        const sidebarCollapsed = ref(false);

        const setSidebarCollapsed = (value: boolean): void => {
            sidebarCollapsed.value = value;
        };

        const toggleSidebarCollapsed = (): void => {
            sidebarCollapsed.value = !sidebarCollapsed.value;
        };

        return {
            sidebarCollapsed,
            setSidebarCollapsed,
            toggleSidebarCollapsed,
        };
    },
    {
        persist: {
            key: "user-center-layout",
            storage: localStorage,
            pick: ["sidebarCollapsed"],
        },
    }
);

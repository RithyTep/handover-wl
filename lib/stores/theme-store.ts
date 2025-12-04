import { create } from "zustand";
import type { Theme, ThemeInfo } from "@/lib/types";
import { DEFAULT_THEME } from "@/lib/constants";

interface ThemeStore {
  selectedTheme: Theme | null;
  setTheme: (theme: Theme) => void;
  loadFromLocalStorage: () => void;
  initializeFromServer: (themes: ThemeInfo[]) => void;
}

const STORAGE_KEY = "theme_preference";

export const useThemeStore = create<ThemeStore>((set) => ({
  selectedTheme: null,

  setTheme: (theme: Theme) => {
    // Update store immediately
    set({ selectedTheme: theme });
    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  },

  loadFromLocalStorage: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "default" || stored === "christmas") {
      set({ selectedTheme: stored as Theme });
    }
  },

  initializeFromServer: (themes: ThemeInfo[]) => {
    // Only set if no theme is currently selected
    set((state) => {
      if (state.selectedTheme === null && themes.length > 0) {
        const firstTheme = themes[0]?.id as Theme;
        if (firstTheme) {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, firstTheme);
          }
          return { selectedTheme: firstTheme };
        }
      }
      return state;
    });
  },
}));

// Initialize from localStorage on module load
if (typeof window !== "undefined") {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "default" || stored === "christmas") {
    useThemeStore.setState({ selectedTheme: stored as Theme });
  }
}

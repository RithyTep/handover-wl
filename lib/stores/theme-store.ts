import { create } from "zustand";
import { Theme } from "@/enums/theme.enum";
import type { ThemeInfo } from "@/interfaces/theme.interface";
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
    set({ selectedTheme: theme });
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  },

  loadFromLocalStorage: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === Theme.DEFAULT || stored === Theme.CHRISTMAS || stored === Theme.PIXEL || stored === Theme.LUNAR || stored === Theme.CODING) {
      set({ selectedTheme: stored as Theme });
    }
  },

  initializeFromServer: (themes: ThemeInfo[]) => {
    set((state) => {
      if (state.selectedTheme === null && themes.length > 0) {
        const firstTheme = themes[0].id;
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, firstTheme);
        }
        return { selectedTheme: firstTheme };
      }
      return state;
    });
  },
}));

if (typeof window !== "undefined") {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === Theme.DEFAULT || stored === Theme.CHRISTMAS || stored === Theme.PIXEL || stored === Theme.LUNAR || stored === Theme.CODING) {
    useThemeStore.setState({ selectedTheme: stored as Theme });
  }
}

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Theme } from "@/lib/types";
import { THEME_VALUES } from "@/lib/types";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme: Theme }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [loading, _setLoading] = useState(false);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    THEME_VALUES.forEach((themeValue) => {
      document.body.classList.toggle(`theme-${themeValue}`, newTheme === themeValue);
    });
  };

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

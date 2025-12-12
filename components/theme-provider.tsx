"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Theme } from "@/lib/types";
import { DEFAULT_THEME } from "@/lib/constants";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme: Theme }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [loading, setLoading] = useState(false);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.body.classList.toggle("theme-christmas", newTheme === "christmas");
    document.body.classList.toggle("theme-default", newTheme === "default");
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

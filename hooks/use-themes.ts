import { trpc } from "@/components/trpc-provider";
import { useThemeStore } from "@/lib/stores/theme-store";
import { useEffect } from "react";
import type { ThemeInfo } from "@/lib/types";

export function useThemes() {
  const { data, isLoading } = trpc.theme.getAll.useQuery(undefined, {
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const initializeFromServer = useThemeStore((state) => state.initializeFromServer);
  const loadFromLocalStorage = useThemeStore((state) => state.loadFromLocalStorage);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  useEffect(() => {
    if (data && data.length > 0 && selectedTheme === null) {
      initializeFromServer(data);
    }
  }, [data, selectedTheme, initializeFromServer]);

  const themes: ThemeInfo[] = data || [];
  const selectedThemeId = selectedTheme || themes[0]?.id || "";

  return {
    themes,
    selectedThemeId,
    setTheme,
    isLoading,
  };
}

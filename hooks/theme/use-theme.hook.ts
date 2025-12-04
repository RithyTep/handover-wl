import { useEffect } from "react";
import { trpc } from "@/components/trpc-provider";
import { useThemeStore } from "@/lib/stores/theme-store";
import type { Theme } from "@/enums/theme.enum";
import type { ThemeInfo } from "@/interfaces/theme.interface";
import { DEFAULT_THEME } from "@/lib/constants";

export function useTheme() {
  const { data: themes, isLoading } = trpc.theme.getAll.useQuery(undefined, {
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
    if (themes && themes.length > 0 && selectedTheme === null) {
      initializeFromServer(themes);
    }
  }, [themes, selectedTheme, initializeFromServer]);

  const themeList: ThemeInfo[] = themes ?? [];
  const currentTheme: Theme = selectedTheme ?? DEFAULT_THEME;

  const setSelectedThemeMutation = trpc.theme.setSelected.useMutation();

  const handleThemeSelect = (theme: Theme) => {
    if (theme === selectedTheme) return;
    setTheme(theme);
  };

  const handleSaveToServer = async (theme: Theme): Promise<void> => {
    await setSelectedThemeMutation.mutateAsync({ theme });
  };

  return {
    themes: themeList,
    selectedTheme: currentTheme,
    isLoading,
    handleThemeSelect,
    handleSaveToServer,
    isSaving: setSelectedThemeMutation.isPending,
  };
}

import { useEffect, useRef } from "react";
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

  const { data: serverThemeData, refetch: refetchServerTheme } = trpc.theme.getSelected.useQuery(undefined, {
    staleTime: 60000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const initializeFromServer = useThemeStore((state) => state.initializeFromServer);
  const loadFromLocalStorage = useThemeStore((state) => state.loadFromLocalStorage);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  useEffect(() => {
    if (themes && themes.length > 0 && selectedTheme === null) {
      initializeFromServer(themes);
    }
  }, [themes, selectedTheme, initializeFromServer]);

  useEffect(() => {
    if (!serverThemeData?.theme) return;

    const serverTheme = serverThemeData.theme;
    const currentSelectedTheme = useThemeStore.getState().selectedTheme;

    // Only use server theme if no local theme is set
    if (!hasInitializedRef.current) {
      if (currentSelectedTheme === null) {
        setTheme(serverTheme);
      }
      // If localStorage already has a theme, keep it (don't override with server)
      hasInitializedRef.current = true;
    }
    // Removed: automatic sync from server that was overwriting local preferences
  }, [serverThemeData?.theme, setTheme]);

  const themeList: ThemeInfo[] = themes ?? [];
  const currentTheme: Theme = selectedTheme ?? DEFAULT_THEME;

  const setSelectedThemeMutation = trpc.theme.setSelected.useMutation({
    onSuccess: () => {
      refetchServerTheme();
    },
  });

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

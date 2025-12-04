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
  const lastLocalChangeRef = useRef<Theme | null>(null);
  const lastLocalChangeTimeRef = useRef<number>(0);

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
    const timeSinceLocalChange = Date.now() - lastLocalChangeTimeRef.current;
    const currentSelectedTheme = useThemeStore.getState().selectedTheme;

    if (!hasInitializedRef.current) {
      if (currentSelectedTheme === null) {
        setTheme(serverTheme);
        hasInitializedRef.current = true;
      } else if (currentSelectedTheme !== serverTheme) {
        setTheme(serverTheme);
        hasInitializedRef.current = true;
      } else {
        hasInitializedRef.current = true;
      }
      return;
    }

    if (currentSelectedTheme !== serverTheme && timeSinceLocalChange > 5000) {
      setTheme(serverTheme);
    }
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
    lastLocalChangeRef.current = theme;
    lastLocalChangeTimeRef.current = Date.now();
    setTheme(theme);
  };

  const handleSaveToServer = async (theme: Theme): Promise<void> => {
    lastLocalChangeRef.current = null;
    lastLocalChangeTimeRef.current = 0;
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

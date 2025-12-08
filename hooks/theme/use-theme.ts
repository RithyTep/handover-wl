import { useEffect, useRef, useCallback } from "react"
import { trpc } from "@/components/trpc-provider"
import { useThemeStore } from "@/lib/stores/theme-store"
import type { Theme, ThemeInfo } from "@/lib/types"
import { DEFAULT_THEME } from "@/lib/constants"

// ============================================================================
// Hook
// ============================================================================

export const useTheme = () => {
	const { data: themes, isLoading } = trpc.theme.getAll.useQuery(undefined, {
		staleTime: Infinity,
		gcTime: Infinity,
	})

	const { data: serverThemeData, refetch: refetchServerTheme } =
		trpc.theme.getSelected.useQuery(undefined, {
			staleTime: 60000,
			gcTime: 5 * 60 * 1000,
			refetchInterval: 60000,
			refetchOnWindowFocus: true,
			retry: 1,
		})

	const selectedTheme = useThemeStore((state) => state.selectedTheme)
	const setTheme = useThemeStore((state) => state.setTheme)
	const initializeFromServer = useThemeStore((state) => state.initializeFromServer)
	const loadFromLocalStorage = useThemeStore((state) => state.loadFromLocalStorage)
	const hasInitializedRef = useRef(false)

	// Load from localStorage on mount
	useEffect(() => {
		loadFromLocalStorage()
	}, [loadFromLocalStorage])

	// Initialize from server if no theme selected
	useEffect(() => {
		if (themes && themes.length > 0 && selectedTheme === null) {
			initializeFromServer(themes)
		}
	}, [themes, selectedTheme, initializeFromServer])

	// Sync with server theme
	useEffect(() => {
		if (!serverThemeData?.theme) return

		const serverTheme = serverThemeData.theme as Theme

		if (!hasInitializedRef.current) {
			const currentSelectedTheme = useThemeStore.getState().selectedTheme
			if (currentSelectedTheme === null) {
				setTheme(serverTheme)
			}
			hasInitializedRef.current = true
		}
	}, [serverThemeData?.theme, setTheme])

	const themeList: ThemeInfo[] = themes ?? []
	const currentTheme: Theme = selectedTheme ?? DEFAULT_THEME

	const setSelectedThemeMutation = trpc.theme.setSelected.useMutation({
		onSuccess: () => {
			refetchServerTheme()
		},
	})

	const handleThemeSelect = useCallback(
		(theme: Theme) => {
			if (theme === selectedTheme) return
			setTheme(theme)
		},
		[selectedTheme, setTheme]
	)

	const handleSaveToServer = useCallback(
		async (theme: Theme): Promise<void> => {
			await setSelectedThemeMutation.mutateAsync(theme)
		},
		[setSelectedThemeMutation]
	)

	return {
		themes: themeList,
		selectedTheme: currentTheme,
		isLoading,
		handleThemeSelect,
		handleSaveToServer,
		isSaving: setSelectedThemeMutation.isPending,
	}
}

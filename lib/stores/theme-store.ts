import { create } from "zustand"
import { isValidTheme, type Theme, type ThemeInfo } from "@/lib/types"

interface ThemeStore {
	selectedTheme: Theme | null
	setTheme: (theme: Theme) => void
	loadFromLocalStorage: () => void
	initializeFromServer: (themes: ThemeInfo[]) => void
}

const STORAGE_KEY = "theme_preference"

export const useThemeStore = create<ThemeStore>((set) => ({
	selectedTheme: null,

	setTheme: (theme: Theme) => {
		set({ selectedTheme: theme })
		if (typeof window !== "undefined") {
			localStorage.setItem(STORAGE_KEY, theme)
		}
	},

	loadFromLocalStorage: () => {
		if (typeof window === "undefined") return
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored && isValidTheme(stored)) {
			set({ selectedTheme: stored })
		}
	},

	initializeFromServer: (themes: ThemeInfo[]) => {
		set((state) => {
			if (state.selectedTheme === null && themes.length > 0) {
				const firstTheme = themes[0].id
				if (typeof window !== "undefined") {
					localStorage.setItem(STORAGE_KEY, firstTheme)
				}
				return { selectedTheme: firstTheme }
			}
			return state
		})
	},
}))

if (typeof window !== "undefined") {
	const stored = localStorage.getItem(STORAGE_KEY)
	if (stored && isValidTheme(stored)) {
		useThemeStore.setState({ selectedTheme: stored })
	}
}

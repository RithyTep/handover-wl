import type { Theme } from "@/enums"

export interface IThemeInfo {
	id: Theme
	name: string
	description: string
	icon: string
}

export interface IThemeState {
	selectedTheme: Theme | null
	themes: IThemeInfo[]
	isLoading: boolean
	isSaving: boolean
}

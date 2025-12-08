import { z } from "zod"
import { Theme, ThemeValues } from "@/enums"

export { Theme }

export const THEME_VALUES = ThemeValues

export const themeSchema = z.nativeEnum(Theme)

export interface ThemeInfo {
	id: Theme
	name: string
	description: string
	icon: string
}

export const isValidTheme = (value: unknown): value is Theme => {
	return themeSchema.safeParse(value).success
}

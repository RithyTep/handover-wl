"use client"

import { ThemeButton } from "./theme-button"
import { Theme } from "@/enums"
import type { IThemeInfo } from "@/interfaces"

interface ThemeListProps {
	themes: IThemeInfo[]
	selectedTheme: Theme
	onSelect: (theme: Theme) => void
	disabled: boolean
}

export const ThemeList = ({ themes, selectedTheme, onSelect, disabled }: ThemeListProps) => {
	return (
		<div
			className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
			role="listbox"
			aria-label="Available themes"
		>
			{themes.map((theme) => (
				<ThemeButton
					key={theme.id}
					theme={theme}
					isSelected={selectedTheme === theme.id}
					onSelect={onSelect}
					disabled={disabled}
				/>
			))}
		</div>
	)
}

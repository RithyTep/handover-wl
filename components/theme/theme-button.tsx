"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Theme } from "@/enums"
import type { IThemeInfo } from "@/interfaces"

interface ThemeButtonProps {
	theme: IThemeInfo
	isSelected: boolean
	onSelect: (theme: Theme) => void
	disabled: boolean
}

export const ThemeButton = ({ theme, isSelected, onSelect, disabled }: ThemeButtonProps) => {
	const handleClick = () => {
		onSelect(theme.id)
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault()
			onSelect(theme.id)
		}
	}

	return (
		<button
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			disabled={disabled}
			className={cn(
				"relative p-4 rounded-lg border-2 transition-all text-left",
				isSelected
					? "border-green-500 bg-green-500/10"
					: "border-border hover:border-primary/50",
				disabled && "opacity-50 cursor-not-allowed",
				!disabled && "cursor-pointer"
			)}
			aria-pressed={isSelected}
			aria-label={`Select ${theme.name} theme`}
			tabIndex={0}
		>
			{isSelected && (
				<div className="absolute top-2 right-2">
					<div className="bg-green-500 text-white rounded-full p-1">
						<Check className="w-3 h-3" aria-hidden="true" />
					</div>
				</div>
			)}
			<div className="flex items-start gap-3">
				<div className="text-3xl" aria-hidden="true">
					{theme.icon}
				</div>
				<div className="flex-1">
					<h3 className="font-semibold text-lg mb-1">{theme.name}</h3>
					{isSelected && (
						<span className="text-xs text-green-600 dark:text-green-400 mb-2 block">
							Currently active
						</span>
					)}
					<p className="text-sm text-muted-foreground">{theme.description}</p>
				</div>
			</div>
		</button>
	)
}

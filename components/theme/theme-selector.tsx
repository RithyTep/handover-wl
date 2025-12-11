"use client"

import { useState, useCallback } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { useTheme } from "@/hooks/theme/use-theme"
import { ThemeList } from "./theme-list"
import { cn } from "@/lib/utils"
import { Theme } from "@/enums"

interface ThemeSelectorProps {
	variant?: Theme
}

const THEME_BUTTON_STYLES: Record<Theme, string> = {
	[Theme.CHRISTMAS]: "text-white/70 hover:text-white hover:bg-white/10",
	[Theme.PIXEL]: "text-slate-300 hover:text-indigo-400 transition-colors",
	[Theme.LUNAR]: "text-stone-400 hover:text-amber-400 hover:bg-stone-800/50 transition-colors",
	[Theme.CODING]: "text-zinc-500 hover:text-indigo-400 transition-colors",
	[Theme.CLASH]: "text-[#ccc] hover:text-[#fbcc14] transition-colors",
	[Theme.ANGKOR_PIXEL]: "text-[#f5e6d3] hover:text-[#ffd700] hover:bg-[#3d5a4a]/50 transition-colors",
	[Theme.DEFAULT]: "text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors",
}

export const ThemeSelector = ({ variant = Theme.DEFAULT }: ThemeSelectorProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const { themes, selectedTheme, isLoading, handleThemeSelect, handleSaveToServer, isSaving } =
		useTheme()

	const handleOpen = useCallback(() => {
		setIsOpen(true)
	}, [])

	const handleClose = useCallback(() => {
		setIsOpen(false)
	}, [])

	const handleSave = useCallback(async () => {
		await handleSaveToServer(selectedTheme)
		setIsOpen(false)
	}, [handleSaveToServer, selectedTheme])

	const buttonClassName = THEME_BUTTON_STYLES[variant] ?? THEME_BUTTON_STYLES.default

	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				onClick={handleOpen}
				className={cn(buttonClassName)}
				aria-label="Open theme selector"
				aria-haspopup="dialog"
			>
				<Palette className="w-4 h-4 mr-1.5" aria-hidden="true" />
				<span className="hidden sm:inline">Theme</span>
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Theme</DialogTitle>
						<DialogDescription>
							Choose the theme that best represents your style and brand.
						</DialogDescription>
					</DialogHeader>

					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="text-muted-foreground" role="status" aria-live="polite">
								Loading themes...
							</div>
						</div>
					) : (
						<>
							<ThemeList
								themes={themes}
								selectedTheme={selectedTheme}
								onSelect={handleThemeSelect}
								disabled={isSaving}
							/>

							<div className="mt-6 p-4 bg-muted rounded-lg">
								<h4 className="font-semibold mb-2">About Rithy</h4>
								<p className="text-sm text-muted-foreground">
                  ABA 003 791 262
								</p>
							</div>

							<div className="mt-4 flex justify-end">
								<Button
									onClick={handleSave}
									disabled={isSaving}
									variant="outline"
									aria-busy={isSaving}
								>
									{isSaving ? "Saving..." : "Save Preference to Server"}
								</Button>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}

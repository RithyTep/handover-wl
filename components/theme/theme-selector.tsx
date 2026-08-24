"use client"

import { useState, useCallback, useEffect } from "react"
import { Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useTheme } from "@/hooks/theme/use-theme"
import { cn } from "@/lib/utils"
import { Theme } from "@/enums"

interface ThemeSelectorProps {
	variant?: Theme
}

interface ThemeSelectorSurfaceStyles {
	dialogContent: string
	title: string
	description: string
	selectTrigger: string
	selectContent: string
	selectItem: string
	changeText: string
	aboutCard: string
	aboutTitle: string
	aboutText: string
	cancelButton: string
	saveButton: string
}

const THEME_BUTTON_STYLES: Record<Theme, string> = {
	[Theme.SAKURA]: "text-rose-500 hover:text-rose-600 hover:bg-rose-100/70 transition-colors",
	[Theme.CHRISTMAS]: "text-white/70 hover:text-white hover:bg-white/10",
	[Theme.PIXEL]: "text-slate-300 hover:text-indigo-400 transition-colors",
	[Theme.LUNAR]: "text-stone-400 hover:text-amber-400 hover:bg-stone-800/50 transition-colors",
	[Theme.CODING]: "text-zinc-500 hover:text-indigo-400 transition-colors",
	[Theme.CLASH]: "text-[#ccc] hover:text-[#fbcc14] transition-colors",
	[Theme.ANGKOR_PIXEL]: "text-[#f5e6d3] hover:text-[#ffd700] hover:bg-[#3d5a4a]/50 transition-colors",
	[Theme.PCHUM_BEN]: "text-violet-300/70 hover:text-amber-300 hover:bg-violet-950/40 transition-colors",
	[Theme.DEFAULT]: "text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors",
}

const DEFAULT_SURFACE_STYLES: ThemeSelectorSurfaceStyles = {
	dialogContent: "bg-card border-border",
	title: "text-foreground",
	description: "text-muted-foreground",
	selectTrigger: "w-full border",
	selectContent: "border",
	selectItem: "cursor-pointer",
	changeText: "text-amber-500",
	aboutCard: "p-4 bg-muted rounded-lg",
	aboutTitle: "font-semibold mb-2 text-foreground",
	aboutText: "text-sm text-muted-foreground",
	cancelButton: "",
	saveButton: "",
}

const SAKURA_SURFACE_STYLES: ThemeSelectorSurfaceStyles = {
	dialogContent:
		"bg-white/92 border border-rose-200 shadow-[0_28px_80px_rgba(244,114,182,0.22)] rounded-[1.5rem] backdrop-blur-xl",
	title: "text-rose-950",
	description: "text-rose-400",
	selectTrigger:
		"w-full border border-rose-200 bg-white/90 text-rose-500 rounded-xl shadow-[0_10px_30px_rgba(244,114,182,0.12)] focus:ring-rose-300 focus:ring-offset-0",
	selectContent:
		"border border-rose-200 bg-white/95 text-rose-500 rounded-xl shadow-[0_18px_50px_rgba(244,114,182,0.18)] backdrop-blur-xl",
	selectItem: "cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600 rounded-lg",
	changeText: "text-rose-500",
	aboutCard: "p-4 rounded-xl border border-rose-100 bg-rose-50/70 shadow-inner",
	aboutTitle: "font-semibold mb-2 text-rose-700",
	aboutText: "text-sm text-rose-400",
	cancelButton: "border-rose-200 bg-white/85 text-rose-500 hover:bg-rose-50 hover:text-rose-600",
	saveButton: "bg-white text-rose-500 border border-rose-200 hover:bg-rose-50 shadow-[0_10px_24px_rgba(244,114,182,0.12)]",
}

export const getThemeSelectorSurfaceStyles = (variant: Theme): ThemeSelectorSurfaceStyles => {
	if (variant === Theme.SAKURA) {
		return SAKURA_SURFACE_STYLES
	}

	return DEFAULT_SURFACE_STYLES
}

export const ThemeSelector = ({ variant = Theme.DEFAULT }: ThemeSelectorProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const { themes, selectedTheme, isLoading, handleThemeSelect, handleSaveToServer, isSaving } =
		useTheme()

	const [pendingTheme, setPendingTheme] = useState<Theme>(selectedTheme as Theme)
	const [hasChanges, setHasChanges] = useState(false)

	useEffect(() => {
		setPendingTheme(selectedTheme as Theme)
		setHasChanges(false)
	}, [selectedTheme, isOpen])

	const handleOpen = useCallback(() => {
		setIsOpen(true)
	}, [])

	const handlePendingChange = useCallback((value: string) => {
		setPendingTheme(value as Theme)
		setHasChanges(value !== selectedTheme)
	}, [selectedTheme])

	const handleSave = useCallback(async () => {
		if (pendingTheme !== selectedTheme) {
			handleThemeSelect(pendingTheme)
		}
		await handleSaveToServer(pendingTheme)
		setHasChanges(false)
		setIsOpen(false)
	}, [handleSaveToServer, handleThemeSelect, pendingTheme, selectedTheme])

	const buttonClassName = THEME_BUTTON_STYLES[variant] ?? THEME_BUTTON_STYLES.default
	const surfaceStyles = getThemeSelectorSurfaceStyles(variant)

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
				<DialogContent className={cn("sm:max-w-md", surfaceStyles.dialogContent)}>
					<DialogHeader>
						<DialogTitle className={surfaceStyles.title}>Select Theme</DialogTitle>
						<DialogDescription className={surfaceStyles.description}>
							Choose a theme. Click save to apply changes.
						</DialogDescription>
					</DialogHeader>

					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="text-muted-foreground" role="status" aria-live="polite">
								Loading themes...
							</div>
						</div>
					) : (
						<div className="space-y-6 py-4">
							<Select value={pendingTheme} onValueChange={handlePendingChange} disabled={isSaving}>
								<SelectTrigger
									className={surfaceStyles.selectTrigger}
									aria-label="Select theme"
								>
									<SelectValue placeholder="Select theme" />
								</SelectTrigger>
								<SelectContent
									className={surfaceStyles.selectContent}
								>
									{themes.map((theme) => (
										<SelectItem
											key={theme.id}
											value={theme.id}
											className={surfaceStyles.selectItem}
										>
											{theme.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{hasChanges && (
								<p className={cn("text-sm", surfaceStyles.changeText)}>
									Theme changed to "{themes.find(t => t.id === pendingTheme)?.name}". Click save to apply.
								</p>
							)}

							<div className={surfaceStyles.aboutCard}>
								<h4 className={surfaceStyles.aboutTitle}>About Rithy</h4>
								<p className={surfaceStyles.aboutText}>
									ABA 003 791 262
								</p>
							</div>

							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => setIsOpen(false)}
									disabled={isSaving}
									className={surfaceStyles.cancelButton}
								>
									Cancel
								</Button>
								<Button
									onClick={handleSave}
									disabled={isSaving}
									aria-busy={isSaving}
									className={surfaceStyles.saveButton}
								>
									<Save className="w-4 h-4 mr-2" />
									{isSaving ? "Saving..." : "Save Preference"}
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}

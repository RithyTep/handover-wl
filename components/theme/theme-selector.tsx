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

	// Pending theme - only applied when saving
	const [pendingTheme, setPendingTheme] = useState<Theme>(selectedTheme as Theme)
	const [hasChanges, setHasChanges] = useState(false)

	// Sync pending theme when selected theme changes or dialog opens
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
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Select Theme</DialogTitle>
						<DialogDescription>
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
							{/* Theme Dropdown */}
							<Select value={pendingTheme} onValueChange={handlePendingChange} disabled={isSaving}>
								<SelectTrigger
									className="w-full border"
									style={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
									aria-label="Select theme"
								>
									<SelectValue placeholder="Select theme" />
								</SelectTrigger>
								<SelectContent
									className="border"
									style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
								>
									{themes.map((theme) => (
										<SelectItem
											key={theme.id}
											value={theme.id}
											className="cursor-pointer"
											style={{ color: '#f3f4f6' }}
										>
											{theme.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Change indicator */}
							{hasChanges && (
								<p className="text-sm text-amber-500">
									Theme changed to "{themes.find(t => t.id === pendingTheme)?.name}". Click save to apply.
								</p>
							)}

							{/* About section */}
							<div className="p-4 bg-muted rounded-lg">
								<h4 className="font-semibold mb-2">About Rithy</h4>
								<p className="text-sm text-muted-foreground">
									ABA 003 791 262
								</p>
							</div>

							{/* Save button */}
							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => setIsOpen(false)}
									disabled={isSaving}
								>
									Cancel
								</Button>
								<Button
									onClick={handleSave}
									disabled={isSaving}
									aria-busy={isSaving}
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

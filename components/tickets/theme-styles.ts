import type { Theme } from "@/enums"

export interface TableThemeStyles {
	container: string
	header: string
	headerRow: string
	headerCell: string
	body: string
	row: (index: number) => string
	cell: (cellIndex: number) => string
	emptyCell: string
}

const defaultStyles: TableThemeStyles = {
	container: "border border-white/20 rounded-md shadow-xl",
	header: "bg-background backdrop-blur-md",
	headerRow: "border-b border-border",
	headerCell: "text-foreground border-r border-border last:border-r-0",
	body: "",
	row: () => "border-b border-border hover:bg-muted/50",
	cell: () => "border-r border-border last:border-r-0",
	emptyCell: "h-24 text-center text-muted-foreground text-sm",
}

const christmasStyles: TableThemeStyles = {
	container: "border border-white/20 rounded-md shadow-xl",
	header: "bg-black/40 backdrop-blur-md",
	headerRow: "border-b border-white/10",
	headerCell: "text-white/90 border-r border-white/10 last:border-r-0",
	body: "",
	row: (index) => {
		const rowClasses = ["christmas-row-gold", "christmas-row-red", "christmas-row-green"]
		return `border-b border-white/10 ${rowClasses[index % 3]} hover:brightness-110`
	},
	cell: (cellIndex) =>
		`border-r border-white/10 last:border-r-0 ${cellIndex === 0 ? "candy-cane-border" : ""}`,
	emptyCell: "h-24 text-center text-muted-foreground text-sm",
}

const pixelStyles: TableThemeStyles = {
	container: "border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm pixel-shadow",
	header: "bg-slate-950",
	headerRow: "border-b-2 border-slate-700",
	headerCell: "text-slate-400 border-r-2 border-slate-800 last:border-r-0",
	body: "text-sm divide-y-2 divide-slate-800",
	row: () => "hover:bg-slate-800/50",
	cell: () => "border-r-2 border-slate-800 last:border-r-0",
	emptyCell: "h-24 text-center text-muted-foreground text-sm",
}

const lunarStyles: TableThemeStyles = {
	container: "lunar-card border border-stone-800/50 shadow-xl",
	header: "lunar-table-header backdrop-blur-md",
	headerRow: "border-b border-stone-800/50",
	headerCell: "text-stone-500 border-r border-stone-800/30 last:border-r-0",
	body: "text-sm",
	row: () => "lunar-table-row",
	cell: () => "lunar-table-cell border-r border-stone-800/30 last:border-r-0 text-stone-300",
	emptyCell: "h-24 text-center text-muted-foreground text-sm",
}

const codingStyles: TableThemeStyles = {
	container: "coding-card border border-green-900/30 shadow-xl shadow-green-900/20",
	header: "coding-table-header backdrop-blur-md",
	headerRow: "border-b border-green-900/30",
	headerCell: "text-green-500/70 border-r border-green-900/30 last:border-r-0 font-mono",
	body: "text-sm font-mono",
	row: () => "coding-table-row",
	cell: () => "coding-table-cell border-r border-green-900/30 last:border-r-0 text-green-400/70",
	emptyCell: "h-24 text-center text-muted-foreground text-sm",
}

const clashStyles: TableThemeStyles = {
	container: "clash-card",
	header: "clash-table-header",
	headerRow: "border-b border-[#9c9c9c]",
	headerCell: "text-[#fbcc14] border-r border-[#9c9c9c] last:border-r-0",
	body: "",
	row: () => "clash-table-row",
	cell: () => "text-white border-r border-[#9c9c9c] last:border-r-0 font-medium dropshadow-sm",
	emptyCell: "h-24 text-center text-muted-foreground text-sm",
}

const angkorPixelStyles: TableThemeStyles = {
	container: "angkor-pixel-table bg-[#1a2f26] border-4 border-[#8b7355]",
	header: "bg-[#3a2a1a]",
	headerRow: "border-b-4 border-[#8b7355]",
	headerCell: "text-[#ffd700] border-r border-[#8b7355] last:border-r-0 bg-[#3a2a1a]",
	body: "text-sm bg-[#1a2f26]",
	row: (index) =>
		`border-b-2 border-[#3d5a4a] hover:bg-[#3d5a4a] ${index % 2 === 0 ? "bg-[#243d32]" : "bg-[#1e3329]"}`,
	cell: () => "text-[#f5e6d3] border-r border-[#3d5a4a] last:border-r-0 font-medium",
	emptyCell: "h-24 text-center text-muted-foreground text-sm",
}

const themeStylesMap: Record<string, TableThemeStyles> = {
	christmas: christmasStyles,
	pixel: pixelStyles,
	lunar: lunarStyles,
	coding: codingStyles,
	clash: clashStyles,
	angkor_pixel: angkorPixelStyles,
}

export function getTableThemeStyles(theme: Theme): TableThemeStyles {
	return themeStylesMap[theme] || defaultStyles
}

// Button theme styles for TicketsTable toggle button
export interface ButtonThemeStyles {
	base: string
}

const buttonThemeMap: Record<string, string> = {
	christmas: "text-white/80 hover:text-white hover:bg-white/10 border-white/20",
	pixel: "bg-slate-900 border-2 border-slate-700 hover:border-indigo-500 hover:text-indigo-400 pixel-shadow",
	lunar: "text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg",
	coding: "text-green-500/80 bg-black hover:bg-green-900/20 border border-green-900/30 font-mono",
	clash: "text-[#fbcc14] bg-[#3f2e21] hover:bg-black/20 border-2 border-[#9c9c9c] clash-btn-primary",
	angkor_pixel:
		"text-[#ffd700] bg-[#3a2a1a] hover:bg-[#4b3a2a] border-4 border-[#8b7355] angkor-pixel-btn",
}

export function getButtonThemeStyles(theme: Theme): string {
	return buttonThemeMap[theme] || "text-slate-300 hover:bg-slate-800 border-slate-700"
}

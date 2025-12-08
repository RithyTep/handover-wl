import type { Theme } from "@/lib/types"
import type { LucideIcon } from "lucide-react"
import {
	MessageSquare,
	FileText,
	Command,
	Save,
	Send,
	Zap,
	Trash2,
	RefreshCw,
	Copy,
	Snowflake,
	Sparkles,
	Bug,
	Sword,
	Shield,
	Hammer,
} from "lucide-react"

// ============================================================================
// Types
// ============================================================================

export interface ThemeHeaderConfig {
	container: string
	logo: {
		wrapper?: string
		icon?: string
		svgIcon?: string
		title: string
		titleGradient?: string
		subtitle?: string
	}
	badge: string
	nav: {
		link: string
		kbd: string
		kbdIcon?: string
	}
}

export interface ThemeActionButton {
	id: string
	label: string
	svgIcon?: string
	icon?: LucideIcon
	className: string
	iconClassName?: string
}

export interface ThemeMobileAction {
	id: string
	icon: LucideIcon
	className: string
	iconColor: string
}

export interface ThemeLayoutConfig {
	body: string
	background: string
	mobileBar: string
}

export interface ThemeTableConfig {
	container: string
	header: string
	headerCell: string
	row: string
	cell: string
	mobileCard: string
	detailsButton: string
}

export interface ThemeConfig {
	header: ThemeHeaderConfig
	layout: ThemeLayoutConfig
	table: ThemeTableConfig
	actions: {
		aiFill: ThemeActionButton
		quickFill: ThemeActionButton
		clear: ThemeActionButton
		refresh: ThemeActionButton
		copy: ThemeActionButton
		save: ThemeActionButton
		send: ThemeActionButton
	}
	mobileActions: {
		aiFill: ThemeMobileAction
		quickFill: ThemeMobileAction
		clear: ThemeMobileAction
		save: ThemeMobileAction
		send: ThemeMobileAction
	}
}

// ============================================================================
// Default Theme Configuration
// ============================================================================

const defaultThemeConfig: ThemeConfig = {
	header: {
		container:
			"h-14 sm:h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-8 border-b border-slate-700 bg-slate-900/90 backdrop-blur-sm z-10",
		logo: {
			title: "text-xl font-semibold text-slate-100 tracking-tight",
			subtitle: "text-[10px] text-slate-500 font-medium -mt-0.5 hidden sm:block",
		},
		badge:
			"text-xs font-semibold px-2.5 py-1 text-blue-400 bg-blue-500/10 rounded-md border border-blue-500/20",
		nav: {
			link: "text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors",
			kbd: "hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-slate-500 bg-slate-800 border border-slate-700 rounded-md font-medium",
		},
	},
	layout: {
		body: "theme-default",
		background: "bg-background",
		mobileBar: "bg-slate-900/95 border-slate-700",
	},
	table: {
		container: "border border-slate-700 rounded-lg overflow-hidden",
		header: "bg-slate-800/50",
		headerCell: "text-slate-400 font-medium",
		row: "border-b border-slate-700/50 hover:bg-slate-800/30",
		cell: "text-slate-300",
		mobileCard: "bg-slate-800/50 border border-slate-700 rounded-lg",
		detailsButton: "text-slate-400 hover:text-blue-400 hover:bg-slate-800",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "AI Fill",
			icon: Zap,
			className:
				"h-9 px-4 text-slate-300 hover:text-blue-400 hover:bg-slate-800 font-medium",
		},
		quickFill: {
			id: "quick-fill",
			label: "Quick Fill",
			icon: Zap,
			className:
				"h-9 px-4 text-slate-300 hover:text-blue-400 hover:bg-slate-800 font-medium",
		},
		clear: {
			id: "clear",
			label: "Clear",
			icon: Trash2,
			className:
				"h-9 px-4 text-slate-300 hover:text-red-400 hover:bg-red-900/30 font-medium",
		},
		refresh: {
			id: "refresh",
			label: "Refresh",
			icon: RefreshCw,
			className:
				"h-9 px-4 text-slate-300 hover:text-blue-400 hover:bg-slate-800 font-medium",
		},
		copy: {
			id: "copy",
			label: "Copy",
			icon: Copy,
			className:
				"h-9 px-4 text-slate-300 hover:text-blue-400 hover:bg-slate-800 font-medium",
		},
		save: {
			id: "save",
			label: "Save",
			icon: Save,
			className:
				"h-9 px-4 text-slate-300 border-slate-700 hover:border-blue-500 hover:text-blue-400 hover:bg-slate-800 font-medium",
		},
		send: {
			id: "send",
			label: "Send to Slack",
			icon: Send,
			className: "h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			icon: Zap,
			className: "bg-blue-500/20 border border-blue-500/30 active:bg-blue-500/30",
			iconColor: "text-blue-400",
		},
		quickFill: {
			id: "quick-fill",
			icon: Sparkles,
			className: "bg-slate-800 border border-slate-700 active:bg-slate-700",
			iconColor: "text-slate-300",
		},
		clear: {
			id: "clear",
			icon: Trash2,
			className: "bg-slate-800 border border-slate-700 active:bg-red-900/30",
			iconColor: "text-slate-300",
		},
		save: {
			id: "save",
			icon: Save,
			className: "bg-slate-800 border border-slate-700 active:bg-slate-700",
			iconColor: "text-slate-300",
		},
		send: {
			id: "send",
			icon: Send,
			className: "bg-blue-600 active:bg-blue-700 shadow-md",
			iconColor: "text-white",
		},
	},
}

// ============================================================================
// Pixel Theme Configuration
// ============================================================================

const pixelThemeConfig: ThemeConfig = {
	header: {
		container:
			"h-12 sm:h-[52px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b-2 border-slate-800 bg-transparent pb-6 z-10",
		logo: {
			svgIcon: "/icons/pixel/gamepad.svg",
			title: "text-2xl flex items-center gap-2 text-white tracking-tight font-bold",
		},
		badge:
			"text-xs font-bold px-2 py-0.5 bg-indigo-500 text-black pixel-shadow-sm border-2 border-black/20",
		nav: {
			link: "text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1",
			kbd: "hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-slate-500 border-2 border-slate-800 bg-slate-900",
			kbdIcon: "/icons/pixel/key.svg",
		},
	},
	layout: {
		body: "theme-pixel",
		background: "pixel-bg p-6",
		mobileBar: "bg-slate-900/95 border-slate-800",
	},
	table: {
		container: "border-2 border-slate-800 pixel-shadow",
		header: "bg-slate-900 border-b-2 border-slate-800",
		headerCell: "text-indigo-400 font-bold uppercase text-xs",
		row: "border-b-2 border-slate-800 hover:bg-slate-800/50",
		cell: "text-slate-300 font-medium",
		mobileCard: "bg-slate-900 border-2 border-slate-800 pixel-shadow-sm",
		detailsButton:
			"text-slate-400 hover:text-indigo-400 border-2 border-slate-800 hover:border-indigo-500",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "Pixel Fill",
			svgIcon: "/icons/pixel/star.svg",
			className:
				"h-9 px-4 bg-rose-900/40 text-rose-300 border-2 border-rose-800 hover:bg-rose-900/60 pixel-shadow-sm",
			iconClassName: "animate-pulse",
		},
		quickFill: {
			id: "quick-fill",
			label: "Fill",
			svgIcon: "/icons/pixel/potion.svg",
			className:
				"h-9 px-4 bg-indigo-900/40 text-indigo-300 border-2 border-indigo-800 hover:bg-indigo-900/60 pixel-shadow-sm",
		},
		clear: {
			id: "clear",
			label: "Clear",
			svgIcon: "/icons/pixel/ghost.svg",
			className:
				"h-9 px-4 bg-slate-800 border-2 border-slate-700 hover:border-amber-600 hover:text-amber-500 pixel-shadow-sm",
		},
		refresh: {
			id: "refresh",
			label: "Refresh",
			svgIcon: "/icons/pixel/coin.svg",
			className:
				"h-9 px-4 bg-slate-800 border-2 border-slate-700 hover:border-cyan-500 hover:text-cyan-400 pixel-shadow-sm",
			iconClassName: "animate-spin-slow",
		},
		copy: {
			id: "copy",
			label: "Copy",
			svgIcon: "/icons/pixel/gem.svg",
			className:
				"h-9 px-4 bg-slate-800 border-2 border-slate-700 hover:border-white pixel-shadow-sm",
		},
		save: {
			id: "save",
			label: "Save",
			svgIcon: "/icons/pixel/chest.svg",
			className:
				"h-9 px-4 bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 hover:text-emerald-400 pixel-shadow-sm",
		},
		send: {
			id: "send",
			label: "Send",
			svgIcon: "/icons/pixel/flag.svg",
			className:
				"h-9 px-4 bg-emerald-900/40 text-emerald-300 border-2 border-emerald-700 hover:bg-emerald-900/60 pixel-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			icon: Sparkles,
			className: "bg-rose-900/40 border-2 border-rose-800 active:bg-rose-900/60",
			iconColor: "text-rose-300",
		},
		quickFill: {
			id: "quick-fill",
			icon: Zap,
			className: "bg-indigo-900/40 border-2 border-indigo-800 active:bg-indigo-900/60",
			iconColor: "text-indigo-300",
		},
		clear: {
			id: "clear",
			icon: Trash2,
			className: "bg-slate-800 border-2 border-slate-700 active:border-amber-600",
			iconColor: "text-slate-300",
		},
		save: {
			id: "save",
			icon: Save,
			className: "bg-slate-800 border-2 border-slate-700 active:border-emerald-500",
			iconColor: "text-slate-300",
		},
		send: {
			id: "send",
			icon: Send,
			className: "bg-emerald-900/40 border-2 border-emerald-700 active:bg-emerald-900/60",
			iconColor: "text-emerald-300",
		},
	},
}

// ============================================================================
// Lunar Theme Configuration
// ============================================================================

const lunarThemeConfig: ThemeConfig = {
	header: {
		container:
			"h-12 sm:h-[52px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-stone-800/50 bg-stone-900/30 backdrop-blur-sm z-10",
		logo: {
			svgIcon: "/icons/lunar/lantern.svg",
			title: "text-2xl flex items-center gap-2 text-stone-200",
			titleGradient:
				"font-semibold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent",
		},
		badge: "text-xs font-bold px-2 py-0.5 lunar-badge",
		nav: {
			link: "text-stone-400 hover:text-amber-400 hover:bg-stone-800/50 transition-colors flex items-center gap-1",
			kbd: "hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-stone-500 bg-stone-900/50 border border-stone-800 rounded",
			kbdIcon: "/icons/lunar/knot.svg",
		},
	},
	layout: {
		body: "theme-lunar",
		background: "lunar-bg",
		mobileBar: "bg-stone-900/95 border-stone-800",
	},
	table: {
		container: "border border-stone-800/50 rounded-xl overflow-hidden",
		header: "bg-stone-900/50",
		headerCell: "text-amber-400/80 font-medium",
		row: "border-b border-stone-800/30 hover:bg-stone-800/30",
		cell: "text-stone-300",
		mobileCard: "bg-stone-900/50 border border-stone-800/50 rounded-xl",
		detailsButton: "text-stone-400 hover:text-amber-400 hover:bg-stone-800/50",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "Lucky Fill",
			svgIcon: "/icons/lunar/dragon.svg",
			className: "h-9 px-4 lunar-btn-primary text-white border-none",
			iconClassName: "w-5 h-4",
		},
		quickFill: {
			id: "quick-fill",
			label: "Fill",
			svgIcon: "/icons/lunar/red-envelope.svg",
			className:
				"h-9 px-4 text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg",
		},
		clear: {
			id: "clear",
			label: "Clear",
			svgIcon: "/icons/lunar/firecracker.svg",
			className:
				"h-9 px-4 text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg",
			iconClassName: "w-3 h-5",
		},
		refresh: {
			id: "refresh",
			label: "Refresh",
			svgIcon: "/icons/lunar/coin.svg",
			className:
				"h-9 px-4 text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg",
			iconClassName: "animate-spin-slow",
		},
		copy: {
			id: "copy",
			label: "Copy",
			svgIcon: "/icons/lunar/fan.svg",
			className:
				"h-9 px-4 text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg",
		},
		save: {
			id: "save",
			label: "Save",
			svgIcon: "/icons/lunar/gold-ingot.svg",
			className:
				"h-9 px-4 text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg",
			iconClassName: "w-5 h-4",
		},
		send: {
			id: "send",
			label: "Send",
			svgIcon: "/icons/lunar/koi.svg",
			className:
				"h-9 px-4 text-amber-200 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/50 rounded-lg",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			icon: Sparkles,
			className: "lunar-btn-primary active:opacity-80",
			iconColor: "text-white",
		},
		quickFill: {
			id: "quick-fill",
			icon: Zap,
			className: "bg-stone-800/50 border border-stone-700 active:bg-stone-800",
			iconColor: "text-stone-300",
		},
		clear: {
			id: "clear",
			icon: Trash2,
			className: "bg-stone-800/50 border border-stone-700 active:bg-stone-800",
			iconColor: "text-stone-300",
		},
		save: {
			id: "save",
			icon: Save,
			className: "bg-stone-800/50 border border-stone-700 active:bg-stone-800",
			iconColor: "text-stone-300",
		},
		send: {
			id: "send",
			icon: Send,
			className: "bg-amber-900/30 border border-amber-700/50 active:bg-amber-900/50",
			iconColor: "text-amber-200",
		},
	},
}

// ============================================================================
// Christmas Theme Configuration
// ============================================================================

const christmasThemeConfig: ThemeConfig = {
	header: {
		container:
			"h-12 sm:h-[52px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-white/20 bg-black/20 backdrop-blur-sm z-10",
		logo: {
			svgIcon: "/icons/christmas/tree.svg",
			title: "text-2xl flex items-center gap-2 text-white",
			titleGradient: "font-semibold christmas-title-gradient",
		},
		badge: "text-xs font-bold px-2 py-0.5 text-white/80 bg-white/10 rounded-full",
		nav: {
			link: "text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1",
			kbd: "hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-white/70 bg-white/10 border border-white/20 rounded",
			kbdIcon: "/icons/christmas/gingerbread.svg",
		},
	},
	layout: {
		body: "theme-christmas",
		background: "christmas-bg",
		mobileBar: "bg-background/95 border-border",
	},
	table: {
		container: "border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm",
		header: "bg-black/30",
		headerCell: "text-white/70 font-medium",
		row: "border-b border-white/10 hover:bg-white/5",
		cell: "text-white/90",
		mobileCard: "bg-black/30 border border-white/10 rounded-xl backdrop-blur-sm",
		detailsButton: "text-white/70 hover:text-white hover:bg-white/10",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "Santa Fill",
			svgIcon: "/icons/christmas/santa.svg",
			className:
				"h-9 px-4 text-red-100 bg-red-900/50 hover:bg-red-900/70 border border-red-500/30 snow-btn",
		},
		quickFill: {
			id: "quick-fill",
			label: "Fill",
			svgIcon: "/icons/christmas/snowflake.svg",
			className:
				"h-9 px-4 text-blue-100 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-500/30 snow-btn",
			iconClassName: "animate-spin-slow",
		},
		clear: {
			id: "clear",
			label: "Clear",
			svgIcon: "/icons/christmas/bell.svg",
			className:
				"h-9 px-4 text-yellow-100 bg-yellow-900/50 hover:bg-yellow-900/70 border border-yellow-500/30 snow-btn",
		},
		refresh: {
			id: "refresh",
			label: "Refresh",
			svgIcon: "/icons/christmas/ornament.svg",
			className:
				"h-9 px-4 text-purple-100 bg-purple-900/50 hover:bg-purple-900/70 border border-purple-500/30 snow-btn",
			iconClassName: "animate-bounce",
		},
		copy: {
			id: "copy",
			label: "Copy",
			svgIcon: "/icons/christmas/candy-cane.svg",
			className:
				"h-9 px-4 text-cyan-100 bg-cyan-900/50 hover:bg-cyan-900/70 border border-cyan-500/30 snow-btn",
		},
		save: {
			id: "save",
			label: "Save",
			svgIcon: "/icons/christmas/gift.svg",
			className:
				"h-9 px-4 text-emerald-100 bg-emerald-900/50 hover:bg-emerald-900/70 border border-emerald-500/30 snow-btn",
		},
		send: {
			id: "send",
			label: "Send",
			svgIcon: "/icons/christmas/sleigh.svg",
			className:
				"h-9 px-4 bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-900/20 snow-btn",
			iconClassName: "w-5 h-4",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			icon: Snowflake,
			className: "bg-red-900/40 border border-red-500/30 active:bg-red-900/80",
			iconColor: "text-red-200",
		},
		quickFill: {
			id: "quick-fill",
			icon: Zap,
			className: "bg-blue-900/40 border border-blue-500/30 active:bg-blue-900/80",
			iconColor: "text-blue-200",
		},
		clear: {
			id: "clear",
			icon: Trash2,
			className: "bg-yellow-900/40 border border-yellow-500/30 active:bg-yellow-900/80",
			iconColor: "text-yellow-200",
		},
		save: {
			id: "save",
			icon: Save,
			className: "bg-emerald-900/40 border border-emerald-500/30 active:bg-emerald-900/80",
			iconColor: "text-emerald-200",
		},
		send: {
			id: "send",
			icon: Send,
			className: "bg-green-600 active:bg-green-700 text-white shadow-lg shadow-green-900/20",
			iconColor: "text-white",
		},
	},
}

// ============================================================================
// Clash Theme Configuration (Clash of Clans Style - 100% COC)
// ============================================================================

const clashThemeConfig: ThemeConfig = {
	header: {
		container:
			"h-14 sm:h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-8 border-b-4 border-[#6a5a4a] bg-gradient-to-b from-[#4a3a2a] to-[#3f2e21] backdrop-blur-sm z-10 shadow-lg",
		logo: {
			title: "text-xl clash-title tracking-tight",
			subtitle: "text-[10px] text-[#daa520] font-medium -mt-0.5 hidden sm:block uppercase tracking-wider",
			svgIcon: "/icons/clash/castle.svg",
		},
		badge: "clash-badge",
		nav: {
			link: "text-white hover:text-[#fbcc14] transition-all font-bold uppercase tracking-wide hover:scale-105",
			kbd: "hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[#fbcc14] bg-[#2a1f16] border-2 border-[#6a5a4a] rounded-md font-bold shadow-inner",
			kbdIcon: "/icons/clash/star.svg",
		},
	},
	layout: {
		body: "theme-clash",
		background: "clash-bg",
		mobileBar: "bg-gradient-to-b from-[#4a3a2a] to-[#3f2e21] border-t-4 border-[#6a5a4a]",
	},
	table: {
		container: "clash-card overflow-hidden",
		header: "clash-table-header",
		headerCell: "text-[#fbcc14] font-bold uppercase text-xs tracking-wider",
		row: "clash-table-row",
		cell: "text-white font-medium",
		mobileCard: "clash-card",
		detailsButton: "clash-btn-wood text-sm py-1 px-3",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "Raid",
			svgIcon: "/icons/clash/sword.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		quickFill: {
			id: "quick-fill",
			label: "Train",
			svgIcon: "/icons/clash/barbarian.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		clear: {
			id: "clear",
			label: "Destroy",
			svgIcon: "/icons/clash/hammer.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		refresh: {
			id: "refresh",
			label: "Scout",
			svgIcon: "/icons/clash/trophy.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		copy: {
			id: "copy",
			label: "Clone",
			svgIcon: "/icons/clash/elixir.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		save: {
			id: "save",
			label: "Build",
			svgIcon: "/icons/clash/shield.svg",
			className: "h-10 px-5 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
		send: {
			id: "send",
			label: "Attack!",
			svgIcon: "/icons/clash/sword.svg",
			className: "h-10 px-6 clash-btn-primary",
			iconClassName: "w-5 h-5",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			icon: Sword,
			className: "clash-btn-primary !p-3 !rounded-xl !mb-0",
			iconColor: "text-white",
		},
		quickFill: {
			id: "quick-fill",
			icon: Hammer,
			className: "clash-btn-primary !p-3 !rounded-xl !mb-0",
			iconColor: "text-white",
		},
		clear: {
			id: "clear",
			icon: Trash2,
			className: "clash-btn-primary !p-3 !rounded-xl !mb-0",
			iconColor: "text-white",
		},
		save: {
			id: "save",
			icon: Shield,
			className: "clash-btn-primary !p-3 !rounded-xl !mb-0",
			iconColor: "text-white",
		},
		send: {
			id: "send",
			icon: Send,
			className: "clash-btn-primary !p-3 !rounded-xl !mb-0",
			iconColor: "text-white",
		},
	},
}

// ============================================================================
// Coding Theme Configuration
// ============================================================================

const codingThemeConfig: ThemeConfig = {
	header: {
		container:
			"flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-sm z-10",
		logo: {
			wrapper:
				"w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors",
			svgIcon: "/icons/coding/terminal.svg",
			title: "text-sm font-semibold tracking-tight text-zinc-100",
		},
		badge:
			"bg-zinc-900 text-zinc-400 text-[10px] px-2 py-0.5 rounded border border-zinc-700 font-medium font-mono flex items-center gap-1",
		nav: {
			link: "flex items-center gap-2 text-xs text-zinc-500 hover:text-indigo-400 transition-colors font-mono",
			kbd: "hidden sm:flex items-center justify-center w-6 h-6 rounded border border-zinc-800 text-[10px] text-zinc-500 font-bold bg-zinc-900",
			kbdIcon: "/icons/coding/keyboard.svg",
		},
	},
	layout: {
		body: "theme-coding",
		background: "coding-bg",
		mobileBar: "bg-black/95 border-green-900/30",
	},
	table: {
		container: "border border-zinc-800 rounded-lg overflow-hidden font-mono",
		header: "bg-zinc-900",
		headerCell: "text-indigo-400 font-medium text-xs uppercase",
		row: "border-b border-zinc-800 hover:bg-zinc-900/50",
		cell: "text-zinc-300 text-sm",
		mobileCard: "bg-zinc-900 border border-zinc-800 rounded-lg font-mono",
		detailsButton: "text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "Macro Fill",
			svgIcon: "/icons/coding/function.svg",
			className: "h-9 px-4 coding-btn font-mono",
		},
		quickFill: {
			id: "quick-fill",
			label: "Auto-Fix",
			svgIcon: "/icons/coding/api.svg",
			className: "h-9 px-4 coding-btn font-mono",
		},
		clear: {
			id: "clear",
			label: "Drop",
			svgIcon: "/icons/coding/bug.svg",
			className: "h-9 px-4 coding-btn font-mono hover:text-red-500 hover:border-red-500/50",
		},
		refresh: {
			id: "refresh",
			label: "Reload",
			svgIcon: "/icons/coding/deploy.svg",
			className: "h-9 px-4 coding-btn font-mono",
		},
		copy: {
			id: "copy",
			label: "Copy",
			svgIcon: "/icons/coding/code-brackets.svg",
			className: "h-9 px-4 coding-btn font-mono",
		},
		save: {
			id: "save",
			label: "Save",
			svgIcon: "/icons/coding/database.svg",
			className: "h-9 px-4 coding-btn font-mono",
		},
		send: {
			id: "send",
			label: "Commit",
			svgIcon: "/icons/coding/commit.svg",
			className:
				"h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white border-none font-mono font-medium",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			icon: Bug,
			className: "coding-btn-primary active:opacity-80",
			iconColor: "text-green-400",
		},
		quickFill: {
			id: "quick-fill",
			icon: Zap,
			className: "bg-black border border-green-900/50 active:bg-green-900/20",
			iconColor: "text-green-500/80",
		},
		clear: {
			id: "clear",
			icon: Trash2,
			className: "bg-black border border-green-900/50 active:bg-green-900/20",
			iconColor: "text-green-500/80",
		},
		save: {
			id: "save",
			icon: Save,
			className: "bg-black border border-green-900/50 active:bg-green-900/20",
			iconColor: "text-green-500/80",
		},
		send: {
			id: "send",
			icon: Send,
			className: "bg-green-600 border border-green-500 active:bg-green-500",
			iconColor: "text-black",
		},
	},
}

// ============================================================================
// Theme Config Map
// ============================================================================

const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
	default: defaultThemeConfig,
	pixel: pixelThemeConfig,
	lunar: lunarThemeConfig,
	christmas: christmasThemeConfig,
	coding: codingThemeConfig,
	clash: clashThemeConfig,
}

// ============================================================================
// Exports
// ============================================================================

export const getThemeConfig = (theme: Theme): ThemeConfig => {
	return THEME_CONFIGS[theme] ?? defaultThemeConfig
}

export const getHeaderConfig = (theme: Theme): ThemeHeaderConfig => {
	return getThemeConfig(theme).header
}

export const getLayoutConfig = (theme: Theme): ThemeLayoutConfig => {
	return getThemeConfig(theme).layout
}

export const getTableConfig = (theme: Theme): ThemeTableConfig => {
	return getThemeConfig(theme).table
}

export const getActionsConfig = (theme: Theme) => {
	return getThemeConfig(theme).actions
}

export const getMobileActionsConfig = (theme: Theme) => {
	return getThemeConfig(theme).mobileActions
}

// Header navigation items config
export interface HeaderNavItem {
	href: string
	label: string
	svgIcon?: string
	icon?: LucideIcon
}

export const getHeaderNavItems = (theme: Theme): HeaderNavItem[] => {
	if (theme === "coding") {
		return [
			{ href: "/feedback", label: "Issues", svgIcon: "/icons/coding/bug.svg" },
			{ href: "/changelog", label: "Branches", svgIcon: "/icons/coding/merge.svg" },
		]
	}
	if (theme === "pixel") {
		return [
			{ href: "/feedback", label: "Feedback", svgIcon: "/icons/pixel/ghost.svg" },
			{ href: "/changelog", label: "Changelog", svgIcon: "/icons/pixel/flag.svg" },
		]
	}
	if (theme === "lunar") {
		return [
			{ href: "/feedback", label: "Feedback", svgIcon: "/icons/lunar/fan.svg" },
			{ href: "/changelog", label: "Changelog", svgIcon: "/icons/lunar/drum.svg" },
		]
	}
	if (theme === "christmas") {
		return [
			{ href: "/feedback", label: "Feedback", svgIcon: "/icons/christmas/gift.svg" },
			{ href: "/changelog", label: "Changelog", svgIcon: "/icons/christmas/holly.svg" },
		]
	}
	if (theme === "clash") {
		return [
			{ href: "/feedback", label: "War Log", svgIcon: "/icons/clash/shield.svg" },
			{ href: "/changelog", label: "News", svgIcon: "/icons/clash/trophy.svg" },
		]
	}
	return [
		{ href: "/feedback", label: "Feedback", icon: MessageSquare },
		{ href: "/changelog", label: "Changelog", icon: FileText },
	]
}

export const getKbdIcon = (theme: Theme): { icon?: LucideIcon; svgIcon?: string } => {
	const config = getHeaderConfig(theme)
	if (config.nav.kbdIcon) {
		return { svgIcon: config.nav.kbdIcon }
	}
	return { icon: Command }
}

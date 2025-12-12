import { Zap, Trash2, Save, Send, Snowflake } from "lucide-react"
import type { ThemeConfig } from "../types"

export const christmasThemeConfig: ThemeConfig = {
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

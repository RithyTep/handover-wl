import { Zap, Trash2, Save, Send, Sparkles } from "lucide-react"
import type { ThemeConfig } from "../types"

export const lunarThemeConfig: ThemeConfig = {
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

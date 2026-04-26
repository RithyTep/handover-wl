import { Send, Sparkles, Trash2, Save, RefreshCw } from "lucide-react"
import type { ThemeConfig } from "../types"

export const sakuraThemeConfig: ThemeConfig = {
	header: {
		container:
			"h-12 sm:h-[52px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-rose-200/80 bg-white/70 backdrop-blur-md z-10 shadow-[0_8px_30px_rgba(251,113,133,0.08)]",
		logo: {
			svgIcon: "/icons/sakura/blossom.svg",
			title: "text-2xl flex items-center gap-2 text-rose-950",
			titleGradient:
				"font-semibold bg-gradient-to-r from-rose-500 via-pink-400 to-fuchsia-300 bg-clip-text text-transparent",
		},
		badge:
			"text-xs font-semibold px-2 py-0.5 text-rose-500 bg-rose-100/80 border border-rose-200 rounded-full",
		nav: {
			link: "text-rose-500 hover:text-rose-600 hover:bg-white/70 transition-colors flex items-center gap-1 rounded-md",
			kbd: "hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-rose-400 bg-white/80 border border-rose-200 rounded-md shadow-sm",
			kbdIcon: "/icons/sakura/kbd-sakura.svg",
		},
	},
	layout: {
		body: "theme-sakura",
		background: "sakura-layout-bg",
		mobileBar: "bg-white/90 border-rose-200/90 shadow-[0_-10px_30px_rgba(244,114,182,0.08)]",
	},
	table: {
		container: "border border-rose-200/80 rounded-[1.25rem] overflow-hidden bg-white/60 backdrop-blur-sm shadow-[0_12px_40px_rgba(244,114,182,0.08)]",
		header: "bg-white/75",
		headerCell: "text-rose-400 font-medium",
		row: "border-b border-rose-100 hover:bg-rose-50/80",
		cell: "text-stone-700",
		mobileCard: "bg-white/70 border border-rose-200/80 rounded-xl shadow-sm",
		detailsButton: "text-rose-400 hover:text-rose-500 hover:bg-rose-100/70",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "Petal Fill",
			svgIcon: "/icons/sakura/blossom.svg",
			className: "h-9 px-4 text-white bg-gradient-to-r from-rose-400 to-pink-300 hover:from-rose-500 hover:to-pink-400 border-none shadow-[0_10px_24px_rgba(244,114,182,0.28)] rounded-xl",
		},
		quickFill: {
			id: "quick-fill",
			label: "Fill",
			svgIcon: "/icons/sakura/petal.svg",
			className: "h-9 px-4 text-rose-500 bg-white/85 hover:bg-rose-50 border border-rose-200 rounded-xl shadow-sm",
		},
		clear: {
			id: "clear",
			label: "Clear",
			svgIcon: "/icons/sakura/stamp.svg",
			className: "h-9 px-4 text-rose-500 bg-white/85 hover:bg-rose-50 border border-rose-200 rounded-xl shadow-sm",
		},
		refresh: {
			id: "refresh",
			label: "Refresh",
			icon: RefreshCw,
			className: "h-9 px-4 text-rose-500 bg-white/85 hover:bg-rose-50 border border-rose-200 rounded-xl shadow-sm",
		},
		copy: {
			id: "copy",
			label: "Copy",
			svgIcon: "/icons/sakura/fan.svg",
			className: "h-9 px-4 text-rose-500 bg-white/85 hover:bg-rose-50 border border-rose-200 rounded-xl shadow-sm",
		},
		save: {
			id: "save",
			label: "Save",
			svgIcon: "/icons/sakura/fan.svg",
			className: "h-9 px-4 text-rose-500 bg-white/85 hover:bg-rose-50 border border-rose-200 rounded-xl shadow-sm",
		},
		send: {
			id: "send",
			label: "Send",
			svgIcon: "/icons/sakura/branch.svg",
			className: "h-9 px-4 text-white bg-rose-400 hover:bg-rose-500 border-none shadow-[0_10px_24px_rgba(251,113,133,0.22)] rounded-xl",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			icon: Sparkles,
			className: "bg-rose-400/20 border border-rose-300 active:bg-rose-400/30 shadow-sm",
			iconColor: "text-rose-500",
		},
		quickFill: {
			id: "quick-fill",
			icon: Sparkles,
			className: "bg-white/90 border border-rose-200 active:bg-rose-50 shadow-sm",
			iconColor: "text-rose-500",
		},
		clear: {
			id: "clear",
			icon: Trash2,
			className: "bg-white/90 border border-rose-200 active:bg-rose-50 shadow-sm",
			iconColor: "text-rose-500",
		},
		save: {
			id: "save",
			icon: Save,
			className: "bg-white/90 border border-rose-200 active:bg-rose-50 shadow-sm",
			iconColor: "text-rose-500",
		},
		send: {
			id: "send",
			icon: Send,
			className: "bg-rose-400 active:bg-rose-500 shadow-[0_8px_18px_rgba(251,113,133,0.18)]",
			iconColor: "text-white",
		},
	},
}

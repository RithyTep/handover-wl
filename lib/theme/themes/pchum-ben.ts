import { Zap, Trash2, Save, Send, Sparkles } from "lucide-react"
import type { ThemeConfig } from "../types"

export const pchumBenThemeConfig: ThemeConfig = {
	header: {
		container:
			"h-14 sm:h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-8 border-b border-[#d4af37]/30 bg-gradient-to-b from-[#241030] to-[#1b0b26] backdrop-blur-sm z-10 shadow-lg",
		logo: {
			svgIcon: "/icons/pchum-ben/temple.svg",
			title: "text-xl flex items-center gap-2 font-bold text-[#f0e6d2] tracking-tight",
			subtitle:
				"text-[10px] text-[#e8b64c] font-medium -mt-0.5 hidden sm:block uppercase tracking-wider",
		},
		badge: "text-xs font-bold px-2 py-0.5 pchum-badge",
		nav: {
			link: "text-[#f0e6d2]/90 hover:text-[#e8b64c] transition-colors font-semibold uppercase tracking-wide flex items-center gap-1",
			kbd: "hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[#e8b64c] bg-[#1b0b26] border border-[#d4af37]/40 rounded-md font-bold",
			kbdIcon: "/icons/pchum-ben/moon.svg",
		},
	},
	layout: {
		body: "theme-pchum_ben",
		background: "pchum-bg",
		mobileBar: "bg-gradient-to-b from-[#241030] to-[#1b0b26] border-t border-[#d4af37]/30",
	},
	table: {
		container: "pchum-card overflow-hidden",
		header: "pchum-table-header",
		headerCell: "text-[#e8b64c] font-semibold uppercase tracking-wide",
		row: "border-b border-[#d4af37]/15 hover:bg-[#3a1745]/40",
		cell: "text-[#f0e6d2]",
		mobileCard: "pchum-card",
		detailsButton: "text-[#e8b64c] hover:text-[#f5d78a] hover:bg-[#3a1745]/50 border border-[#d4af37]/40 rounded-full",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "Harvest",
			svgIcon: "/icons/pchum-ben/bay-ben.svg",
			className: "h-9 px-4 pchum-btn",
			iconClassName: "w-5 h-4",
		},
		quickFill: {
			id: "quick-fill",
			label: "Craft",
			svgIcon: "/icons/pchum-ben/lotus.svg",
			className: "h-9 px-4 pchum-btn",
			iconClassName: "w-5 h-4",
		},
		clear: {
			id: "clear",
			label: "Destroy",
			svgIcon: "/icons/pchum-ben/incense.svg",
			className: "h-9 px-4 pchum-btn",
			iconClassName: "w-3 h-5",
		},
		refresh: {
			id: "refresh",
			label: "Explore",
			svgIcon: "/icons/pchum-ben/moon.svg",
			className: "h-9 px-4 pchum-btn",
			iconClassName: "animate-spin-slow",
		},
		copy: {
			id: "copy",
			label: "Clone",
			svgIcon: "/icons/pchum-ben/temple.svg",
			className: "h-9 px-4 pchum-btn",
		},
		save: {
			id: "save",
			label: "Store",
			svgIcon: "/icons/pchum-ben/alms-bowl.svg",
			className: "h-9 px-4 pchum-btn",
			iconClassName: "w-5 h-4",
		},
		send: {
			id: "send",
			label: "Attack!",
			svgIcon: "/icons/pchum-ben/candle.svg",
			className: "h-9 px-4 pchum-btn pchum-btn-primary",
			iconClassName: "w-3.5 h-5",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			icon: Sparkles,
			className: "pchum-btn-primary active:opacity-80",
			iconColor: "text-[#f5d78a]",
		},
		quickFill: {
			id: "quick-fill",
			icon: Zap,
			className: "bg-[#2a1233] border border-[#d4af37]/40 active:bg-[#3a1745]",
			iconColor: "text-[#e8b64c]",
		},
		clear: {
			id: "clear",
			icon: Trash2,
			className: "bg-[#2a1233] border border-[#d4af37]/40 active:bg-[#3a1745]",
			iconColor: "text-[#e8b64c]",
		},
		save: {
			id: "save",
			icon: Save,
			className: "bg-[#2a1233] border border-[#d4af37]/40 active:bg-[#3a1745]",
			iconColor: "text-[#e8b64c]",
		},
		send: {
			id: "send",
			icon: Send,
			className: "bg-[#2a1233] border border-[#e8b64c]/60 active:bg-[#3a1745]",
			iconColor: "text-[#f5d78a]",
		},
	},
}

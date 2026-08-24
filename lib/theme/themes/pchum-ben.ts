import { Zap, Trash2, RefreshCw, Copy, Save, Send, Flame } from "lucide-react"
import type { ThemeConfig } from "../types"

export const pchumBenThemeConfig: ThemeConfig = {
	header: {
		container:
			"h-12 sm:h-[52px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-violet-950/60 bg-[#120c1c]/60 backdrop-blur-sm z-10",
		logo: {
			title: "text-2xl flex items-center gap-2 text-amber-100",
			titleGradient:
				"font-semibold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent",
		},
		badge: "text-xs font-bold px-2 py-0.5 pchum-badge",
		nav: {
			link: "text-violet-300/70 hover:text-amber-300 hover:bg-violet-950/40 transition-colors flex items-center gap-1",
			kbd: "hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-violet-400/60 bg-[#120c1c]/70 border border-violet-950/60 rounded",
		},
	},
	layout: {
		body: "theme-pchum_ben",
		background: "pchum-bg",
		mobileBar: "bg-[#120c1c]/95 border-violet-950/60",
	},
	table: {
		container: "border border-violet-950/50 rounded-xl overflow-hidden",
		header: "bg-[#181026]/70",
		headerCell: "text-amber-300/80 font-medium",
		row: "border-b border-violet-950/40 hover:bg-violet-950/30",
		cell: "text-violet-100/80",
		mobileCard: "bg-[#181026]/70 border border-violet-950/50 rounded-xl",
		detailsButton: "text-violet-300/70 hover:text-amber-300 hover:bg-violet-950/40",
	},
	actions: {
		aiFill: {
			id: "ai-fill",
			label: "Blessing Fill",
			icon: Flame,
			className: "h-9 px-4 pchum-btn-primary text-white border-none",
		},
		quickFill: {
			id: "quick-fill",
			label: "Fill",
			icon: Zap,
			className:
				"h-9 px-4 text-violet-100/80 bg-violet-950/40 hover:bg-violet-950/60 border border-violet-900/50 rounded-lg",
		},
		clear: {
			id: "clear",
			label: "Clear",
			icon: Trash2,
			className:
				"h-9 px-4 text-violet-100/80 bg-violet-950/40 hover:bg-violet-950/60 border border-violet-900/50 rounded-lg",
		},
		refresh: {
			id: "refresh",
			label: "Refresh",
			icon: RefreshCw,
			className:
				"h-9 px-4 text-violet-100/80 bg-violet-950/40 hover:bg-violet-950/60 border border-violet-900/50 rounded-lg",
		},
		copy: {
			id: "copy",
			label: "Copy",
			icon: Copy,
			className:
				"h-9 px-4 text-violet-100/80 bg-violet-950/40 hover:bg-violet-950/60 border border-violet-900/50 rounded-lg",
		},
		save: {
			id: "save",
			label: "Save",
			icon: Save,
			className:
				"h-9 px-4 text-violet-100/80 bg-violet-950/40 hover:bg-violet-950/60 border border-violet-900/50 rounded-lg",
		},
		send: {
			id: "send",
			label: "Send",
			icon: Send,
			className:
				"h-9 px-4 text-amber-200 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/50 rounded-lg",
		},
	},
	mobileActions: {
		aiFill: {
			id: "ai-fill",
			icon: Flame,
			className: "pchum-btn-primary active:opacity-80",
			iconColor: "text-white",
		},
		quickFill: {
			id: "quick-fill",
			icon: Zap,
			className: "bg-violet-950/40 border border-violet-900/50 active:bg-violet-950/60",
			iconColor: "text-violet-100/80",
		},
		clear: {
			id: "clear",
			icon: Trash2,
			className: "bg-violet-950/40 border border-violet-900/50 active:bg-violet-950/60",
			iconColor: "text-violet-100/80",
		},
		save: {
			id: "save",
			icon: Save,
			className: "bg-violet-950/40 border border-violet-900/50 active:bg-violet-950/60",
			iconColor: "text-violet-100/80",
		},
		send: {
			id: "send",
			icon: Send,
			className: "bg-amber-900/30 border border-amber-700/50 active:bg-amber-900/50",
			iconColor: "text-amber-200",
		},
	},
}

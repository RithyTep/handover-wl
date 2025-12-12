import { Zap, Trash2, RefreshCw, Copy, Save, Send, Sparkles } from "lucide-react"
import type { ThemeConfig } from "../types"

export const defaultThemeConfig: ThemeConfig = {
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

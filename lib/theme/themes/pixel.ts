/**
 * Pixel Theme Configuration
 */

import { Zap, Trash2, Save, Send, Sparkles } from "lucide-react"
import type { ThemeConfig } from "../types"

export const pixelThemeConfig: ThemeConfig = {
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

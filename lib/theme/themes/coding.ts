/**
 * Coding Theme Configuration
 */

import { Zap, Trash2, Save, Send, Bug } from "lucide-react"
import type { ThemeConfig } from "../types"

export const codingThemeConfig: ThemeConfig = {
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

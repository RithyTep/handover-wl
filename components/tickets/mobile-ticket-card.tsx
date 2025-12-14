"use client"

import { flexRender } from "@tanstack/react-table"
import type { Row } from "@tanstack/react-table"
import type { Ticket } from "@/lib/types"
import type { Theme } from "@/enums"

interface MobileTicketCardProps<TData> {
	row: Row<TData>
	index: number
	theme: Theme
}

// Theme-specific style mappings - keys must match Theme enum values
const themeStyles: Record<string, Record<string, string>> = {
	card: {
		christmas: "border-white/20",
		lunar: "border-stone-800/50 lunar-card",
		coding: "border-green-900/30 coding-card",
		clash: "clash-card",
		angkor_pixel: "angkor-pixel-mobile-card",
		pixel: "border-slate-700 bg-slate-900",
		default: "border-slate-700 bg-slate-900 default-mobile-card",
	},
	header: {
		christmas: "border-white/20 bg-black/10",
		lunar: "border-stone-800/50 bg-stone-900/30",
		coding: "border-green-900/30 bg-black/50",
		clash: "clash-table-header",
		angkor_pixel: "border-[#8b7355] bg-[#3a2a1a]",
		pixel: "border-slate-600 bg-slate-800/90",
		default: "border-slate-600 bg-slate-800/90",
	},
	indexNumber: {
		christmas: "text-white/80",
		lunar: "text-stone-500",
		coding: "text-green-600/70 font-mono",
		clash: "text-[#fbcc14]",
		angkor_pixel: "text-[#d4af37]",
		pixel: "text-slate-300",
		default: "text-slate-300",
	},
	ticketLink: {
		christmas: "text-white hover:text-white/80",
		lunar: "text-amber-400 hover:text-amber-300",
		coding: "text-green-500/80 hover:text-green-400 font-mono",
		clash: "text-white hover:text-[#fbcc14]",
		angkor_pixel: "text-[#ffd700] hover:text-[#fff0a0]",
		pixel: "text-sky-400 hover:text-sky-300",
		default: "text-sky-400 hover:text-sky-300",
	},
	avatarRing: {
		christmas: "ring-white/30",
		lunar: "ring-stone-700",
		coding: "ring-green-900/50",
		clash: "ring-[#fbcc14]",
		angkor_pixel: "ring-[#8b7355]",
		pixel: "ring-slate-600",
		default: "ring-slate-600",
	},
	avatarPlaceholder: {
		christmas: "bg-white/20 text-white",
		lunar: "bg-stone-800 text-stone-400",
		coding: "bg-green-900/30 text-green-500/80 font-mono",
		clash: "bg-black/30 text-[#fbcc14] font-bold",
		angkor_pixel: "bg-[#3a2a1a] text-[#ffd700] font-bold",
		pixel: "bg-slate-600 text-white",
		default: "bg-slate-600 text-white",
	},
	summary: {
		christmas: "text-white/90",
		lunar: "text-stone-300",
		coding: "text-green-400/80",
		clash: "text-white/90",
		angkor_pixel: "text-[#f5e6d3]",
		pixel: "text-slate-100",
		default: "text-slate-100",
	},
	label: {
		christmas: "text-white/70",
		lunar: "text-stone-500",
		coding: "text-green-600/70 font-mono",
		clash: "text-[#fbcc14]",
		angkor_pixel: "text-[#d4af37]",
		pixel: "text-slate-400",
		default: "text-slate-400",
	},
}

function getThemeStyle(category: keyof typeof themeStyles, theme: Theme): string {
	return themeStyles[category][theme] || themeStyles[category].default
}

function getChristmasRowClass(index: number): string {
	if (index % 3 === 0) return "christmas-row-gold"
	if (index % 3 === 1) return "christmas-row-red"
	return "christmas-row-green"
}

export function MobileTicketCard<TData>({
	row,
	index,
	theme,
}: MobileTicketCardProps<TData>) {
	const ticket = row.original as Ticket
	const cardClass = theme === "christmas" ? getChristmasRowClass(index) : ""

	return (
		<div className={`border rounded-lg overflow-hidden shadow-sm ${getThemeStyle("card", theme)} ${cardClass}`}>
			<div className={`flex items-center justify-between px-4 py-3 border-b ${getThemeStyle("header", theme)}`}>
				<div className="flex items-center gap-2.5">
					<span className={`text-[11px] font-medium tabular-nums ${getThemeStyle("indexNumber", theme)}`}>
						{index + 1}
					</span>
					<a
						href={ticket.jiraUrl}
						target="_blank"
						rel="noopener noreferrer"
						className={`text-sm font-semibold transition-colors ${getThemeStyle("ticketLink", theme)}`}
					>
						{ticket.key}
					</a>
				</div>
				<div className="flex items-center gap-2">
					{ticket.assigneeAvatar ? (
						<img
							src={ticket.assigneeAvatar}
							alt={ticket.assignee}
							className={`w-5 h-5 rounded-full ring-1 ${getThemeStyle("avatarRing", theme)}`}
						/>
					) : (
						<div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium ${getThemeStyle("avatarPlaceholder", theme)}`}>
							{ticket.assignee === "Unassigned" ? "?" : ticket.assignee.charAt(0).toUpperCase()}
						</div>
					)}
				</div>
			</div>

			<div className="p-4 space-y-4">
				<p className={`text-[13px] leading-relaxed line-clamp-2 ${getThemeStyle("summary", theme)}`}>
					{ticket.summary}
				</p>

				<div className="space-y-3">
					<div>
						<label className={`text-[10px] font-medium uppercase tracking-wider mb-1.5 block ${getThemeStyle("label", theme)}`}>
							Status
						</label>
						{row.getVisibleCells()
							.filter((cell) => cell.column.id === "savedStatus")
							.map((cell) => (
								<div key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</div>
							))}
					</div>
					<div>
						<label className={`text-[10px] font-medium uppercase tracking-wider mb-1.5 block ${getThemeStyle("label", theme)}`}>
							Action
						</label>
						{row.getVisibleCells()
							.filter((cell) => cell.column.id === "savedAction")
							.map((cell) => (
								<div key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	)
}

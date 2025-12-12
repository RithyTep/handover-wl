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

export function MobileTicketCard<TData>({
	row,
	index,
	theme,
}: MobileTicketCardProps<TData>) {
	const ticket = row.original as Ticket

	let cardClass = ""
	if (theme === "christmas") {
		if (index % 3 === 0) cardClass = "christmas-row-gold"
		else if (index % 3 === 1) cardClass = "christmas-row-red"
		else cardClass = "christmas-row-green"
	}

	return (
		<div
			className={`border rounded-lg overflow-hidden shadow-sm ${
				theme === "christmas"
					? "border-white/20"
					: theme === "lunar"
						? "border-stone-800/50 lunar-card"
						: theme === "coding"
							? "border-green-900/30 coding-card"
							: theme === "clash"
								? "clash-card"
								: theme === "angkor_pixel"
									? "angkor-pixel-mobile-card"
									: "border-slate-700 bg-slate-900 default-mobile-card"
			} ${cardClass}`}
		>
			<div
				className={`flex items-center justify-between px-4 py-3 border-b ${
					theme === "christmas"
						? "border-white/20 bg-black/10"
						: theme === "lunar"
							? "border-stone-800/50 bg-stone-900/30"
							: theme === "coding"
								? "border-green-900/30 bg-black/50"
								: theme === "clash"
									? "clash-table-header"
									: theme === "angkor_pixel"
										? "border-[#8b7355] bg-[#3a2a1a]"
										: "border-slate-600 bg-slate-800/90"
				}`}
			>
				<div className="flex items-center gap-2.5">
					<span
						className={`text-[11px] font-medium tabular-nums ${
							theme === "christmas"
								? "text-white/80"
								: theme === "lunar"
									? "text-stone-500"
									: theme === "coding"
										? "text-green-600/70 font-mono"
										: theme === "clash"
											? "text-[#fbcc14]"
											: theme === "angkor_pixel"
												? "text-[#d4af37]"
												: theme === "default"
													? "text-slate-300"
													: "text-slate-400"
						}`}
					>
						{index + 1}
					</span>
					<a
						href={ticket.jiraUrl}
						target="_blank"
						rel="noopener noreferrer"
						className={`text-sm font-semibold transition-colors ${
							theme === "christmas"
								? "text-white hover:text-white/80"
								: theme === "lunar"
									? "text-amber-400 hover:text-amber-300"
									: theme === "coding"
										? "text-green-500/80 hover:text-green-400 font-mono"
										: theme === "clash"
											? "text-white hover:text-[#fbcc14]"
											: theme === "angkor_pixel"
												? "text-[#ffd700] hover:text-[#fff0a0]"
												: theme === "default"
													? "text-sky-400 hover:text-sky-300"
													: "text-blue-400 hover:text-blue-300"
						}`}
					>
						{ticket.key}
					</a>
				</div>
				<div className="flex items-center gap-2">
					{ticket.assigneeAvatar ? (
						<img
							src={ticket.assigneeAvatar}
							alt={ticket.assignee}
							className={`w-5 h-5 rounded-full ring-1 ${
								theme === "christmas"
									? "ring-white/30"
									: theme === "lunar"
										? "ring-stone-700"
										: theme === "coding"
											? "ring-green-900/50"
											: theme === "clash"
												? "ring-[#fbcc14]"
												: theme === "angkor_pixel"
													? "ring-[#8b7355]"
													: "ring-slate-600"
							}`}
						/>
					) : (
						<div
							className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium ${
								theme === "christmas"
									? "bg-white/20 text-white"
									: theme === "lunar"
										? "bg-stone-800 text-stone-400"
										: theme === "coding"
											? "bg-green-900/30 text-green-500/80 font-mono"
											: theme === "clash"
												? "bg-black/30 text-[#fbcc14] font-bold"
												: theme === "angkor_pixel"
													? "bg-[#3a2a1a] text-[#ffd700] font-bold"
													: theme === "default"
														? "bg-slate-600 text-white"
														: "bg-slate-500 text-white"
							}`}
						>
							{ticket.assignee === "Unassigned"
								? "?"
								: ticket.assignee.charAt(0).toUpperCase()}
						</div>
					)}
				</div>
			</div>

			<div
				className={`p-4 space-y-4 ${
					theme === "christmas"
						? ""
						: theme === "lunar"
							? "bg-transparent"
							: theme === "coding"
								? "bg-transparent"
								: "bg-transparent"
				}`}
			>
				<p
					className={`text-[13px] leading-relaxed line-clamp-2 ${
						theme === "christmas"
							? "text-white/90"
							: theme === "lunar"
								? "text-stone-300"
								: theme === "coding"
									? "text-green-400/80"
									: theme === "clash"
										? "text-white/90"
										: theme === "angkor_pixel"
											? "text-[#f5e6d3]"
											: theme === "default"
												? "text-slate-100"
												: "text-slate-200"
					}`}
				>
					{ticket.summary}
				</p>

				<div className="space-y-3">
					<div>
						<label
							className={`text-[10px] font-medium uppercase tracking-wider mb-1.5 block ${
								theme === "christmas"
									? "text-white/70"
									: theme === "lunar"
										? "text-stone-500"
										: theme === "coding"
											? "text-green-600/70 font-mono"
											: theme === "clash"
												? "text-[#fbcc14]"
												: theme === "angkor_pixel"
													? "text-[#d4af37]"
													: theme === "default"
														? "text-slate-400"
														: "text-slate-500"
							}`}
						>
							Status
						</label>
						{row
							.getVisibleCells()
							.filter((cell) => cell.column.id === "savedStatus")
							.map((cell) => (
								<div key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</div>
							))}
					</div>
					<div>
						<label
							className={`text-[10px] font-medium uppercase tracking-wider mb-1.5 block ${
								theme === "christmas"
									? "text-white/70"
									: theme === "lunar"
										? "text-stone-500"
										: theme === "coding"
											? "text-green-600/70 font-mono"
											: theme === "clash"
												? "text-[#fbcc14]"
												: theme === "default"
													? "text-slate-400"
													: "text-slate-500"
							}`}
						>
							Action
						</label>
						{row
							.getVisibleCells()
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

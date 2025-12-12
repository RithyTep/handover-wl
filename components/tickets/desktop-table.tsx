"use client"

import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import type { Theme } from "@/enums"

interface DesktopTableProps<TData, TValue> {
	table: TanstackTable<TData>
	columns: ColumnDef<TData, TValue>[]
	theme: Theme
}

export function DesktopTable<TData, TValue>({
	table,
	columns,
	theme,
}: DesktopTableProps<TData, TValue>) {
	return (
		<div
			className={`overflow-hidden hidden sm:flex sm:flex-col ${
				theme === "pixel"
					? "border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm pixel-shadow"
					: theme === "lunar"
						? "lunar-card border border-stone-800/50 shadow-xl"
						: theme === "coding"
							? "coding-card border border-green-900/30 shadow-xl shadow-green-900/20"
							: theme === "clash"
								? "clash-card"
								: theme === "angkor_pixel"
									? "angkor-pixel-table bg-[#1a2f26] border-4 border-[#8b7355]"
									: "border border-white/20 rounded-md shadow-xl"
			}`}
		>
			<div className="overflow-auto">
				<Table className="min-w-full md:min-w-[1400px]">
					<TableHeader
						className={`sticky top-0 z-10 ${
							theme === "christmas"
								? "bg-black/40 backdrop-blur-md"
								: theme === "pixel"
									? "bg-slate-950"
									: theme === "lunar"
										? "lunar-table-header backdrop-blur-md"
										: theme === "coding"
											? "coding-table-header backdrop-blur-md"
											: theme === "clash"
												? "clash-table-header"
												: theme === "angkor_pixel"
													? "bg-[#3a2a1a]"
													: "bg-background backdrop-blur-md"
						}`}
					>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className={`hover:bg-transparent ${
									theme === "christmas"
										? "border-b border-white/10"
										: theme === "pixel"
											? "border-b-2 border-slate-700"
											: theme === "lunar"
												? "border-b border-stone-800/50"
												: theme === "coding"
													? "border-b border-green-900/30"
													: theme === "clash"
														? "border-b border-[#9c9c9c]"
														: theme === "angkor_pixel"
															? "border-b-4 border-[#8b7355]"
															: "border-b border-border"
								}`}
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className={`h-10 px-3 text-xs font-bold uppercase tracking-wide ${
												theme === "christmas"
													? "text-white/90 border-r border-white/10 last:border-r-0"
													: theme === "pixel"
														? "text-slate-400 border-r-2 border-slate-800 last:border-r-0"
														: theme === "lunar"
															? "text-stone-500 border-r border-stone-800/30 last:border-r-0"
															: theme === "coding"
																? "text-green-500/70 border-r border-green-900/30 last:border-r-0 font-mono"
																: theme === "clash"
																	? "text-[#fbcc14] border-r border-[#9c9c9c] last:border-r-0"
																	: theme === "angkor_pixel"
																		? "text-[#ffd700] border-r border-[#8b7355] last:border-r-0 bg-[#3a2a1a]"
																		: "text-foreground border-r border-border last:border-r-0"
											}`}
											style={{
												width:
													header.getSize() !== 150 ? header.getSize() : undefined,
											}}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody
						className={
							theme === "pixel"
								? "text-sm divide-y-2 divide-slate-800"
								: theme === "lunar"
									? "text-sm"
									: theme === "coding"
										? "text-sm font-mono"
										: theme === "angkor_pixel"
											? "text-sm bg-[#1a2f26]"
											: ""
						}
					>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, index) => {
								let rowClass = ""
								if (theme === "christmas") {
									if (index % 3 === 0) rowClass = "christmas-row-gold"
									else if (index % 3 === 1) rowClass = "christmas-row-red"
									else rowClass = "christmas-row-green"
								}

								return (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										className={`transition-colors duration-150 ${
											theme === "christmas"
												? `border-b border-white/10 ${rowClass} hover:brightness-110`
												: theme === "pixel"
													? "hover:bg-slate-800/50"
													: theme === "lunar"
														? "lunar-table-row"
														: theme === "coding"
															? "coding-table-row"
															: theme === "clash"
																? "clash-table-row"
																: theme === "angkor_pixel"
																	? `border-b-2 border-[#3d5a4a] hover:bg-[#3d5a4a] ${index % 2 === 0 ? "bg-[#243d32]" : "bg-[#1e3329]"}`
																	: "border-b border-border hover:bg-muted/50"
										}`}
									>
										{row.getVisibleCells().map((cell, cellIndex) => (
											<TableCell
												key={cell.id}
												className={`px-3 py-2 ${
													theme === "christmas"
														? `border-r border-white/10 last:border-r-0 ${cellIndex === 0 ? "candy-cane-border" : ""}`
														: theme === "pixel"
															? "border-r-2 border-slate-800 last:border-r-0"
															: theme === "lunar"
																? "lunar-table-cell border-r border-stone-800/30 last:border-r-0 text-stone-300"
																: theme === "coding"
																	? "coding-table-cell border-r border-green-900/30 last:border-r-0 text-green-400/70"
																	: theme === "clash"
																		? "text-white border-r border-[#9c9c9c] last:border-r-0 font-medium dropshadow-sm"
																		: theme === "angkor_pixel"
																			? "text-[#f5e6d3] border-r border-[#3d5a4a] last:border-r-0 font-medium"
																			: "border-r border-border last:border-r-0"
												}`}
												style={{
													width:
														cell.column.getSize() !== 150
															? cell.column.getSize()
															: undefined,
												}}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								)
							})
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-muted-foreground text-sm"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

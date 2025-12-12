"use client"

import * as React from "react"
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TicketPreview } from "@/components/ticket-preview"
import { Theme } from "@/enums"
import type { Ticket } from "@/lib/types"
import type { TicketFilters } from "@/components/ticket-filters"
import {
	MobileTicketCard,
	DesktopTable,
	useTicketFilters,
	DEFAULT_COLUMN_VISIBILITY,
	getColumnVisibility,
} from "./tickets"

interface TicketsTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	actionButtons?: React.ReactNode
	theme?: Theme
}

export function TicketsTable<TData, TValue>({
	columns,
	data,
	actionButtons,
	theme = Theme.CHRISTMAS,
}: TicketsTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [previewTicket, setPreviewTicket] = React.useState<Ticket | null>(null)
	const [previewAnchor, setPreviewAnchor] = React.useState<HTMLElement | null>(
		null
	)
	const [activeFilters, _setActiveFilters] = React.useState<TicketFilters>({})

	const [showDetails, setShowDetails] = React.useState(false)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>(DEFAULT_COLUMN_VISIBILITY)

	React.useEffect(() => {
		const saved = localStorage.getItem("showDetails")
		if (saved) {
			const isVisible = JSON.parse(saved)
			setShowDetails(isVisible)
			setColumnVisibility(getColumnVisibility(isVisible))
		}
	}, [])
	const [rowSelection, setRowSelection] = React.useState({})

	const toggleDetails = () => {
		const newVisibility = !showDetails
		setShowDetails(newVisibility)
		if (typeof window !== "undefined") {
			localStorage.setItem("showDetails", JSON.stringify(newVisibility))
		}
		setColumnVisibility(getColumnVisibility(newVisibility))
	}

	const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

	const { filteredData } = useTicketFilters(data, activeFilters)

	const handleTicketHover = React.useCallback(
		(ticket: Ticket | null, element: HTMLElement | null) => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current)
				closeTimeoutRef.current = null
			}

			setPreviewTicket(ticket)
			setPreviewAnchor(element)
		},
		[]
	)

	const handleClosePreview = React.useCallback(() => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current)
			closeTimeoutRef.current = null
		}
		setPreviewTicket(null)
		setPreviewAnchor(null)
	}, [])

	const table = useReactTable({
		data: filteredData as TData[],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		columnResizeMode: "onChange",
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		meta: {
			onTicketHover: handleTicketHover,
		},
	})

	return (
		<div className="w-full h-full flex flex-col gap-3">
			<div className="flex-shrink-0 hidden sm:flex items-center justify-between gap-3">
				<Button
					variant="ghost"
					size="sm"
					onClick={toggleDetails}
					className={`h-9 px-3 border ${
						theme === "christmas"
							? "text-white/80 hover:text-white hover:bg-white/10 border-white/20"
							: theme === "pixel"
								? "bg-slate-900 border-2 border-slate-700 hover:border-indigo-500 hover:text-indigo-400 pixel-shadow"
								: theme === "lunar"
									? "text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg"
									: theme === "coding"
										? "text-green-500/80 bg-black hover:bg-green-900/20 border border-green-900/30 font-mono"
										: theme === "clash"
											? "text-[#fbcc14] bg-[#3f2e21] hover:bg-black/20 border-2 border-[#9c9c9c] clash-btn-primary"
											: theme === "angkor_pixel"
												? "text-[#ffd700] bg-[#3a2a1a] hover:bg-[#4b3a2a] border-4 border-[#8b7355] angkor-pixel-btn"
												: "text-slate-300 hover:bg-slate-800 border-slate-700"
					}`}
					title={showDetails ? "Hide Details" : "Show Details"}
				>
					{showDetails ? (
						<ChevronDown className="w-4 h-4 mr-1.5" />
					) : (
						<ChevronRight className="w-4 h-4 mr-1.5" />
					)}
					<span>{showDetails ? "Hide" : "Details"}</span>
				</Button>

				{actionButtons}
			</div>

			<div className="flex-1 block sm:hidden overflow-auto pb-24">
				<div className="space-y-4 px-1">
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row, index) => (
							<MobileTicketCard
								key={row.id}
								row={row}
								index={index}
								theme={theme}
							/>
						))
					) : (
						<div className="text-center py-8 text-muted-foreground text-sm">
							No results.
						</div>
					)}
				</div>
			</div>

			<DesktopTable table={table} columns={columns} theme={theme} />

			{previewTicket && (
				<TicketPreview
					ticket={previewTicket}
					isOpen={!!previewTicket}
					onClose={handleClosePreview}
					onMouseLeave={handleClosePreview}
					anchorElement={previewAnchor}
				/>
			)}
		</div>
	)
}

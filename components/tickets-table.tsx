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
import { ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TicketPreview } from "@/components/ticket-preview"
import { Theme } from "@/enums"
import type { Ticket } from "@/lib/types"
import {
	MobileTicketCard,
	DesktopTable,
	DEFAULT_COLUMN_VISIBILITY,
	getColumnVisibility,
	getButtonThemeStyles,
	getSelectThemeStyles,
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
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [previewTicket, setPreviewTicket] = React.useState<Ticket | null>(null)
	const [previewAnchor, setPreviewAnchor] = React.useState<HTMLElement | null>(null)

	const [showDetails, setShowDetails] = React.useState(false)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>(DEFAULT_COLUMN_VISIBILITY)

	const [showReadyToRelease, setShowReadyToRelease] = React.useState(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("showReadyToRelease")
			return saved ? JSON.parse(saved) : true
		}
		return true
	})

	React.useEffect(() => {
		const savedDetails = localStorage.getItem("showDetails")
		if (savedDetails) {
			const isVisible = JSON.parse(savedDetails)
			setShowDetails(isVisible)
			setColumnVisibility(getColumnVisibility(isVisible))
		}
	}, [])

	const [rowSelection, setRowSelection] = React.useState({})

	// Get ready to release tickets (has release date)
	const readyToReleaseTickets = React.useMemo(() => {
		const tickets = data as Ticket[]
		return tickets.filter((t) => !!t.releaseDate)
	}, [data])

	// Regular tickets (exclude ready to release)
	const regularTickets = React.useMemo(() => {
		const tickets = data as Ticket[]
		return tickets.filter((t) => !t.releaseDate)
	}, [data])

	const toggleDetails = () => {
		const newVisibility = !showDetails
		setShowDetails(newVisibility)
		if (typeof window !== "undefined") {
			localStorage.setItem("showDetails", JSON.stringify(newVisibility))
		}
		setColumnVisibility(getColumnVisibility(newVisibility))
	}

	const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

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

	// Main table for regular tickets (exclude ready to release)
	const mainTable = useReactTable({
		data: regularTickets as TData[],
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

	// Ready to release table
	const readyTable = useReactTable({
		data: readyToReleaseTickets as TData[],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		columnResizeMode: "onChange",
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
		meta: {
			onTicketHover: handleTicketHover,
		},
	})

	const selectStyles = getSelectThemeStyles(theme)

	return (
		<div className="w-full h-full flex flex-col gap-3">
			<div className="flex-shrink-0 hidden sm:flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleDetails}
						className={`h-9 px-3 border ${getButtonThemeStyles(theme)}`}
						title={showDetails ? "Hide Details" : "Show Details"}
					>
						{showDetails ? (
							<ChevronDown className="w-4 h-4 mr-1.5" />
						) : (
							<ChevronRight className="w-4 h-4 mr-1.5" />
						)}
						<span>{showDetails ? "Hide" : "Details"}</span>
					</Button>
				</div>

				{actionButtons}
			</div>

			{/* Mobile view */}
			<div className="flex-1 block sm:hidden overflow-auto pb-24">
				<div className="space-y-4 px-1">
					{mainTable.getRowModel().rows?.length ? (
						mainTable.getRowModel().rows.map((row, index) => (
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

			{/* Main table */}
			<DesktopTable table={mainTable} columns={columns} theme={theme} />

			{/* Ready to Release section - always visible */}
			<div className="mt-6">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						const newValue = !showReadyToRelease
						setShowReadyToRelease(newValue)
						localStorage.setItem("showReadyToRelease", JSON.stringify(newValue))
					}}
					className={`h-9 px-3 mb-3 border ${selectStyles.trigger}`}
				>
					{showReadyToRelease ? (
						<ChevronDown className="w-4 h-4 mr-1.5" />
					) : (
						<ChevronRight className="w-4 h-4 mr-1.5" />
					)}
					<CheckCircle2 className="w-4 h-4 mr-1.5" />
					<span>Ready to Release ({readyToReleaseTickets.length})</span>
				</Button>

				{showReadyToRelease && (
					<>
						{/* Mobile view for Ready to Release */}
						<div className="block sm:hidden">
							<div className="space-y-4 px-1">
								{readyTable.getRowModel().rows?.length ? (
									readyTable.getRowModel().rows.map((row, index) => (
										<MobileTicketCard
											key={row.id}
											row={row}
											index={index}
											theme={theme}
										/>
									))
								) : (
									<div className="text-center py-8 text-muted-foreground text-sm">
										No ready to release tickets.
									</div>
								)}
							</div>
						</div>
						{/* Desktop view for Ready to Release */}
						<div className="hidden sm:block">
							<DesktopTable table={readyTable} columns={columns} theme={theme} />
						</div>
					</>
				)}
			</div>

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

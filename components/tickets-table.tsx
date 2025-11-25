"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TicketPreview } from "@/components/ticket-preview"
import { Ticket } from "@/app/columns"
import { TicketFiltersComponent, TicketFilters } from "@/components/ticket-filters"

interface TicketsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  actionButtons?: React.ReactNode
}

export function TicketsTable<TData, TValue>({
  columns,
  data,
  actionButtons,
}: TicketsTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [previewTicket, setPreviewTicket] = React.useState<Ticket | null>(null)
  const [previewAnchor, setPreviewAnchor] = React.useState<HTMLElement | null>(null)
  const [activeFilters, setActiveFilters] = React.useState<TicketFilters>({})

  // Load showDetails from localStorage (after mount to avoid hydration mismatch)
  const [showDetails, setShowDetails] = React.useState(false)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    assignee: true,
    created: false,
    dueDate: false,
    status: false,
    wlMainTicketType: false,
    wlSubTicketType: false,
    customerLevel: false,
  })

  // Load from localStorage after mount
  React.useEffect(() => {
    const saved = localStorage.getItem('showDetails')
    if (saved) {
      const isVisible = JSON.parse(saved)
      setShowDetails(isVisible)
      setColumnVisibility({
        assignee: true,
        created: isVisible,
        dueDate: isVisible,
        status: isVisible,
        wlMainTicketType: isVisible,
        wlSubTicketType: isVisible,
        customerLevel: isVisible,
      })
    }
  }, [])
  const [rowSelection, setRowSelection] = React.useState({})

  // Toggle all detail columns
  const toggleDetails = () => {
    const newVisibility = !showDetails
    setShowDetails(newVisibility)
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('showDetails', JSON.stringify(newVisibility))
    }
    setColumnVisibility({
      assignee: true, // Always visible
      created: newVisibility,
      dueDate: newVisibility,
      status: newVisibility,
      wlMainTicketType: newVisibility,
      wlSubTicketType: newVisibility,
      customerLevel: newVisibility,
    })
  }

  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Extract unique values for filters
  const filterOptions = React.useMemo(() => {
    const ticketsData = data as Ticket[];
    return {
      assignees: Array.from(new Set(ticketsData.map(t => t.assignee))).filter(Boolean).sort(),
      statuses: Array.from(new Set(ticketsData.map(t => t.status))).filter(Boolean).sort(),
      mainTypes: Array.from(new Set(ticketsData.map(t => t.wlMainTicketType))).filter(v => v && v !== "N/A").sort(),
      subTypes: Array.from(new Set(ticketsData.map(t => t.wlSubTicketType))).filter(v => v && v !== "N/A").sort(),
      customerLevels: Array.from(new Set(ticketsData.map(t => t.customerLevel))).filter(v => v && v !== "N/A").sort(),
    };
  }, [data]);

  // Apply filters to data
  const filteredData = React.useMemo(() => {
    const ticketsData = data as Ticket[];

    return ticketsData.filter((ticket) => {
      // Assignee filter
      if (activeFilters.assignee && ticket.assignee !== activeFilters.assignee) {
        return false;
      }

      // Status filter
      if (activeFilters.status && ticket.status !== activeFilters.status) {
        return false;
      }

      // WL Main Type filter
      if (activeFilters.wlMainTicketType && ticket.wlMainTicketType !== activeFilters.wlMainTicketType) {
        return false;
      }

      // WL Sub Type filter
      if (activeFilters.wlSubTicketType && ticket.wlSubTicketType !== activeFilters.wlSubTicketType) {
        return false;
      }

      // Customer Level filter
      if (activeFilters.customerLevel && ticket.customerLevel !== activeFilters.customerLevel) {
        return false;
      }

      // Date range filter
      if (activeFilters.dateFrom) {
        const ticketDate = new Date(ticket.created);
        const fromDate = new Date(activeFilters.dateFrom);
        if (ticketDate < fromDate) {
          return false;
        }
      }

      if (activeFilters.dateTo) {
        const ticketDate = new Date(ticket.created);
        const toDate = new Date(activeFilters.dateTo);
        toDate.setHours(23, 59, 59, 999); // Include the entire day
        if (ticketDate > toDate) {
          return false;
        }
      }

      // JQL Query filter (basic implementation - matches against summary and key)
      if (activeFilters.jqlQuery) {
        const query = activeFilters.jqlQuery.toLowerCase();
        const searchText = `${ticket.key} ${ticket.summary} ${ticket.status} ${ticket.assignee}`.toLowerCase();
        if (!searchText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [data, activeFilters]);

  const handleTicketHover = React.useCallback((ticket: Ticket | null, element: HTMLElement | null) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setPreviewTicket(ticket)
    setPreviewAnchor(element)
  }, [])

  const handleClosePreview = React.useCallback(() => {
    // Immediately close the preview
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
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
      {/* Action Buttons Row - Desktop only */}
      <div className="flex-shrink-0 hidden sm:flex items-center justify-between gap-3">
        {/* Show Details Toggle - Left side */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDetails}
          className="h-9 px-3 text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
          title={showDetails ? "Hide Details" : "Show Details"}
        >
          {showDetails ? <ChevronDown className="w-4 h-4 mr-1.5" /> : <ChevronRight className="w-4 h-4 mr-1.5" />}
          <span>{showDetails ? "Hide" : "Details"}</span>
        </Button>

        {/* Action Buttons - Right side */}
        {actionButtons}
      </div>

      {/* Mobile Card View */}
      <div className="flex-1 block sm:hidden overflow-auto pb-24">
        <div className="space-y-4 px-1">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => {
              const ticket = row.original as any;
              
              // Christmas row coloring
              let cardClass = "";
              if (index % 3 === 0) cardClass = "christmas-row-gold";
              else if (index % 3 === 1) cardClass = "christmas-row-red";
              else cardClass = "christmas-row-green";

              return (
                <div
                  key={row.id}
                  className={`border border-white/20 rounded-lg overflow-hidden shadow-sm ${cardClass}`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-black/10">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-medium text-white/80 tabular-nums">
                        {index + 1}
                      </span>
                      <a
                        href={ticket.jiraUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-white hover:text-white/80 transition-colors"
                      >
                        {ticket.key}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      {ticket.assigneeAvatar ? (
                        <img
                          src={ticket.assigneeAvatar}
                          alt={ticket.assignee}
                          className="w-5 h-5 rounded-full ring-1 ring-white/30"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-medium text-white">
                          {ticket.assignee === "Unassigned" ? "?" : ticket.assignee.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Summary */}
                    <p className="text-[13px] text-white/90 leading-relaxed line-clamp-2">{ticket.summary}</p>

                    {/* Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-medium text-white/70 uppercase tracking-wider mb-1.5 block">Status</label>
                        {row.getVisibleCells()
                          .filter((cell) => cell.column.id === "savedStatus")
                          .map((cell) => (
                            <div key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          ))}
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-white/70 uppercase tracking-wider mb-1.5 block">Action</label>
                        {row.getVisibleCells()
                          .filter((cell) => cell.column.id === "savedAction")
                          .map((cell) => (
                            <div key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No results.
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="border border-white/20 rounded-md overflow-hidden hidden sm:flex sm:flex-col shadow-xl">
        <div className="overflow-auto">
          <Table className="min-w-full md:min-w-[1400px]">
            <TableHeader className="bg-black/40 sticky top-0 z-10 backdrop-blur-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-white/10 hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="h-10 px-3 text-xs font-bold text-white/90 uppercase tracking-wide border-r border-white/10 last:border-r-0"
                        style={{
                          width: header.getSize() !== 150 ? header.getSize() : undefined,
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
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => {
                  // Christmas row coloring
                  let rowClass = "";
                  if (index % 3 === 0) rowClass = "christmas-row-gold";
                  else if (index % 3 === 1) rowClass = "christmas-row-red";
                  else rowClass = "christmas-row-green";

                  return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`border-b border-white/10 transition-colors duration-150 ${rowClass} hover:brightness-110`}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        key={cell.id}
                        className={`px-3 py-2 border-r border-white/10 last:border-r-0 ${cellIndex === 0 ? 'candy-cane-border' : ''}`}
                        style={{
                          width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )})
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

      {/* Ticket Preview */}
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

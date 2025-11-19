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

  // Load showDetails from localStorage
  const [showDetails, setShowDetails] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showDetails')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('showDetails')
        const isVisible = saved ? JSON.parse(saved) : false
        return {
          assignee: true, // Always visible
          created: isVisible,
          dueDate: isVisible,
          status: isVisible,
          wlMainTicketType: isVisible,
          wlSubTicketType: isVisible,
          customerLevel: isVisible,
        }
      }
      return {
        assignee: true, // Always visible
        created: false,
        dueDate: false,
        status: false,
        wlMainTicketType: false,
        wlSubTicketType: false,
        customerLevel: false,
      }
    })
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
          size="icon"
          onClick={toggleDetails}
          className="h-8 w-8"
          title={showDetails ? "Hide Details" : "Show Details"}
        >
          {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>

        {/* Action Buttons - Right side */}
        {actionButtons}
      </div>

      {/* Mobile Card View */}
      <div className="flex-1 overflow-auto sm:hidden">
        <div className="space-y-3">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => {
              const ticket = row.original as Ticket;
              return (
                <div
                  key={row.id}
                  className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                        {index + 1}
                      </span>
                      <a
                        href={ticket.jiraUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {ticket.key}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      {ticket.assigneeAvatar ? (
                        <img
                          src={ticket.assigneeAvatar}
                          alt={ticket.assignee}
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground">
                          {ticket.assignee === "Unassigned" ? "?" : ticket.assignee.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Summary */}
                    <p className="text-[13px] text-foreground/80 leading-relaxed line-clamp-2">{ticket.summary}</p>

                    {/* Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Status</label>
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
                        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Action</label>
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

      {/* Desktop Table View */}
      <div className="flex-1 border border-border rounded-md overflow-hidden bg-card hidden sm:block">
        <div className="h-full overflow-auto">
          <Table className="min-w-full md:min-w-[1400px]">
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="h-9 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide border-r border-border/50 last:border-r-0"
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-3 py-2 border-r border-border/30 last:border-r-0"
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
                ))
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

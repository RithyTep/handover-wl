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
import type { Ticket } from "@/interfaces/ticket.interface"
import { TicketFiltersComponent, TicketFilters } from "@/components/ticket-filters"
import { Theme } from "@/enums/theme.enum"

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
  const [previewAnchor, setPreviewAnchor] = React.useState<HTMLElement | null>(null)
  const [activeFilters, setActiveFilters] = React.useState<TicketFilters>({})

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

  const toggleDetails = () => {
    const newVisibility = !showDetails
    setShowDetails(newVisibility)
    if (typeof window !== 'undefined') {
      localStorage.setItem('showDetails', JSON.stringify(newVisibility))
    }
    setColumnVisibility({
      assignee: true,
      created: newVisibility,
      dueDate: newVisibility,
      status: newVisibility,
      wlMainTicketType: newVisibility,
      wlSubTicketType: newVisibility,
      customerLevel: newVisibility,
    })
  }

  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

  const filteredData = React.useMemo(() => {
    const ticketsData = data as Ticket[];

    return ticketsData.filter((ticket) => {
      if (activeFilters.assignee && ticket.assignee !== activeFilters.assignee) {
        return false;
      }

      if (activeFilters.status && ticket.status !== activeFilters.status) {
        return false;
      }

      if (activeFilters.wlMainTicketType && ticket.wlMainTicketType !== activeFilters.wlMainTicketType) {
        return false;
      }

      if (activeFilters.wlSubTicketType && ticket.wlSubTicketType !== activeFilters.wlSubTicketType) {
        return false;
      }

      if (activeFilters.customerLevel && ticket.customerLevel !== activeFilters.customerLevel) {
        return false;
      }

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
        toDate.setHours(23, 59, 59, 999);
        if (ticketDate > toDate) {
          return false;
        }
      }

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
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setPreviewTicket(ticket)
    setPreviewAnchor(element)
  }, [])

  const handleClosePreview = React.useCallback(() => {
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
      <div className="flex-shrink-0 hidden sm:flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDetails}
          className={`h-9 px-3 border ${
            theme === Theme.CHRISTMAS
              ? "text-white/80 hover:text-white hover:bg-white/10 border-white/20"
              : theme === Theme.PIXEL
              ? "bg-slate-900 border-2 border-slate-700 hover:border-indigo-500 hover:text-indigo-400 pixel-shadow"
              : theme === Theme.LUNAR
              ? "text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg"
              : theme === Theme.CODING
              ? "text-green-400 bg-black hover:bg-green-900/30 border border-green-900 font-mono"
              : "text-foreground hover:bg-muted border-border"
          }`}
          title={showDetails ? "Hide Details" : "Show Details"}
        >
          {showDetails ? <ChevronDown className="w-4 h-4 mr-1.5" /> : <ChevronRight className="w-4 h-4 mr-1.5" />}
          <span>{showDetails ? "Hide" : "Details"}</span>
        </Button>

        {actionButtons}
      </div>

      <div className="flex-1 block sm:hidden overflow-auto pb-24">
        <div className="space-y-4 px-1">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => {
              const ticket = row.original as Ticket;

              let cardClass = "";
              if (theme === "christmas") {
                if (index % 3 === 0) cardClass = "christmas-row-gold";
                else if (index % 3 === 1) cardClass = "christmas-row-red";
                else cardClass = "christmas-row-green";
              }

              return (
                <div
                  key={row.id}
                  className={`border rounded-lg overflow-hidden shadow-sm ${
                    theme === Theme.CHRISTMAS
                      ? "border-white/20"
                      : theme === Theme.LUNAR
                      ? "border-stone-800/50 lunar-card"
                      : theme === Theme.CODING
                      ? "border-green-900/50 coding-card"
                      : "border-border"
                  } ${cardClass}`}
                >
                  <div className={`flex items-center justify-between px-4 py-3 border-b ${
                    theme === Theme.CHRISTMAS
                      ? "border-white/20 bg-black/10"
                      : theme === Theme.LUNAR
                      ? "border-stone-800/50 bg-stone-900/30"
                      : theme === Theme.CODING
                      ? "border-green-900/50 bg-black/50"
                      : "border-border bg-card"
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[11px] font-medium tabular-nums ${
                        theme === Theme.CHRISTMAS
                          ? "text-white/80"
                          : theme === Theme.LUNAR
                          ? "text-stone-500"
                          : theme === Theme.CODING
                          ? "text-green-600 font-mono"
                          : "text-muted-foreground"
                      }`}>
                        {index + 1}
                      </span>
                      <a
                        href={ticket.jiraUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-semibold transition-colors ${
                          theme === Theme.CHRISTMAS
                            ? "text-white hover:text-white/80"
                            : theme === Theme.LUNAR
                            ? "text-amber-400 hover:text-amber-300"
                            : theme === Theme.CODING
                            ? "text-green-400 hover:text-green-300 font-mono"
                            : "text-foreground hover:text-primary"
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
                            theme === Theme.CHRISTMAS
                              ? "ring-white/30"
                              : theme === Theme.LUNAR
                              ? "ring-stone-700"
                              : theme === Theme.CODING
                              ? "ring-green-900"
                              : "ring-border"
                          }`}
                        />
                      ) : (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium ${
                          theme === Theme.CHRISTMAS
                            ? "bg-white/20 text-white"
                            : theme === Theme.LUNAR
                            ? "bg-stone-800 text-stone-400"
                            : theme === Theme.CODING
                            ? "bg-green-900/50 text-green-400 font-mono"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {ticket.assignee === "Unassigned" ? "?" : ticket.assignee.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-4 space-y-4 ${
                    theme === Theme.CHRISTMAS
                      ? ""
                      : theme === Theme.LUNAR
                      ? "bg-transparent"
                      : theme === Theme.CODING
                      ? "bg-transparent"
                      : "bg-card"
                  }`}>
                    <p className={`text-[13px] leading-relaxed line-clamp-2 ${
                      theme === Theme.CHRISTMAS
                        ? "text-white/90"
                        : theme === Theme.LUNAR
                        ? "text-stone-300"
                        : theme === Theme.CODING
                        ? "text-green-300"
                        : "text-foreground"
                    }`}>{ticket.summary}</p>

                    <div className="space-y-3">
                      <div>
                        <label className={`text-[10px] font-medium uppercase tracking-wider mb-1.5 block ${
                          theme === Theme.CHRISTMAS
                            ? "text-white/70"
                            : theme === Theme.LUNAR
                            ? "text-stone-500"
                            : theme === Theme.CODING
                            ? "text-green-600 font-mono"
                            : "text-muted-foreground"
                        }`}>Status</label>
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
                        <label className={`text-[10px] font-medium uppercase tracking-wider mb-1.5 block ${
                          theme === Theme.CHRISTMAS
                            ? "text-white/70"
                            : theme === Theme.LUNAR
                            ? "text-stone-500"
                            : theme === Theme.CODING
                            ? "text-green-600 font-mono"
                            : "text-muted-foreground"
                        }`}>Action</label>
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

      <div className={`overflow-hidden hidden sm:flex sm:flex-col ${
        theme === Theme.PIXEL
          ? "border-2 border-slate-700 bg-slate-900/50 backdrop-blur-sm pixel-shadow"
          : theme === Theme.LUNAR
          ? "lunar-card border border-stone-800/50 shadow-xl"
          : theme === Theme.CODING
          ? "coding-card border border-green-900/50 shadow-xl shadow-green-900/20"
          : "border border-white/20 rounded-md shadow-xl"
      }`}>
        <div className="overflow-auto">
          <Table className="min-w-full md:min-w-[1400px]">
            <TableHeader className={`sticky top-0 z-10 ${
              theme === Theme.CHRISTMAS
                ? "bg-black/40 backdrop-blur-md"
                : theme === Theme.PIXEL
                ? "bg-slate-950"
                : theme === Theme.LUNAR
                ? "lunar-table-header backdrop-blur-md"
                : theme === Theme.CODING
                ? "coding-table-header backdrop-blur-md"
                : "bg-background backdrop-blur-md"
            }`}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className={`hover:bg-transparent ${
                  theme === Theme.CHRISTMAS
                    ? "border-b border-white/10"
                    : theme === Theme.PIXEL
                    ? "border-b-2 border-slate-700"
                    : theme === Theme.LUNAR
                    ? "border-b border-stone-800/50"
                    : theme === Theme.CODING
                    ? "border-b border-green-900/50"
                    : "border-b border-border"
                }`}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={`h-10 px-3 text-xs font-bold uppercase tracking-wide ${
                          theme === Theme.CHRISTMAS
                            ? "text-white/90 border-r border-white/10 last:border-r-0"
                            : theme === Theme.PIXEL
                            ? "text-slate-400 border-r-2 border-slate-800 last:border-r-0"
                            : theme === Theme.LUNAR
                            ? "text-stone-500 border-r border-stone-800/30 last:border-r-0"
                            : theme === Theme.CODING
                            ? "text-green-500 border-r border-green-900/30 last:border-r-0 font-mono"
                            : "text-foreground border-r border-border last:border-r-0"
                        }`}
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
            <TableBody className={
              theme === Theme.PIXEL
                ? "text-sm divide-y-2 divide-slate-800"
                : theme === Theme.LUNAR
                ? "text-sm"
                : theme === Theme.CODING
                ? "text-sm font-mono"
                : ""
            }>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => {
                  let rowClass = "";
                  if (theme === Theme.CHRISTMAS) {
                    if (index % 3 === 0) rowClass = "christmas-row-gold";
                    else if (index % 3 === 1) rowClass = "christmas-row-red";
                    else rowClass = "christmas-row-green";
                  }

                  return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`transition-colors duration-150 ${
                      theme === Theme.CHRISTMAS
                        ? `border-b border-white/10 ${rowClass} hover:brightness-110`
                        : theme === Theme.PIXEL
                        ? "hover:bg-slate-800/50"
                        : theme === Theme.LUNAR
                        ? "lunar-table-row"
                        : theme === Theme.CODING
                        ? "coding-table-row"
                        : "border-b border-border hover:bg-muted/50"
                    }`}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        key={cell.id}
                        className={`px-3 py-2 ${
                          theme === Theme.CHRISTMAS
                            ? `border-r border-white/10 last:border-r-0 ${cellIndex === 0 ? 'candy-cane-border' : ''}`
                            : theme === Theme.PIXEL
                            ? "border-r-2 border-slate-800 last:border-r-0"
                            : theme === Theme.LUNAR
                            ? "lunar-table-cell border-r border-stone-800/30 last:border-r-0 text-stone-300"
                            : theme === Theme.CODING
                            ? "coding-table-cell border-r border-green-900/30 last:border-r-0 text-green-300"
                            : "border-r border-border last:border-r-0"
                        }`}
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

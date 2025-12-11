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
import { Theme } from "@/enums"
import type { Ticket } from "@/lib/types"
import { TicketFiltersComponent, TicketFilters } from "@/components/ticket-filters"

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
                  <div className={`flex items-center justify-between px-4 py-3 border-b ${
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
                  }`}>
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
                          {ticket.assignee === "Unassigned" ? "?" : ticket.assignee.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-4 space-y-4 ${
                    theme === "christmas"
                      ? ""
                      : theme === "lunar"
                      ? "bg-transparent"
                      : theme === "coding"
                      ? "bg-transparent"
                      : "bg-transparent"
                  }`}>
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
                    >{ticket.summary}</p>

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
                        >Status</label>
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
                        >Action</label>
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
      }`}>
        <div className="overflow-auto">
          <Table className="min-w-full md:min-w-[1400px]">
            <TableHeader className={`sticky top-0 z-10 ${
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
            }`}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className={`hover:bg-transparent ${
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
                }`}>
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
              theme === "pixel"
                ? "text-sm divide-y-2 divide-slate-800"
                : theme === "lunar"
                ? "text-sm"
                : theme === "coding"
                ? "text-sm font-mono"
                : theme === "angkor_pixel"
                ? "text-sm bg-[#1a2f26]"
                : ""
            }>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => {
                  let rowClass = "";
                  if (theme === "christmas") {
                    if (index % 3 === 0) rowClass = "christmas-row-gold";
                    else if (index % 3 === 1) rowClass = "christmas-row-red";
                    else rowClass = "christmas-row-green";
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
                        ? `border-b-2 border-[#3d5a4a] hover:bg-[#3d5a4a] ${index % 2 === 0 ? 'bg-[#243d32]' : 'bg-[#1e3329]'}`
                        : "border-b border-border hover:bg-muted/50"
                    }`}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell
                        key={cell.id}
                        className={`px-3 py-2 ${
                          theme === "christmas"
                            ? `border-r border-white/10 last:border-r-0 ${cellIndex === 0 ? 'candy-cane-border' : ''}`
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

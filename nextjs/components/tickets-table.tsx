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
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
          assignee: isVisible,
          created: isVisible,
          dueDate: isVisible,
          status: isVisible,
          wlMainTicketType: isVisible,
          wlSubTicketType: isVisible,
          customerLevel: isVisible,
        }
      }
      return {
        assignee: false,
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
      assignee: newVisibility,
      created: newVisibility,
      dueDate: newVisibility,
      status: newVisibility,
      wlMainTicketType: newVisibility,
      wlSubTicketType: newVisibility,
      customerLevel: newVisibility,
    })
  }

  const table = useReactTable({
    data,
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
  })

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {/* Search and Action Buttons Row */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Action Buttons - Top on mobile, Right on desktop */}
        {actionButtons && (
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 order-1 sm:order-2">
            {actionButtons}
          </div>
        )}

        {/* Search and Show Details - Bottom on mobile, Left on desktop */}
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <Input
            placeholder="Search tickets..."
            value={(table.getColumn("summary")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("summary")?.setFilterValue(event.target.value)
            }
            className="h-9 flex-1 sm:w-[250px] bg-transparent border-border/30 focus:border-border text-sm sm:text-xs"
          />
          <Button
            variant="outline"
            onClick={toggleDetails}
            className="h-9 w-9 p-0 border-border/30 hover:bg-muted/50"
            title={showDetails ? "Hide Details" : "Show Details"}
          >
            {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Minimal Table */}
      <div className="flex-1 border border-border/30 rounded overflow-hidden">
        <div className="h-full overflow-auto">
          <Table className="min-w-full md:min-w-[1400px]">
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-border/30 hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="h-10 px-3 text-[11px] font-medium text-muted-foreground tracking-wider border-r border-border/30 last:border-r-0"
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
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-3 py-2.5 border-r border-border/20 last:border-r-0"
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
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Ticket Count */}
      <div className="flex-shrink-0 flex items-center justify-between pt-1">
        <div className="text-[11px] text-muted-foreground">
          <span className="text-primary font-semibold">{table.getFilteredRowModel().rows.length}</span> tickets
        </div>
      </div>
    </div>
  )
}

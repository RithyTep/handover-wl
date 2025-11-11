"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type Ticket = {
  key: string
  summary: string
  status: string
  assignee: string
  assigneeAvatar: string | null
  created: string
  dueDate: string | null
  issueType: string
  wlMainTicketType: string
  wlSubTicketType: string
  customerLevel: string
  jiraUrl: string
  savedStatus: string
  savedAction: string
}

interface ColumnsProps {
  ticketData: Record<string, string>
  updateTicketData: (key: string, value: string) => void
}

export const createColumns = ({
  ticketData,
  updateTicketData,
}: ColumnsProps): ColumnDef<Ticket>[] => [
  {
    accessorKey: "index",
    header: "#",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-primary/60 font-semibold text-[11px]">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "key",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent text-[11px] font-medium"
        >
          Ticket
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <a
        href={row.original.jiraUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-medium text-[11px] whitespace-nowrap"
      >
        {row.getValue("key")}
      </a>
    ),
  },
  {
    accessorKey: "summary",
    header: "Summary",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-[11px] text-foreground truncate">
        {row.getValue("summary")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-[11px] text-foreground whitespace-nowrap">
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => {
      const assignee = row.getValue("assignee") as string
      const assigneeAvatar = row.original.assigneeAvatar

      return (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {assigneeAvatar ? (
            <img
              src={assigneeAvatar}
              alt={assignee}
              className="w-5 h-5 rounded-full"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] font-medium">
              {assignee === "Unassigned" ? "?" : assignee.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-[11px] text-foreground">{assignee}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent text-[11px] font-medium"
        >
          Created
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created"))
      return (
        <div className="text-[11px] text-foreground whitespace-nowrap">
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent text-[11px] font-medium"
        >
          Due Date
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as string | null
      return (
        <div className="text-[11px] text-foreground whitespace-nowrap">
          {dueDate ? new Date(dueDate).toLocaleDateString() : "None"}
        </div>
      )
    },
  },
  {
    accessorKey: "wlMainTicketType",
    header: () => <div className="whitespace-nowrap">WL Main Type</div>,
    cell: ({ row }) => (
      <div className="text-[11px] text-foreground whitespace-nowrap">
        {row.getValue("wlMainTicketType")}
      </div>
    ),
  },
  {
    accessorKey: "wlSubTicketType",
    header: () => <div className="whitespace-nowrap">WL Sub Type</div>,
    cell: ({ row }) => (
      <div className="text-[11px] text-foreground whitespace-nowrap">
        {row.getValue("wlSubTicketType")}
      </div>
    ),
  },
  {
    accessorKey: "customerLevel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 hover:bg-transparent text-[11px] font-medium"
        >
          Customer Level
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-[11px] text-foreground whitespace-nowrap">
        {row.getValue("customerLevel")}
      </div>
    ),
  },
  {
    accessorKey: "savedStatus",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => {
      const statusValue = ticketData[`status-${row.original.key}`] || "--"
      return (
        <Input
          value={statusValue === "--" ? "" : statusValue}
          onChange={(e) =>
            updateTicketData(`status-${row.original.key}`, e.target.value || "--")
          }
          placeholder="Status"
          className="h-8 w-full min-w-[150px] bg-transparent border-border/20 focus:border-border/50 text-[11px] px-3"
        />
      )
    },
  },
  {
    accessorKey: "savedAction",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const actionValue = ticketData[`action-${row.original.key}`] || "--"
      return (
        <Input
          value={actionValue === "--" ? "" : actionValue}
          onChange={(e) =>
            updateTicketData(`action-${row.original.key}`, e.target.value || "--")
          }
          placeholder="Action"
          className="h-8 w-full min-w-[150px] bg-transparent border-border/20 focus:border-border/50 text-[11px] px-3"
        />
      )
    },
  },
]

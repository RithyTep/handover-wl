"use client";

import { memo, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Ticket {
  key: string;
  summary: string;
  status: string;
  assignee: string;
  assigneeAvatar: string | null;
  created: string;
  dueDate: string | null;
  issueType: string;
  wlMainTicketType: string;
  wlSubTicketType: string;
  customerLevel: string;
  jiraUrl: string;
  savedStatus: string;
  savedAction: string;
}

interface ColumnsProps {
  ticketData: Record<string, string>;
  updateTicketData: (key: string, value: string) => void;
  renderKey: number;
}

const TicketLink = memo(function TicketLink({
  ticket,
  onHover,
}: {
  ticket: Ticket;
  onHover: (ticket: Ticket, element: HTMLElement) => void;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (linkRef.current) {
      onHover(ticket, linkRef.current);
    }
  };

  return (
    <a
      ref={linkRef}
      href={ticket.jiraUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-white/80 underline-offset-2 hover:underline font-medium text-xs whitespace-nowrap transition-colors"
      onMouseEnter={handleMouseEnter}
    >
      {ticket.key}
    </a>
  );
});

const SimpleInput = memo(function SimpleInput({
  ticketKey,
  defaultValue,
  placeholder,
  onChange,
}: {
  ticketKey: string;
  defaultValue: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        key={ticketKey}
        defaultValue={defaultValue === "--" ? "" : defaultValue}
        onChange={(e) => onChange(e.target.value || "--")}
        placeholder={placeholder}
        className="h-11 sm:h-8 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm sm:text-xs w-full sm:min-w-[250px] touch-manipulation rounded-lg focus:ring-2 focus:ring-white/30 pr-8"
      />
      <Gift className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
});

function getAssigneeDisplay(name: string): string {
  if (name.toLowerCase().includes("leo")) {
    return `${name} (PO)`;
  }
  return name;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

export const createColumns = ({
  ticketData,
  updateTicketData,
  renderKey,
}: ColumnsProps): ColumnDef<Ticket>[] => [
  {
    accessorKey: "index",
    header: () => <span className="hidden sm:inline">#</span>,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-white/70 font-medium text-xs hidden sm:block">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "key",
    enableHiding: false,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent text-xs font-medium text-white/90 hover:text-white"
      >
        Ticket
        <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onTicketHover?: (ticket: Ticket, element: HTMLElement) => void };
      return (
        <TicketLink
          ticket={row.original}
          onHover={(ticket, element) => meta?.onTicketHover?.(ticket, element)}
        />
      );
    },
  },
  {
    accessorKey: "summary",
    header: "Summary",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-xs text-white line-clamp-2 sm:truncate sm:max-w-md">
        {row.getValue("summary")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-xs text-white/70 whitespace-nowrap">
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => {
      const assignee = row.getValue("assignee") as string;
      const assigneeAvatar = row.original.assigneeAvatar;

      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          {assigneeAvatar ? (
            <img
              src={assigneeAvatar}
              alt={assignee}
              className="w-5 h-5 rounded-full ring-1 ring-white/30"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-medium text-white">
              {assignee === "Unassigned" ? "?" : assignee.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-white">{getAssigneeDisplay(assignee)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent text-[11px] font-medium text-white/90 hover:text-white"
      >
        Created
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-xs text-white/70 whitespace-nowrap">
        {formatDate(row.getValue("created"))}
      </div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent text-[11px] font-medium text-white/90 hover:text-white"
      >
        Due Date
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as string | null;
      return (
        <div className="text-xs text-white/70 whitespace-nowrap">
          {dueDate ? formatDate(dueDate) : "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "wlMainTicketType",
    header: () => <div className="whitespace-nowrap">WL Main Type</div>,
    cell: ({ row }) => (
      <div className="text-xs text-white/70 whitespace-nowrap">
        {row.getValue("wlMainTicketType")}
      </div>
    ),
  },
  {
    accessorKey: "wlSubTicketType",
    header: () => <div className="whitespace-nowrap">WL Sub Type</div>,
    cell: ({ row }) => (
      <div className="text-xs text-white/70 whitespace-nowrap">
        {row.getValue("wlSubTicketType")}
      </div>
    ),
  },
  {
    accessorKey: "customerLevel",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent text-xs font-medium text-white/90 hover:text-white"
      >
        Customer Level
        <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-xs text-white/70 whitespace-nowrap">
        {row.getValue("customerLevel")}
      </div>
    ),
  },
  {
    accessorKey: "savedStatus",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => (
      <SimpleInput
        ticketKey={`status-${row.original.key}-${renderKey}`}
        defaultValue={row.original.savedStatus}
        placeholder="Enter status..."
        onChange={(value) => updateTicketData(`status-${row.original.key}`, value)}
      />
    ),
  },
  {
    accessorKey: "savedAction",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => (
      <SimpleInput
        ticketKey={`action-${row.original.key}-${renderKey}`}
        defaultValue={row.original.savedAction}
        placeholder="Enter action..."
        onChange={(value) => updateTicketData(`action-${row.original.key}`, value)}
      />
    ),
  },
];

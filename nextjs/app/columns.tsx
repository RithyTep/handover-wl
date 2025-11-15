"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRef, useState, useEffect } from "react"
import { toast } from "sonner"
import axios from "axios"

// Ticket link component
function TicketLink({
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
      className="text-foreground hover:text-primary underline-offset-2 hover:underline font-medium text-xs whitespace-nowrap transition-colors"
      onMouseEnter={handleMouseEnter}
    >
      {ticket.key}
    </a>
  );
}

// AI-enhanced input for STATUS/ACTION
function AIEnhancedInput({
  ticket,
  field,
  defaultValue,
  placeholder,
  onChange,
}: {
  ticket: Ticket;
  field: "status" | "action";
  defaultValue: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState(defaultValue === "--" ? "" : defaultValue);
  const [loading, setLoading] = useState(false);

  // Sync local state when defaultValue changes (e.g., from AI fill all)
  useEffect(() => {
    const displayValue = defaultValue === "--" ? "" : defaultValue;
    setValue(displayValue);
  }, [defaultValue]);

  const handleAIFill = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Generating suggestion...");

    try {
      const response = await axios.post("/api/ai-autofill", { ticket });
      const suggestion = response.data.suggestion;

      const newValue = field === "status" ? suggestion.status : suggestion.action;
      setValue(newValue);
      onChange(newValue);

      toast.dismiss(loadingToast);
      toast.success(`AI suggestion applied!`);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.error || "Failed to generate suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 w-full">
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value || "--");
        }}
        placeholder={placeholder}
        className="h-8 flex-1 bg-transparent text-xs"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAIFill}
        disabled={loading}
        className="h-8 w-8 flex-shrink-0"
        title="AI auto-fill"
      >
        <Sparkles className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}

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
      <div className="text-muted-foreground font-medium text-xs">
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
          className="h-auto p-0 hover:bg-transparent text-xs font-medium"
        >
          Ticket
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;

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
      <div className="text-xs text-foreground truncate max-w-md">
        {row.getValue("summary")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground whitespace-nowrap">
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

      // Add role labels for specific assignees
      const getAssigneeDisplay = (name: string) => {
        if (name.toLowerCase().includes("leo")) {
          return `${name} (PO)`;
        }
        return name;
      };

      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          {assigneeAvatar ? (
            <img
              src={assigneeAvatar}
              alt={assignee}
              className="w-5 h-5 rounded-full ring-1 ring-border"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground">
              {assignee === "Unassigned" ? "?" : assignee.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-foreground">{getAssigneeDisplay(assignee)}</span>
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
        <div className="text-xs text-muted-foreground whitespace-nowrap">
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
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {dueDate ? new Date(dueDate).toLocaleDateString() : "—"}
        </div>
      )
    },
  },
  {
    accessorKey: "wlMainTicketType",
    header: () => <div className="whitespace-nowrap">WL Main Type</div>,
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground whitespace-nowrap">
        {row.getValue("wlMainTicketType")}
      </div>
    ),
  },
  {
    accessorKey: "wlSubTicketType",
    header: () => <div className="whitespace-nowrap">WL Sub Type</div>,
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground whitespace-nowrap">
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
          className="h-auto p-0 hover:bg-transparent text-xs font-medium"
        >
          Customer Level
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground whitespace-nowrap">
        {row.getValue("customerLevel")}
      </div>
    ),
  },
  {
    accessorKey: "savedStatus",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => {
      const currentValue = ticketData[`status-${row.original.key}`] || row.original.savedStatus;
      return (
        <AIEnhancedInput
          ticket={row.original}
          field="status"
          defaultValue={currentValue}
          placeholder="Enter status..."
          onChange={(value) => updateTicketData(`status-${row.original.key}`, value)}
        />
      )
    },
  },
  {
    accessorKey: "savedAction",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      const currentValue = ticketData[`action-${row.original.key}`] || row.original.savedAction;
      return (
        <AIEnhancedInput
          ticket={row.original}
          field="action"
          defaultValue={currentValue}
          placeholder="Enter action..."
          onChange={(value) => updateTicketData(`action-${row.original.key}`, value)}
        />
      )
    },
  },
]

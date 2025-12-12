"use client"

import { useMemo } from "react"
import { TicketsTable } from "@/components/tickets-table"
import { createColumns } from "@/app/columns"
import type { Ticket, Theme } from "@/lib/types"
import { DashboardActions } from "./dashboard-actions"

interface DashboardContentProps {
  tickets: Ticket[];
  ticketData: Record<string, string>;
  updateTicketData: (key: string, value: string) => void;
  renderKey: number;
  theme: Theme;
  onAIFillAll: () => void;
  onQuickFill: (status: string, action: string) => void;
  onClear: () => void;
  onRefresh: () => void;
  onCopy: () => void;
  onSave: () => void;
  onSendSlack: () => void;
}

export function DashboardContent({
  tickets,
  ticketData,
  updateTicketData,
  renderKey,
  theme,
  onAIFillAll,
  onQuickFill,
  onClear,
  onRefresh,
  onCopy,
  onSave,
  onSendSlack,
}: DashboardContentProps) {
  const columns = useMemo(
    () => createColumns({ ticketData, updateTicketData, renderKey }),
    [updateTicketData, renderKey]
  );

  return (
    <main className={`flex-1 overflow-hidden px-4 sm:px-6 py-9 sm:py-4 pb-20 sm:pb-4 relative z-10 ${theme === "pixel" ? "pb-12" : ""}`}>
      <TicketsTable
        columns={columns}
        data={tickets}
        theme={theme}
        actionButtons={
          <DashboardActions
            theme={theme}
            onAIFillAll={onAIFillAll}
            onQuickFill={onQuickFill}
            onClear={onClear}
            onRefresh={onRefresh}
            onCopy={onCopy}
            onSave={onSave}
            onSendSlack={onSendSlack}
          />
        }
      />
    </main>
  );
}

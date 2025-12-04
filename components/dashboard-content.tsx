"use client";

import { useMemo } from "react";
import { TicketsTable } from "@/components/tickets-table";
import { createColumns } from "@/app/columns";
import type { Ticket } from "@/interfaces/ticket.interface";
import { DashboardActions } from "./dashboard-actions";
import { Theme } from "@/enums/theme.enum";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ticketData excluded to prevent input re-mount on every keystroke
    [updateTicketData, renderKey]
  );

  return (
    <main className="flex-1 overflow-hidden px-4 sm:px-6 py-4 sm:py-4 pb-20 sm:pb-4">
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

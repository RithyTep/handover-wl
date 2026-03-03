"use client"

import { useMemo } from "react"
import { TicketsTable } from "@/components/tickets-table"
import { createColumns } from "@/app/columns"
import { createReleaseDateColumns } from "@/app/columns-release-date"
import type { Ticket, Theme, DashboardTab } from "@/lib/types"
import { DashboardActions } from "./dashboard-actions"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardContentProps {
  tickets: Ticket[];
  ticketData: Record<string, string>;
  updateTicketData: (key: string, value: string) => void;
  renderKey: number;
  theme: Theme;
  activeTab: DashboardTab;
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
  activeTab,
  onAIFillAll,
  onQuickFill,
  onClear,
  onRefresh,
  onCopy,
  onSave,
  onSendSlack,
}: DashboardContentProps) {
  const pendingColumns = useMemo(
    () => createColumns({ ticketData, updateTicketData, renderKey }),
    [updateTicketData, renderKey]
  );

  const releaseDateColumns = useMemo(() => createReleaseDateColumns(), []);

  const columns = activeTab === "pending" ? pendingColumns : releaseDateColumns;

  return (
    <main className={`flex-1 overflow-hidden px-4 sm:px-6 py-9 sm:py-4 pb-20 sm:pb-4 relative z-10 ${theme === "pixel" ? "pb-12" : ""}`}>
      <TicketsTable
        columns={columns}
        data={tickets}
        theme={theme}
        actionButtons={
          activeTab === "pending" ? (
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
          ) : (
            <div className="hidden sm:flex items-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="text-white/70 hover:text-white text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Refresh
              </Button>
            </div>
          )
        }
      />
    </main>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { ChristmasLoading } from "@/components/christmas-loading";
import { DashboardLayout } from "./dashboard-layout";
import { useTickets } from "@/hooks/ticket/use-tickets.hook";
import { useTicketActions } from "@/hooks/ticket/use-ticket-actions.hook";
import { useThemeStore } from "@/lib/stores/theme-store";
import { Theme } from "@/enums/theme.enum";
import { DEFAULT_THEME } from "@/lib/constants";
import type { Ticket } from "@/interfaces/ticket.interface";

interface DashboardClientProps {
  initialTickets?: Ticket[];
}

export function DashboardClient({ initialTickets }: DashboardClientProps = {}) {
  const { tickets, isLoading, refetch } = useTickets({ initialTickets });
  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const loadFromLocalStorage = useThemeStore((state) => state.loadFromLocalStorage);
  const theme: Theme = selectedTheme ?? DEFAULT_THEME;

  // Load theme from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  const {
    ticketData,
    updateTicketData,
    renderKey,
    handleSave,
    handleSendSlack,
    handleAIFillAll,
    handleCopyForSlack,
    handleQuickFill: handleQuickFillAction,
    handleClear: handleClearAction,
  } = useTicketActions({ tickets });

  const [quickFillOpen, setQuickFillOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [sendSlackOpen, setSendSlackOpen] = useState(false);

  const handleQuickFill = useCallback(
    (status: string, action: string) => {
      handleQuickFillAction(status, action);
      setQuickFillOpen(false);
    },
    [handleQuickFillAction]
  );

  const handleClear = useCallback(() => {
    handleClearAction();
    setClearOpen(false);
  }, [handleClearAction]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-background">
        <ChristmasLoading />
      </div>
    );
  }

  return (
    <DashboardLayout
      theme={theme}
      tickets={tickets}
      ticketData={ticketData}
      updateTicketData={updateTicketData}
      renderKey={renderKey}
      onAIFillAll={handleAIFillAll}
      onQuickFill={handleQuickFill}
      onClear={handleClear}
      onRefresh={() => refetch()}
      onCopy={handleCopyForSlack}
      onSave={handleSave}
      onSendSlack={handleSendSlack}
      quickFillOpen={quickFillOpen}
      onQuickFillOpenChange={setQuickFillOpen}
      clearOpen={clearOpen}
      onClearOpenChange={setClearOpen}
      sendSlackOpen={sendSlackOpen}
      onSendSlackOpenChange={setSendSlackOpen}
    />
  );
}

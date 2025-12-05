"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { DashboardLayout } from "./dashboard-layout";
import { useTickets } from "@/hooks/ticket/use-tickets.hook";
import { useTicketActions } from "@/hooks/ticket/use-ticket-actions.hook";
import { useThemeStore } from "@/lib/stores/theme-store";
import { Theme } from "@/enums/theme.enum";
import { DEFAULT_THEME } from "@/lib/constants";
import type { Ticket } from "@/interfaces/ticket.interface";

interface DashboardClientProps {
  initialTickets?: Ticket[];
  initialTheme?: Theme;
}

export function DashboardClient({ initialTickets, initialTheme }: DashboardClientProps = {}) {
  const { tickets, refetch } = useTickets({ initialTickets });
  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const loadFromLocalStorage = useThemeStore((state) => state.loadFromLocalStorage);

  // Use SSR theme immediately, then allow client-side updates
  const theme: Theme = selectedTheme ?? initialTheme ?? DEFAULT_THEME;

  // Initialize theme store with SSR value, then check localStorage for overrides
  useEffect(() => {
    // First set the SSR theme if store is empty
    if (initialTheme && !selectedTheme) {
      setTheme(initialTheme);
    }
    // Then check localStorage for any user overrides
    loadFromLocalStorage();
  }, [initialTheme, selectedTheme, setTheme, loadFromLocalStorage]);

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

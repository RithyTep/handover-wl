"use client";

import { useEffect } from "react";
import { NewYearScene } from "@/components/new-year-scene";
import { DashboardHeader } from "./dashboard-header";
import { DashboardContent } from "./dashboard-content";
import { DashboardMobileActions } from "./dashboard-mobile-actions";
import { CommandPalette } from "@/components/command-palette";
import { QuickFillDialog } from "./quick-fill-dialog";
import { ClearDialog } from "./clear-dialog";
import { SendSlackDialog } from "./send-slack-dialog";
import { cn } from "@/lib/utils";
import { Theme } from "@/enums/theme.enum";
import type { Ticket } from "@/interfaces/ticket.interface";

interface DashboardLayoutProps {
  theme: Theme;
  tickets: Ticket[];
  ticketData: Record<string, string>;
  updateTicketData: (key: string, value: string) => void;
  renderKey: number;
  onAIFillAll: () => void;
  onQuickFill: (status: string, action: string) => void;
  onClear: () => void;
  onRefresh: () => void;
  onCopy: () => void;
  onSave: () => void;
  onSendSlack: () => Promise<void>;
  quickFillOpen: boolean;
  onQuickFillOpenChange: (open: boolean) => void;
  clearOpen: boolean;
  onClearOpenChange: (open: boolean) => void;
  sendSlackOpen: boolean;
  onSendSlackOpenChange: (open: boolean) => void;
}

export function DashboardLayout({
  theme,
  tickets,
  ticketData,
  updateTicketData,
  renderKey,
  onAIFillAll,
  onQuickFill,
  onClear,
  onRefresh,
  onCopy,
  onSave,
  onSendSlack,
  quickFillOpen,
  onQuickFillOpenChange,
  clearOpen,
  onClearOpenChange,
  sendSlackOpen,
  onSendSlackOpenChange,
}: DashboardLayoutProps) {
  useEffect(() => {
    document.body.classList.remove("theme-christmas", "theme-default");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <>
      <CommandPalette
        onAIFillAll={onAIFillAll}
        onQuickFill={() => onQuickFillOpenChange(true)}
        onClear={() => onClearOpenChange(true)}
        onSave={onSave}
        onSendSlack={() => onSendSlackOpenChange(true)}
        onCopy={onCopy}
        onRefresh={onRefresh}
      />
      <div
        className={cn(
          "h-dvh flex flex-col overflow-hidden relative",
          theme === Theme.CHRISTMAS ? "christmas-bg" : "bg-background"
        )}
      >
        {theme === Theme.CHRISTMAS && <NewYearScene />}
        <DashboardHeader theme={theme} ticketCount={tickets.length} />
        <DashboardContent
          tickets={tickets}
          ticketData={ticketData}
          updateTicketData={updateTicketData}
          renderKey={renderKey}
          theme={theme}
          onAIFillAll={onAIFillAll}
          onQuickFill={() => onQuickFillOpenChange(true)}
          onClear={() => onClearOpenChange(true)}
          onRefresh={onRefresh}
          onCopy={onCopy}
          onSave={onSave}
          onSendSlack={() => onSendSlackOpenChange(true)}
        />
        <DashboardMobileActions
          theme={theme}
          onAIFillAll={onAIFillAll}
          onQuickFill={() => onQuickFillOpenChange(true)}
          onClear={() => onClearOpenChange(true)}
          onSave={onSave}
          onSendSlack={() => onSendSlackOpenChange(true)}
        />
      </div>
      <QuickFillDialog
        open={quickFillOpen}
        onOpenChange={onQuickFillOpenChange}
        onQuickFill={onQuickFill}
      />
      <ClearDialog
        open={clearOpen}
        onOpenChange={onClearOpenChange}
        onClearAll={onClear}
      />
      <SendSlackDialog
        open={sendSlackOpen}
        onOpenChange={onSendSlackOpenChange}
        onSendSlack={onSendSlack}
      />
    </>
  );
}

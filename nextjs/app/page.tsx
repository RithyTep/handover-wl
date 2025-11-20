"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Save,
  Send,
  Zap,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Copy,
  Command,
  History,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { TicketsTable } from "@/components/tickets-table";
import { createColumns, Ticket } from "./columns";
import { CommandPalette } from "@/components/command-palette";

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("tickets");
  const [renderKey, setRenderKey] = useState(0);

  // Dialog states
  const [quickFillDialog, setQuickFillDialog] = useState(false);
  const [quickFillStatus, setQuickFillStatus] = useState("Pending");
  const [quickFillAction, setQuickFillAction] = useState("Will check tomorrow");

  const [clearDialog, setClearDialog] = useState(false);
  const [sendSlackDialog, setSendSlackDialog] = useState(false);

  // 🎉 Confetti celebration helper
  const celebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Cmd/Ctrl + Shift + L to toggle theme (handled by ThemeToggle component)
      // / to focus search is handled by the Input component's autofocus
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [ticketData]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/tickets");
      setTickets(response.data.tickets);

      // Initialize ticket data
      const data: Record<string, string> = {};
      response.data.tickets.forEach((ticket: Ticket) => {
        data[`status-${ticket.key}`] = ticket.savedStatus;
        data[`action-${ticket.key}`] = ticket.savedAction;
      });
      setTicketData(data);
    } catch (error: any) {
      toast.error("Error loading tickets: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketData = useCallback((key: string, value: string) => {
    setTicketData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Create columns with current ticketData and update function
  const columns = useMemo(
    () => createColumns({ ticketData, updateTicketData, renderKey }),
    [updateTicketData, renderKey]
  );

  const getStats = () => {
    const statusCount = Object.keys(ticketData)
      .filter((k) => k.startsWith("status-"))
      .filter((k) => ticketData[k] && ticketData[k] !== "--").length;

    const actionCount = Object.keys(ticketData)
      .filter((k) => k.startsWith("action-"))
      .filter((k) => ticketData[k] && ticketData[k] !== "--").length;

    return { statusCount, actionCount, total: tickets.length };
  };

  const handleQuickFill = () => {
    const newData = { ...ticketData };
    tickets.forEach((ticket) => {
      newData[`status-${ticket.key}`] = quickFillStatus;
      newData[`action-${ticket.key}`] = quickFillAction;
    });
    setTicketData(newData);

    // Update tickets state to trigger re-render with new defaultValues
    setTickets(prevTickets =>
      prevTickets.map(ticket => ({
        ...ticket,
        savedStatus: quickFillStatus,
        savedAction: quickFillAction,
      }))
    );

    // Force re-render of inputs
    setRenderKey(prev => prev + 1);

    setQuickFillDialog(false);
    celebrate(); // 🎉
    toast.success("All tickets have been filled");
  };

  const handleClearAll = () => {
    const newData = { ...ticketData };
    Object.keys(newData).forEach((key) => {
      newData[key] = "--";
    });
    setTicketData(newData);

    // Update tickets state to trigger re-render with cleared defaultValues
    setTickets(prevTickets =>
      prevTickets.map(ticket => ({
        ...ticket,
        savedStatus: "--",
        savedAction: "--",
      }))
    );

    // Force re-render of inputs
    setRenderKey(prev => prev + 1);

    setClearDialog(false);
    toast.success("All fields have been cleared");
  };

  const handleSave = async () => {
    const loadingToast = toast.loading("Saving...");
    try {
      await axios.post("/api/save", ticketData);
      toast.dismiss(loadingToast);
      celebrate(); // 🎉
      toast.success("Your changes have been saved");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Error saving: " + error.message);
    }
  };

  const handleSendSlack = async () => {
    setSendSlackDialog(false);
    const loadingToast = toast.loading("Sending to Slack...");

    try {
      // Build ticket details map
      const ticketDetails: Record<string, any> = {};
      tickets.forEach((ticket) => {
        ticketDetails[ticket.key] = {
          summary: ticket.summary,
          status: ticket.status,
          assignee: ticket.assignee,
          created: ticket.created,
          dueDate: ticket.dueDate,
          wlMainTicketType: ticket.wlMainTicketType,
          wlSubTicketType: ticket.wlSubTicketType,
          customerLevel: ticket.customerLevel,
        };
      });

      await axios.post("/api/send-slack", {
        ticketData,
        ticketDetails,
      });

      toast.dismiss(loadingToast);
      // 🎊 Epic celebration for Slack send!
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']
      });
      toast.success("Successfully sent to Slack");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Error: " + error.message);
    }
  };

  const handleCopyForSlack = async () => {
    try {
      const JIRA_URL = process.env.NEXT_PUBLIC_JIRA_URL || "https://olympian.atlassian.net";

      // Get all ticket keys with filled data
      const ticketKeys = Object.keys(ticketData)
        .filter((key) => key.startsWith("status-"))
        .map((key) => key.replace("status-", ""));

      // Filter tickets that have status or action filled
      const filledTickets = ticketKeys.filter((ticketKey) => {
        const status = ticketData[`status-${ticketKey}`];
        const action = ticketData[`action-${ticketKey}`];
        return status !== "--" || action !== "--";
      });

      if (filledTickets.length === 0) {
        toast.error("No tickets with filled status or action");
        return;
      }

      // Build Slack message matching table columns
      let message = "";
      filledTickets.forEach((ticketKey, index) => {
        const status = ticketData[`status-${ticketKey}`] || "--";
        const action = ticketData[`action-${ticketKey}`] || "--";
        const ticket = tickets.find((t) => t.key === ticketKey);
        const summary = ticket?.summary || "";
        const wlMainType = ticket?.wlMainTicketType || "--";
        const wlSubType = ticket?.wlSubTicketType || "--";
        const ticketUrl = `${JIRA_URL}/browse/${ticketKey}`;

        message += `--- Ticket ${index + 1} ---\n`;
        message += `Ticket Link: <${ticketUrl}> ${summary}\n`;
        message += `WL Main Type: ${wlMainType}\n`;
        message += `WL Sub Type: ${wlSubType}\n`;
        message += `Status: ${status}\n`;
        message += `Action: ${action}\n`;
        message += `\n`;
      });

      // Copy to clipboard
      await navigator.clipboard.writeText(message.trim());
      toast.success(`Copied ${filledTickets.length} ticket(s) to clipboard`);
    } catch (error: any) {
      toast.error("Error copying to clipboard: " + error.message);
    }
  };

  const handleAIFillAll = async () => {
    // Find tickets with missing status or action
    const missingTickets = tickets.filter((ticket) => {
      const status = ticketData[`status-${ticket.key}`];
      const action = ticketData[`action-${ticket.key}`];
      return !status || status === "--" || !action || action === "--";
    });

    if (missingTickets.length === 0) {
      toast.info("All tickets already have status and action filled");
      return;
    }

    const loadingToast = toast.loading(
      `AI filling ${missingTickets.length} ticket(s)...`
    );

    try {
      // Process tickets in parallel (but limit concurrency to avoid rate limits)
      const batchSize = 3;
      const newData = { ...ticketData };
      const updates: { ticketKey: string; status?: string; action?: string }[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < missingTickets.length; i += batchSize) {
        const batch = missingTickets.slice(i, i + batchSize);

        // Update progress
        toast.loading(
          `AI filling ${i + 1}-${Math.min(i + batchSize, missingTickets.length)} of ${missingTickets.length}...`,
          { id: loadingToast }
        );

        // Process batch in parallel
        const batchResults = await Promise.allSettled(
          batch.map(async (ticket) => {
            const response = await axios.post("/api/ai-autofill", { ticket });
            return { ticket, suggestion: response.data.suggestion };
          })
        );

        // Update ticket data with results
        batchResults.forEach((result) => {
          if (result.status === "fulfilled") {
            const { ticket, suggestion } = result.value;
            const currentStatus = ticketData[`status-${ticket.key}`];
            const currentAction = ticketData[`action-${ticket.key}`];

            const update: { ticketKey: string; status?: string; action?: string } = {
              ticketKey: ticket.key
            };

            // Only update if currently empty
            if (!currentStatus || currentStatus === "--") {
              newData[`status-${ticket.key}`] = suggestion.status;
              update.status = suggestion.status;
            }
            if (!currentAction || currentAction === "--") {
              newData[`action-${ticket.key}`] = suggestion.action;
              update.action = suggestion.action;
            }

            updates.push(update);
            successCount++;
          } else {
            console.error("Failed to fill ticket:", result.reason);
            errorCount++;
          }
        });
      }

      // Update ticket data state
      setTicketData(newData);

      // Update tickets state to trigger re-render with new defaultValues
      setTickets(prevTickets =>
        prevTickets.map(ticket => {
          const update = updates.find(u => u.ticketKey === ticket.key);
          if (update) {
            return {
              ...ticket,
              savedStatus: update.status || ticket.savedStatus,
              savedAction: update.action || ticket.savedAction,
            };
          }
          return ticket;
        })
      );

      // Force re-render of inputs
      setRenderKey(prev => prev + 1);

      toast.dismiss(loadingToast);

      if (errorCount === 0) {
        celebrate();
        toast.success(`Successfully AI-filled ${successCount} ticket(s)`);
      } else {
        toast.warning(
          `Filled ${successCount} ticket(s), ${errorCount} failed`
        );
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Error during AI fill: " + error.message);
    }
  };


  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-background">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-foreground" />
          <p className="text-sm text-muted-foreground">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Command Palette */}
      <CommandPalette
        onAIFillAll={handleAIFillAll}
        onQuickFill={() => setQuickFillDialog(true)}
        onClear={() => setClearDialog(true)}
        onSave={handleSave}
        onSendSlack={() => setSendSlackDialog(true)}
        onCopy={handleCopyForSlack}
        onRefresh={() => window.location.reload()}
      />

      {/* Main Content Area */}
      <div className="h-dvh bg-background flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-12 sm:h-[52px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-foreground">
              Handover
            </h1>
            <span className="text-xs text-muted-foreground">
              {tickets.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Command Palette Hint */}
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground bg-muted/50 border border-border rounded">
              <Command className="w-3 h-3" />
              <span>K</span>
            </kbd>
            <ThemeToggle variant="header" />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden px-4 sm:px-6 py-4 sm:py-4 pb-20 sm:pb-4">
          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <TicketsTable
              columns={columns}
              data={tickets}
              actionButtons={
              <div className="hidden sm:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAIFillAll}
                  className="h-8"
                  title="AI Fill All Missing"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span>AI Fill</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuickFillDialog(true)}
                  className="h-8"
                  title="Quick Fill"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  <span>Fill</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setClearDialog(true)}
                  className="h-8"
                  title="Clear All"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Clear</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="h-8"
                  title="Refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Refresh</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyForSlack}
                  className="h-8"
                  title="Copy for Slack"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  <span>Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="h-8"
                  title="Save Changes"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  <span>Save</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSendSlackDialog(true)}
                  className="h-8"
                  title="Send to Slack"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Send</span>
                </Button>
              </div>
            }
          />
          )}

          {/* History Tab - Coming Soon */}
          {activeTab === "history" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold mb-2">History Logs</h2>
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </div>
            </div>
          )}

          {/* Settings Tab - Coming Soon */}
          {activeTab === "settings" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold mb-2">Settings</h2>
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden z-50">
        <div className="flex items-center justify-around">
          <button
            onClick={handleAIFillAll}
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl active:bg-muted/80 transition-all active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-foreground/70" />
            <span className="text-[9px] font-medium text-muted-foreground mt-0.5">AI</span>
          </button>
          <button
            onClick={() => setQuickFillDialog(true)}
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl active:bg-muted/80 transition-all active:scale-95"
          >
            <Zap className="w-5 h-5 text-foreground/70" />
            <span className="text-[9px] font-medium text-muted-foreground mt-0.5">Fill</span>
          </button>
          <button
            onClick={() => setClearDialog(true)}
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl active:bg-muted/80 transition-all active:scale-95"
          >
            <Trash2 className="w-5 h-5 text-foreground/70" />
            <span className="text-[9px] font-medium text-muted-foreground mt-0.5">Clear</span>
          </button>
          <button
            onClick={handleSave}
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl active:bg-muted/80 transition-all active:scale-95"
          >
            <Save className="w-5 h-5 text-foreground/70" />
            <span className="text-[9px] font-medium text-muted-foreground mt-0.5">Save</span>
          </button>
          <button
            onClick={() => setSendSlackDialog(true)}
            className="flex flex-col items-center justify-center min-w-[52px] min-h-[44px] px-2 rounded-xl bg-primary text-primary-foreground active:bg-primary/90 transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-0.5">Send</span>
          </button>
        </div>
      </div>

      {/* Quick Fill Dialog */}
      <Dialog open={quickFillDialog} onOpenChange={setQuickFillDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Fill All Tickets</DialogTitle>
            <DialogDescription>
              Fill all tickets with the same status and action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wide">Status</label>
              <Input
                type="text"
                value={quickFillStatus}
                onChange={(e) => setQuickFillStatus(e.target.value)}
                placeholder="Enter status..."
                className="h-11 sm:h-10 text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wide">Action</label>
              <Input
                type="text"
                value={quickFillAction}
                onChange={(e) => setQuickFillAction(e.target.value)}
                placeholder="Enter action..."
                className="h-11 sm:h-10 text-base sm:text-sm"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setQuickFillDialog(false)} className="h-11 sm:h-10 w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleQuickFill} className="h-11 sm:h-10 w-full sm:w-auto">Apply to all</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Clear All Dialog */}
      <Dialog open={clearDialog} onOpenChange={setClearDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 sm:w-6 sm:h-6" />
            </div>
            <DialogTitle className="text-center text-lg">Clear all fields?</DialogTitle>
            <DialogDescription className="text-center text-sm">
              This will clear all status and action fields. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setClearDialog(false)} className="h-11 sm:h-10 w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll} className="h-11 sm:h-10 w-full sm:w-auto">
              Clear all
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Slack Dialog */}
      <Dialog open={sendSlackDialog} onOpenChange={setSendSlackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7 sm:w-6 sm:h-6" />
            </div>
            <DialogTitle className="text-center text-lg">Send to Slack?</DialogTitle>
            <DialogDescription className="text-center text-sm">
              This will save your changes and post the handover report to Slack.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setSendSlackDialog(false)} className="h-11 sm:h-10 w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="success" onClick={handleSendSlack} className="h-11 sm:h-10 w-full sm:w-auto">
              Send to Slack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

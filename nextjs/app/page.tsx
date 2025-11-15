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
  Clock,
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
import { TicketCard } from "@/components/ticket-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { TicketsTable } from "@/components/tickets-table";
import { createColumns, Ticket } from "./columns";
import { SchedulerPage } from "@/components/scheduler-page";
import { Sidebar } from "@/components/sidebar";
import { CommandPalette } from "@/components/command-palette";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("tickets");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle tab changes from sidebar
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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
    () => createColumns({ ticketData, updateTicketData }),
    [updateTicketData]
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
        onQuickFill={() => setQuickFillDialog(true)}
        onClear={() => setClearDialog(true)}
        onSave={handleSave}
        onSendSlack={() => setSendSlackDialog(true)}
        onCopy={handleCopyForSlack}
        onRefresh={() => window.location.reload()}
        onScheduler={() => setActiveTab("scheduler")}
      />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content Area with Linear-inspired layout */}
      <div
        className={cn(
          "h-dvh bg-background flex flex-col overflow-hidden transition-all duration-180",
          sidebarCollapsed ? "ml-14" : "ml-56"
        )}
      >
        {/* Linear-style Header - 52px height, sticky */}
        <header className="h-[52px] flex-shrink-0 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              Jira Handover
            </h1>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-0.5 rounded bg-muted/50">
                {tickets.length} tickets
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Command Palette Hint */}
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground bg-muted/50 border border-border rounded">
              <Command className="w-3 h-3" />
              <span>K</span>
            </kbd>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab("scheduler")}
              className="h-8 w-8"
              title="Scheduler"
            >
              <Clock className="w-4 h-4" />
            </Button>
            <ThemeToggle variant="header" />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden px-6 py-4">
          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <TicketsTable
              columns={columns}
              data={tickets}
              actionButtons={
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuickFillDialog(true)}
                  className="h-8"
                  title="Quick Fill"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Fill</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setClearDialog(true)}
                  className="h-8"
                  title="Clear All"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="h-8"
                  title="Refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyForSlack}
                  className="h-8"
                  title="Copy for Slack"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="h-8"
                  title="Save Changes"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSendSlackDialog(true)}
                  className="h-8"
                  title="Send to Slack"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </>
            }
          />
          )}

          {/* Scheduler Tab */}
          {activeTab === "scheduler" && <SchedulerPage />}

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

      {/* Quick Fill Dialog */}
      <Dialog open={quickFillDialog} onOpenChange={setQuickFillDialog}>
        <DialogContent>
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
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-muted-foreground uppercase tracking-wide">Action</label>
              <Input
                type="text"
                value={quickFillAction}
                onChange={(e) => setQuickFillAction(e.target.value)}
                placeholder="Enter action..."
              />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setQuickFillDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleQuickFill}>Apply to all</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Clear All Dialog */}
      <Dialog open={clearDialog} onOpenChange={setClearDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center">Clear all fields?</DialogTitle>
            <DialogDescription className="text-center">
              This will clear all status and action fields. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              Clear all
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Slack Dialog */}
      <Dialog open={sendSlackDialog} onOpenChange={setSendSlackDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center">Send to Slack?</DialogTitle>
            <DialogDescription className="text-center">
              This will save your changes and post the handover report to Slack.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendSlackDialog(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSendSlack}>
              Send to Slack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

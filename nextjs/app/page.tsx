"use client";

import { useState, useEffect, useMemo } from "react";
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

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState<Record<string, string>>({});

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

  const updateTicketData = (key: string, value: string) => {
    setTicketData({ ...ticketData, [key]: value });
  };

  // Create columns with current ticketData and update function
  const columns = useMemo(
    () => createColumns({ ticketData, updateTicketData }),
    [ticketData]
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
      // Build ticket summaries map
      const ticketSummaries: Record<string, string> = {};
      tickets.forEach((ticket) => {
        ticketSummaries[ticket.key] = ticket.summary;
      });

      await axios.post("/api/send-slack", {
        ticketData,
        ticketSummaries,
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
      const JIRA_URL = process.env.NEXT_PUBLIC_JIRA_URL || "https://jira.example.com";

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

      // Build Slack message
      let message = "";
      filledTickets.forEach((ticketKey, index) => {
        const status = ticketData[`status-${ticketKey}`] || "--";
        const action = ticketData[`action-${ticketKey}`] || "--";
        const ticket = tickets.find((t) => t.key === ticketKey);
        const summary = ticket?.summary || "";

        message += `--- Ticket ${index + 1} ---\n`;
        message += `Ticket Link: ${ticket?.jiraUrl || ""} ${summary}\n`;
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Minimal Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-border/40">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
              Handover
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              v3.0.0 By Rithy Tep
            </p>
          </div>
          <ThemeToggle variant="header" />
        </div>

        {/* Tickets Table - Scrollable */}
        <div className="flex-1 overflow-auto px-3 sm:px-6 py-3">
          <TicketsTable
            columns={columns}
            data={tickets}
            actionButtons={
              <>
                <Button
                  variant="outline"
                  onClick={() => setQuickFillDialog(true)}
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs border-border/40 hover:bg-muted/50"
                  title="Quick Fill"
                >
                  <Zap className="w-3 h-3 sm:mr-1.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setClearDialog(true)}
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs border-border/40 hover:bg-muted/50"
                  title="Clear"
                >
                  <Trash2 className="w-3 h-3 sm:mr-1.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="h-7 sm:h-8 w-7 sm:w-8 p-0 border-border/40 hover:bg-muted/50"
                  title="Refresh"
                >
                  <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyForSlack}
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs border-border/40 hover:bg-muted/50"
                  title="Copy"
                >
                  <Copy className="w-3 h-3 sm:mr-1.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs border-border/40 hover:bg-muted/50"
                  title="Save"
                >
                  <Save className="w-3 h-3 sm:mr-1.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSendSlackDialog(true)}
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs border-border/40 hover:bg-muted/50"
                  title="Send to Slack"
                >
                  <Send className="w-3 h-3 sm:mr-1.5" />
                </Button>

              </>
            }
          />
        </div>
      </main>

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
    </div>
  );
}

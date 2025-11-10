"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  ClipboardList,
  Save,
  Send,
  Zap,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Search,
  Filter,
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

interface Ticket {
  key: string;
  summary: string;
  status: string;
  jiraUrl: string;
  savedStatus: string;
  savedAction: string;
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [quickFillDialog, setQuickFillDialog] = useState(false);
  const [quickFillStatus, setQuickFillStatus] = useState("Pending");
  const [quickFillAction, setQuickFillAction] = useState("Will check tomorrow");

  const [clearDialog, setClearDialog] = useState(false);
  const [sendSlackDialog, setSendSlackDialog] = useState(false);
  const [refreshDialog, setRefreshDialog] = useState(false);

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

  // Filter tickets based on search
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">WL - Handover</h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                Track and manage your ticket status and actions By Rithy Tep v2.0.0
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <ThemeToggle variant="header" />
              <Button variant="secondary" onClick={handleCopyForSlack} className="h-10 px-4">
                <Copy className="h-4 w-4 mr-2" />
                <span>Copy</span>
              </Button>
              <Button variant="outline" onClick={handleSave} className="h-10 px-4">
                <Save className="h-4 w-4 mr-2" />
                <span>Save</span>
              </Button>
              <Button onClick={() => setSendSlackDialog(true)} className="h-10 px-4">
                <Send className="h-4 w-4 mr-2" />
                <span>Send to Slack</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                <Button variant="secondary" onClick={() => setQuickFillDialog(true)} className="h-10 px-4">
                  <Zap className="w-4 h-4 mr-2" />
                  <span>Quick Fill</span>
                </Button>
                <Button variant="secondary" onClick={() => setClearDialog(true)} className="h-10 px-4">
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Clear All</span>
                </Button>
                <Button variant="secondary" onClick={() => setRefreshDialog(true)} className="h-10 px-4">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  <span>Refresh</span>
                </Button>
              </div>
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
            </div>

            {/* Tickets Table */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-muted border-b border-border sticky top-0 z-10">
                    <tr>
                      <th className="text-left p-2 sm:p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap bg-muted">
                        #
                      </th>
                      <th className="text-left p-2 sm:p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap bg-muted">
                        Ticket
                      </th>
                      <th className="text-left p-2 sm:p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap bg-muted">
                        Summary
                      </th>
                      <th className="text-left p-2 sm:p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap bg-muted">
                        Status
                      </th>
                      <th className="text-left p-2 sm:p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap bg-muted">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket, index) => {
                        const statusValue = ticketData[`status-${ticket.key}`] || "--";
                        const actionValue = ticketData[`action-${ticket.key}`] || "--";

                        return (
                          <tr
                            key={ticket.key}
                            className={`border-b border-border hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "bg-card" : "bg-muted/10"
                              }`}
                          >
                            <td className="p-2 sm:p-4 text-muted-foreground font-medium text-xs sm:text-sm">
                              {index + 1}
                            </td>
                            <td className="p-2 sm:p-4">
                              <a
                                href={ticket.jiraUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-semibold text-xs sm:text-sm whitespace-nowrap"
                              >
                                {ticket.key}
                              </a>
                            </td>
                            <td className="p-2 sm:p-4 text-xs sm:text-sm text-foreground max-w-md">
                              {ticket.summary}
                            </td>
                            <td className="p-2 sm:p-4">
                              <Input
                                value={statusValue === "--" ? "" : statusValue}
                                onChange={(e) => updateTicketData(`status-${ticket.key}`, e.target.value || "--")}
                                placeholder="Enter status..."
                                className="w-full min-w-[150px]"
                              />
                            </td>
                            <td className="p-2 sm:p-4">
                              <Input
                                value={actionValue === "--" ? "" : actionValue}
                                onChange={(e) => updateTicketData(`action-${ticket.key}`, e.target.value || "--")}
                                placeholder="Enter action..."
                                className="w-full min-w-[150px]"
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-muted-foreground">
                          <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>No tickets found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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

      {/* Refresh Dialog */}
      <Dialog open={refreshDialog} onOpenChange={setRefreshDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center">Refresh from Jira?</DialogTitle>
            <DialogDescription className="text-center">
              Unsaved changes will be lost. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefreshDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

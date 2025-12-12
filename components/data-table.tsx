"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface Ticket {
  key: string;
  summary: string;
  status: string;
  jiraUrl: string;
  savedStatus: string;
  savedAction: string;
}

interface DataTableProps {
  tickets: Ticket[];
  ticketData: Record<string, string>;
  onUpdate: (key: string, value: string) => void;
}

export function DataTable({ tickets, ticketData, onUpdate }: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTickets = tickets.filter((ticket) =>
    ticket.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-sm"
          aria-label="Search tickets by key or summary"
          role="searchbox"
        />
        <div className="text-sm text-muted-foreground" aria-live="polite">
          {filteredTickets.length} ticket(s) total
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden" role="region" aria-label="Tickets table">
        <table className="w-full" aria-describedby="tickets-count">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th scope="col" className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                #
              </th>
              <th scope="col" className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Ticket
              </th>
              <th scope="col" className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Summary
              </th>
              <th scope="col" className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Jira Status
              </th>
              <th scope="col" className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th scope="col" className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
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
                    className={`border-b border-border hover:bg-muted/30 transition-colors ${
                      index % 2 === 0 ? "bg-card" : "bg-muted/10"
                    }`}
                  >
                    <td className="p-4 text-muted-foreground font-medium">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <a
                        href={ticket.jiraUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-semibold"
                      >
                        {ticket.key}
                      </a>
                    </td>
                    <td className="p-4 text-sm text-foreground max-w-md">
                      {ticket.summary}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-1 text-xs rounded-lg bg-secondary text-secondary-foreground">
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Input
                        value={statusValue === "--" ? "" : statusValue}
                        onChange={(e) => onUpdate(`status-${ticket.key}`, e.target.value || "--")}
                        placeholder="Enter status..."
                        className="w-full"
                        aria-label={`Status for ticket ${ticket.key}`}
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        value={actionValue === "--" ? "" : actionValue}
                        onChange={(e) => onUpdate(`action-${ticket.key}`, e.target.value || "--")}
                        placeholder="Enter action..."
                        className="w-full"
                        aria-label={`Action for ticket ${ticket.key}`}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-muted-foreground">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

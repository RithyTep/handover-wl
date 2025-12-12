"use client";

import { Edit, ExternalLink } from "lucide-react";

interface TicketCardProps {
  ticket: {
    key: string;
    summary: string;
    status: string;
    jiraUrl: string;
    savedStatus: string;
    savedAction: string;
  };
  ticketData: Record<string, string>;
  onEdit: (key: string, field: string, summary: string) => void;
}

export function TicketCard({ ticket, ticketData, onEdit }: TicketCardProps) {
  const statusValue = ticketData[`status-${ticket.key}`] || "--";
  const actionValue = ticketData[`action-${ticket.key}`] || "--";

  return (
    <article
      className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-200 hover:shadow-glow-sm group"
      aria-label={`Ticket ${ticket.key}: ${ticket.summary}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <a
            href={ticket.jiraUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg transition-colors group/link"
          >
            {ticket.key}
            <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {ticket.summary}
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
          {ticket.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Status
          </label>
          <button
            onClick={() => onEdit(ticket.key, "status", ticket.summary)}
            className={`
              w-full px-4 py-3 rounded-xl border border-border bg-secondary/50
              hover:bg-secondary hover:border-primary/30 transition-all duration-200
              flex items-center justify-between group/btn
              ${statusValue === "--" ? "text-muted-foreground italic" : "text-foreground"}
            `}
            aria-label={`Edit status for ${ticket.key}, current value: ${statusValue}`}
          >
            <span className="text-sm">{statusValue}</span>
            <Edit className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Action
          </label>
          <button
            onClick={() => onEdit(ticket.key, "action", ticket.summary)}
            className={`
              w-full px-4 py-3 rounded-xl border border-border bg-secondary/50
              hover:bg-secondary hover:border-primary/30 transition-all duration-200
              flex items-center justify-between group/btn
              ${actionValue === "--" ? "text-muted-foreground italic" : "text-foreground"}
            `}
            aria-label={`Edit action for ${ticket.key}, current value: ${actionValue}`}
          >
            <span className="text-sm">{actionValue}</span>
            <Edit className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

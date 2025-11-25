"use client";

import { useState, useEffect, useRef } from "react";
import { X, ExternalLink, CheckCircle2, Clock, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ticket } from "@/app/columns";

interface TicketPreviewProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
  onMouseLeave?: () => void;
  anchorElement: HTMLElement | null;
}

export function TicketPreview({
  ticket,
  isOpen,
  onClose,
  onMouseLeave,
  anchorElement,
}: TicketPreviewProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && anchorElement) {
      const updatePosition = () => {
        const rect = anchorElement.getBoundingClientRect();
        const previewWidth = 420;
        const previewHeight = 320;
        const padding = 16;

        let left = rect.right + padding;
        let top = rect.top;

        if (left + previewWidth > window.innerWidth - padding) {
          left = rect.left - previewWidth - padding;
        }

        if (top + previewHeight > window.innerHeight - padding) {
          top = window.innerHeight - previewHeight - padding;
        }

        if (top < padding) {
          top = padding;
        }

        setPosition({ top, left });
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }
  }, [isOpen, anchorElement]);

  if (!isOpen) return null;

  const handleMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (previewRef.current && relatedTarget) {
      if (previewRef.current.contains(relatedTarget)) {
        return;
      }
    }
    onMouseLeave?.();
  };

  return (
    <>
      <div
        ref={previewRef}
        data-ticket-preview
        className={cn(
          "fixed z-50 bg-card rounded-lg shadow-2xl border border-border",
          "w-[420px]",
          "animate-in fade-in slide-in-from-bottom-2 duration-200"
        )}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">{ticket.key}</span>
          </div>
          <div className="flex items-center gap-1">
            <a
              href={ticket.jiraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors"
              title="Open in Jira"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-muted/50 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Summary */}
          <div>
            <h3 className="text-sm font-medium text-foreground leading-snug">
              {ticket.summary}
            </h3>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Status */}
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">Status</div>
                <div className="text-xs text-foreground truncate">{ticket.status}</div>
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-start gap-2">
              <User className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">Assignee</div>
                <div className="flex items-center gap-1.5">
                  {ticket.assigneeAvatar && (
                    <img
                      src={ticket.assigneeAvatar}
                      alt={ticket.assignee}
                      className="w-4 h-4 rounded-full ring-1 ring-border flex-shrink-0"
                    />
                  )}
                  <span className="text-xs text-foreground truncate">{ticket.assignee}</span>
                </div>
              </div>
            </div>

            {/* Created */}
            <div className="flex items-start gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">Created</div>
                <div className="text-xs text-foreground">
                  {new Date(ticket.created).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Due Date */}
            {ticket.dueDate && (
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">Due Date</div>
                  <div className="text-xs text-foreground">
                    {new Date(ticket.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {(ticket.wlMainTicketType || ticket.wlSubTicketType || ticket.customerLevel) && (
            <div className="pt-2 border-t border-border space-y-2">
              {ticket.wlMainTicketType && ticket.wlMainTicketType !== "N/A" && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Main Type</span>
                  <span className="text-xs text-foreground">{ticket.wlMainTicketType}</span>
                </div>
              )}
              {ticket.wlSubTicketType && ticket.wlSubTicketType !== "N/A" && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Sub Type</span>
                  <span className="text-xs text-foreground">{ticket.wlSubTicketType}</span>
                </div>
              )}
              {ticket.customerLevel && ticket.customerLevel !== "N/A" && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Customer Level</span>
                  <span className="text-xs text-foreground">{ticket.customerLevel}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

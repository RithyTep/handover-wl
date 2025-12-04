"use client";

import { MessageSquare, FileText, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/theme/theme-selector.component";
import Link from "next/link";
import { Theme } from "@/enums/theme.enum";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  theme: Theme;
  ticketCount: number;
}

export function DashboardHeader({ theme, ticketCount }: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "h-12 sm:h-[52px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b z-10",
        theme === Theme.CHRISTMAS
          ? "border-white/20 bg-black/20 backdrop-blur-sm"
          : "border-border bg-background/95 backdrop-blur-sm"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1
            className={cn(
              "text-2xl flex items-center gap-2",
              theme === Theme.CHRISTMAS
                ? "text-white christmas-header-text"
                : "text-foreground"
            )}
          >
            {theme === Theme.CHRISTMAS && <span className="text-2xl">🎄</span>}
            <span
              className={cn(
                theme === Theme.CHRISTMAS
                  ? "font-script christmas-title-gradient"
                  : "font-semibold"
              )}
            >
              Handover
            </span>
          </h1>
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            theme === Theme.CHRISTMAS
              ? "text-white/80 bg-white/10"
              : "text-muted-foreground bg-muted"
          )}
        >
          {ticketCount}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <ThemeSelector variant={theme} />
        <Link href="/feedback">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              theme === Theme.CHRISTMAS &&
                "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <MessageSquare className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Feedback</span>
          </Button>
        </Link>
        <Link href="/changelog">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              theme === Theme.CHRISTMAS &&
                "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Changelog</span>
          </Button>
        </Link>
        <kbd
          className={cn(
            "hidden sm:flex items-center gap-1 px-2 py-1 text-xs rounded",
            theme === Theme.CHRISTMAS
              ? "text-white/70 bg-white/10 border border-white/20"
              : "bg-muted border border-border"
          )}
        >
          <Command className="w-3 h-3" />
          <span>K</span>
        </kbd>
      </div>
    </header>
  );
}

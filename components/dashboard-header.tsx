"use client";

import { MessageSquare, FileText, Command, Gamepad2 } from "lucide-react";
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
          : theme === Theme.PIXEL
          ? "border-b-2 border-slate-800 bg-transparent pb-6"
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
                : theme === Theme.PIXEL
                ? "text-white tracking-tight"
                : "text-foreground"
            )}
          >
            {theme === Theme.CHRISTMAS && <span className="text-2xl">🎄</span>}
            {theme === Theme.PIXEL && <Gamepad2 className="w-8 h-8 text-indigo-400" />}
            <span
              className={cn(
                theme === Theme.CHRISTMAS
                  ? "font-script christmas-title-gradient"
                  : theme === Theme.PIXEL
                  ? "font-bold"
                  : "font-semibold"
              )}
            >
              Handover
            </span>
          </h1>
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2 py-0.5",
            theme === Theme.CHRISTMAS
              ? "text-white/80 bg-white/10 rounded-full"
              : theme === Theme.PIXEL
              ? "bg-indigo-500 text-black pixel-shadow-sm border-2 border-black/20"
              : "text-muted-foreground bg-muted rounded-full"
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
              theme === Theme.CHRISTMAS
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : theme === Theme.PIXEL
                ? "text-slate-300 hover:text-indigo-400 transition-colors"
                : ""
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
              theme === Theme.CHRISTMAS
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : theme === Theme.PIXEL
                ? "text-slate-300 hover:text-indigo-400 transition-colors"
                : ""
            )}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Changelog</span>
          </Button>
        </Link>
        <kbd
          className={cn(
            "hidden sm:flex items-center gap-1 px-2 py-1 text-xs",
            theme === Theme.CHRISTMAS
              ? "text-white/70 bg-white/10 border border-white/20 rounded"
              : theme === Theme.PIXEL
              ? "text-slate-500 border-2 border-slate-800 bg-slate-900"
              : "bg-muted border border-border rounded"
          )}
        >
          <Command className="w-3 h-3" />
          <span>K</span>
        </kbd>
      </div>
    </header>
  );
}

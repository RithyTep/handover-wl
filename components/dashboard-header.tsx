"use client";

import { MessageSquare, FileText, Command, Gamepad2, Flower2, Terminal } from "lucide-react";
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
          : theme === Theme.LUNAR
          ? "border-stone-800/50 bg-stone-900/30 backdrop-blur-sm"
          : theme === Theme.CODING
          ? "border-green-900/30 bg-black/80 backdrop-blur-sm"
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
                : theme === Theme.LUNAR
                ? "text-stone-200"
                : theme === Theme.CODING
                ? "text-green-500/80 font-mono"
                : "text-foreground"
            )}
          >
            {theme === Theme.CHRISTMAS && <span className="text-2xl">🎄</span>}
            {theme === Theme.PIXEL && <Gamepad2 className="w-8 h-8 text-indigo-400" />}
            {theme === Theme.LUNAR && <Flower2 className="w-7 h-7 text-red-500" />}
            {theme === Theme.CODING && <Terminal className="w-7 h-7 text-green-600" />}
            <span
              className={cn(
                theme === Theme.CHRISTMAS
                  ? "font-script christmas-title-gradient"
                  : theme === Theme.PIXEL
                  ? "font-bold"
                  : theme === Theme.LUNAR
                  ? "font-semibold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent"
                  : theme === Theme.CODING
                  ? "font-bold coding-glitch"
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
              : theme === Theme.LUNAR
              ? "lunar-badge"
              : theme === Theme.CODING
              ? "coding-badge"
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
                : theme === Theme.LUNAR
                ? "text-stone-400 hover:text-amber-400 hover:bg-stone-800/50 transition-colors"
                : theme === Theme.CODING
                ? "text-green-600/70 hover:text-green-500 hover:bg-green-900/10 font-mono transition-colors"
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
                : theme === Theme.LUNAR
                ? "text-stone-400 hover:text-amber-400 hover:bg-stone-800/50 transition-colors"
                : theme === Theme.CODING
                ? "text-green-600/70 hover:text-green-500 hover:bg-green-900/10 font-mono transition-colors"
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
              : theme === Theme.LUNAR
              ? "text-stone-500 bg-stone-900/50 border border-stone-800 rounded"
              : theme === Theme.CODING
              ? "text-green-600 bg-black border border-green-900/50 rounded font-mono"
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

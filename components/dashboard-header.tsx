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
  // Coding theme - IDE style header with SVG icons
  if (theme === Theme.CODING) {
    return (
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Terminal Icon - SVG */}
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
              <img src="/icons/coding/terminal.svg" alt="" className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                Dev<span className="text-indigo-500">Handover</span>
                <span className="text-indigo-500 animate-pulse">_</span>
              </span>
            </div>
          </div>
          <span className="bg-zinc-900 text-zinc-400 text-[10px] px-2 py-0.5 rounded border border-zinc-700 font-medium font-mono flex items-center gap-1">
            <img src="/icons/coding/git-branch.svg" alt="" className="w-3 h-3" />
            v2024.1.0
          </span>
          {/* Git status indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <img src="/icons/coding/commit.svg" alt="" className="w-4 h-4 opacity-50" />
            <img src="/icons/coding/database.svg" alt="" className="w-4 h-4 opacity-50" />
            <img src="/icons/coding/server.svg" alt="" className="w-4 h-4 opacity-50" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ThemeSelector variant={theme} />
          <Link href="/feedback" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-indigo-400 transition-colors font-mono">
            <img src="/icons/coding/bug.svg" alt="" className="w-4 h-4" />
            <span className="hidden sm:inline">Issues</span>
          </Link>
          <Link href="/changelog" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-indigo-400 transition-colors font-mono">
            <img src="/icons/coding/merge.svg" alt="" className="w-4 h-4" />
            <span className="hidden sm:inline">Branches</span>
          </Link>
          <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded border border-zinc-800 text-[10px] text-zinc-500 font-bold bg-zinc-900">
            <img src="/icons/coding/keyboard.svg" alt="" className="w-4 h-4 opacity-50" />
          </div>
        </div>
      </header>
    );
  }

  // Pixel theme header with SVG icons
  if (theme === Theme.PIXEL) {
    return (
      <header className="h-12 sm:h-[52px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b-2 border-slate-800 bg-transparent pb-6 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl flex items-center gap-2 text-white tracking-tight">
              <img src="/icons/pixel/gamepad.svg" alt="" className="w-7 h-7 opacity-80" />
              <span className="font-bold">Handover</span>
            </h1>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 bg-indigo-500 text-black pixel-shadow-sm border-2 border-black/20">
            {ticketCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeSelector variant={theme} />
          <Link href="/feedback">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <img src="/icons/pixel/ghost.svg" alt="" className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
            </Button>
          </Link>
          <Link href="/changelog">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <img src="/icons/pixel/flag.svg" alt="" className="w-4 h-4" />
              <span className="hidden sm:inline">Changelog</span>
            </Button>
          </Link>
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-slate-500 border-2 border-slate-800 bg-slate-900">
            <img src="/icons/pixel/key.svg" alt="" className="w-3 h-3" />
            <span>K</span>
          </kbd>
        </div>
      </header>
    );
  }

  // Lunar theme header with SVG icons
  if (theme === Theme.LUNAR) {
    return (
      <header className="h-12 sm:h-[52px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-stone-800/50 bg-stone-900/30 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl flex items-center gap-2 text-stone-200">
              <img src="/icons/lunar/lantern.svg" alt="" className="w-6 h-8 opacity-80" />
              <span className="font-semibold bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                Handover
              </span>
            </h1>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 lunar-badge">
            {ticketCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeSelector variant={theme} />
          <Link href="/feedback">
            <Button
              variant="ghost"
              size="sm"
              className="text-stone-400 hover:text-amber-400 hover:bg-stone-800/50 transition-colors flex items-center gap-1"
            >
              <img src="/icons/lunar/fan.svg" alt="" className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
            </Button>
          </Link>
          <Link href="/changelog">
            <Button
              variant="ghost"
              size="sm"
              className="text-stone-400 hover:text-amber-400 hover:bg-stone-800/50 transition-colors flex items-center gap-1"
            >
              <img src="/icons/lunar/drum.svg" alt="" className="w-4 h-4" />
              <span className="hidden sm:inline">Changelog</span>
            </Button>
          </Link>
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-stone-500 bg-stone-900/50 border border-stone-800 rounded">
            <img src="/icons/lunar/knot.svg" alt="" className="w-3 h-4" />
            <span>K</span>
          </kbd>
        </div>
      </header>
    );
  }

  // Christmas theme header with SVG icons
  if (theme === Theme.CHRISTMAS) {
    return (
      <header className="h-12 sm:h-[52px] flex-shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-white/20 bg-black/20 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl flex items-center gap-2 text-white">
              <img src="/icons/christmas/tree.svg" alt="" className="w-7 h-7 opacity-80" />
              <span className="font-semibold christmas-title-gradient">Handover</span>
            </h1>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 text-white/80 bg-white/10 rounded-full">
            {ticketCount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeSelector variant={theme} />
          <Link href="/feedback">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1"
            >
              <img src="/icons/christmas/gift.svg" alt="" className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
            </Button>
          </Link>
          <Link href="/changelog">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1"
            >
              <img src="/icons/christmas/holly.svg" alt="" className="w-4 h-4" />
              <span className="hidden sm:inline">Changelog</span>
            </Button>
          </Link>
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-white/70 bg-white/10 border border-white/20 rounded">
            <img src="/icons/christmas/gingerbread.svg" alt="" className="w-3 h-3" />
            <span>K</span>
          </kbd>
        </div>
      </header>
    );
  }

  // Default theme header - Professional bank style
  return (
    <header className="h-14 sm:h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-8 border-b border-slate-200 bg-white shadow-sm z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {/* Professional logo mark */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
              Handover
            </h1>
            <span className="text-[10px] text-slate-400 font-medium -mt-0.5 hidden sm:block">
              Task Management
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="h-5 w-px bg-slate-200" />
          <span className="text-xs font-semibold px-2.5 py-1 text-blue-700 bg-blue-50 rounded-md border border-blue-100">
            {ticketCount} tickets
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSelector variant={theme} />
        <Link href="/feedback">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
            <MessageSquare className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Feedback</span>
          </Button>
        </Link>
        <Link href="/changelog">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
            <FileText className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Changelog</span>
          </Button>
        </Link>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-md font-medium">
          <Command className="w-3 h-3" />
          <span>K</span>
        </kbd>
      </div>
    </header>
  );
}

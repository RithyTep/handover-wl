"use client";

import { Fragment, ReactNode } from "react";
import {
  Save,
  Send,
  Zap,
  Trash2,
  RefreshCw,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Theme } from "@/enums/theme.enum";

interface DashboardActionsProps {
  theme: Theme;
  onAIFillAll: () => void;
  onQuickFill: (status: string, action: string) => void;
  onClear: () => void;
  onRefresh: () => void;
  onCopy: () => void;
  onSave: () => void;
  onSendSlack: () => void;
}

// Helper component for SVG icon in button
function SvgIcon({ src, className }: { src: string; className?: string }) {
  return <img src={src} alt="" className={cn("w-4 h-4", className)} />;
}

export function DashboardActions({
  theme,
  onAIFillAll,
  onQuickFill,
  onClear,
  onRefresh,
  onCopy,
  onSave,
  onSendSlack,
}: DashboardActionsProps) {
  // Pixel theme - Retro game style actions with SVG icons
  if (theme === Theme.PIXEL) {
    return (
      <div className="hidden sm:flex items-center gap-3 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAIFillAll}
          className="h-9 px-4 bg-rose-900/40 text-rose-300 border-2 border-rose-800 hover:bg-rose-900/60 pixel-shadow-sm"
        >
          <SvgIcon src="/icons/pixel/star.svg" className="mr-1.5 animate-pulse" />
          <span>Pixel Fill</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onQuickFill("Pending", "Will check tomorrow")}
          className="h-9 px-4 bg-indigo-900/40 text-indigo-300 border-2 border-indigo-800 hover:bg-indigo-900/60 pixel-shadow-sm"
        >
          <SvgIcon src="/icons/pixel/potion.svg" className="mr-1.5" />
          <span>Fill</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-9 px-4 bg-slate-800 border-2 border-slate-700 hover:border-amber-600 hover:text-amber-500 pixel-shadow-sm"
        >
          <SvgIcon src="/icons/pixel/ghost.svg" className="mr-1.5" />
          <span>Clear</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="h-9 px-4 bg-slate-800 border-2 border-slate-700 hover:border-cyan-500 hover:text-cyan-400 pixel-shadow-sm"
        >
          <SvgIcon src="/icons/pixel/coin.svg" className="mr-1.5 animate-spin-slow" />
          <span>Refresh</span>
        </Button>
        <div className="h-6 w-0.5 bg-slate-800 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-9 px-4 bg-slate-800 border-2 border-slate-700 hover:border-white pixel-shadow-sm"
        >
          <SvgIcon src="/icons/pixel/gem.svg" className="mr-1.5" />
          <span>Copy</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="h-9 px-4 bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 hover:text-emerald-400 pixel-shadow-sm"
        >
          <SvgIcon src="/icons/pixel/chest.svg" className="mr-1.5" />
          <span>Save</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSendSlack}
          className="h-9 px-4 bg-emerald-900/40 text-emerald-300 border-2 border-emerald-700 hover:bg-emerald-900/60 pixel-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5"
        >
          <SvgIcon src="/icons/pixel/flag.svg" className="mr-1.5" />
          <span>Send</span>
        </Button>
      </div>
    );
  }

  // Lunar theme - Chinese New Year style actions with SVG icons
  if (theme === Theme.LUNAR) {
    return (
      <div className="hidden sm:flex items-center gap-3 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAIFillAll}
          className="h-9 px-4 lunar-btn-primary text-white border-none"
        >
          <SvgIcon src="/icons/lunar/dragon.svg" className="mr-1.5 w-5 h-4" />
          <span>Lucky Fill</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onQuickFill("Pending", "Will check tomorrow")}
          className="h-9 px-4 text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg"
        >
          <SvgIcon src="/icons/lunar/red-envelope.svg" className="mr-1.5" />
          <span>Fill</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-9 px-4 text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg"
        >
          <SvgIcon src="/icons/lunar/firecracker.svg" className="mr-1.5 w-3 h-5" />
          <span>Clear</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="h-9 px-4 text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg"
        >
          <SvgIcon src="/icons/lunar/coin.svg" className="mr-1.5 animate-spin-slow" />
          <span>Refresh</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-9 px-4 text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg"
        >
          <SvgIcon src="/icons/lunar/fan.svg" className="mr-1.5" />
          <span>Copy</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="h-9 px-4 text-stone-300 bg-stone-800/50 hover:bg-stone-800 border border-stone-700 rounded-lg"
        >
          <SvgIcon src="/icons/lunar/gold-ingot.svg" className="mr-1.5 w-5 h-4" />
          <span>Save</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSendSlack}
          className="h-9 px-4 text-amber-200 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/50 rounded-lg"
        >
          <SvgIcon src="/icons/lunar/koi.svg" className="mr-1.5" />
          <span>Send</span>
        </Button>
      </div>
    );
  }

  // Coding theme - IDE style actions with SVG icons
  if (theme === Theme.CODING) {
    return (
      <div className="hidden sm:flex items-center gap-3 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAIFillAll}
          className="h-9 px-4 coding-btn font-mono"
        >
          <SvgIcon src="/icons/coding/function.svg" className="mr-1.5" />
          <span>Macro Fill</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onQuickFill("Pending", "Will check tomorrow")}
          className="h-9 px-4 coding-btn font-mono"
        >
          <SvgIcon src="/icons/coding/api.svg" className="mr-1.5" />
          <span>Auto-Fix</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-9 px-4 coding-btn font-mono hover:text-red-500 hover:border-red-500/50"
        >
          <SvgIcon src="/icons/coding/bug.svg" className="mr-1.5" />
          <span>Drop</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="h-9 px-4 coding-btn font-mono"
        >
          <SvgIcon src="/icons/coding/deploy.svg" className="mr-1.5" />
          <span>Reload</span>
        </Button>
        <div className="h-6 w-px bg-zinc-700 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-9 px-4 coding-btn font-mono"
        >
          <SvgIcon src="/icons/coding/code-brackets.svg" className="mr-1.5" />
          <span>Copy</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="h-9 px-4 coding-btn font-mono"
        >
          <SvgIcon src="/icons/coding/database.svg" className="mr-1.5" />
          <span>Save</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSendSlack}
          className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white border-none font-mono font-medium"
        >
          <SvgIcon src="/icons/coding/commit.svg" className="mr-1.5" />
          <span>Commit</span>
        </Button>
      </div>
    );
  }

  // Christmas theme actions with SVG icons
  if (theme === Theme.CHRISTMAS) {
    return (
      <div className="hidden sm:flex items-center gap-3 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAIFillAll}
          className="h-9 px-4 text-red-100 bg-red-900/50 hover:bg-red-900/70 border border-red-500/30 snow-btn"
        >
          <SvgIcon src="/icons/christmas/santa.svg" className="mr-1.5" />
          <span>Santa Fill</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onQuickFill("Pending", "Will check tomorrow")}
          className="h-9 px-4 text-blue-100 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-500/30 snow-btn"
        >
          <SvgIcon src="/icons/christmas/snowflake.svg" className="mr-1.5 animate-spin-slow" />
          <span>Fill</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-9 px-4 text-yellow-100 bg-yellow-900/50 hover:bg-yellow-900/70 border border-yellow-500/30 snow-btn"
        >
          <SvgIcon src="/icons/christmas/bell.svg" className="mr-1.5" />
          <span>Clear</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="h-9 px-4 text-purple-100 bg-purple-900/50 hover:bg-purple-900/70 border border-purple-500/30 snow-btn"
        >
          <SvgIcon src="/icons/christmas/ornament.svg" className="mr-1.5 animate-bounce" />
          <span>Refresh</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-9 px-4 text-cyan-100 bg-cyan-900/50 hover:bg-cyan-900/70 border border-cyan-500/30 snow-btn"
        >
          <SvgIcon src="/icons/christmas/candy-cane.svg" className="mr-1.5" />
          <span>Copy</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="h-9 px-4 text-emerald-100 bg-emerald-900/50 hover:bg-emerald-900/70 border border-emerald-500/30 snow-btn"
        >
          <SvgIcon src="/icons/christmas/gift.svg" className="mr-1.5" />
          <span>Save</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onSendSlack}
          className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-900/20 snow-btn"
        >
          <SvgIcon src="/icons/christmas/sleigh.svg" className="mr-1.5 w-5 h-4" />
          <span>Send</span>
        </Button>
      </div>
    );
  }

  // Default theme actions (no SVGs)
  return (
    <div className="hidden sm:flex items-center gap-3 pt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onAIFillAll}
        className="h-9 px-4"
      >
        <Zap className="w-3.5 h-3.5 mr-1.5" />
        <span>AI Fill</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onQuickFill("Pending", "Will check tomorrow")}
        className="h-9 px-4"
      >
        <Zap className="w-3.5 h-3.5 mr-1.5" />
        <span>Fill</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="h-9 px-4"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
        <span>Clear</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        className="h-9 px-4"
      >
        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
        <span>Refresh</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCopy}
        className="h-9 px-4"
      >
        <Copy className="w-3.5 h-3.5 mr-1.5" />
        <span>Copy</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        className="h-9 px-4"
      >
        <Save className="w-3.5 h-3.5 mr-1.5" />
        <span>Save</span>
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={onSendSlack}
        className="h-9 px-4"
      >
        <Send className="w-3.5 h-3.5 mr-1.5" />
        <span>Send</span>
      </Button>
    </div>
  );
}

"use client";

import { Fragment } from "react";
import {
  Save,
  Send,
  Zap,
  Trash2,
  RefreshCw,
  Copy,
  Snowflake,
  Gamepad2,
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
  // Theme-specific action configs
  const getActions = () => {
    if (theme === Theme.PIXEL) {
      return [
        {
          id: "ai-fill",
          label: "Pixel Fill",
          icon: Gamepad2,
          onClick: onAIFillAll,
          className: "bg-rose-900/40 text-rose-300 border-2 border-rose-800 hover:bg-rose-900/60 pixel-shadow-sm",
        },
        {
          id: "quick-fill",
          label: "Fill",
          icon: Zap,
          onClick: () => onQuickFill("Pending", "Will check tomorrow"),
          className: "bg-indigo-900/40 text-indigo-300 border-2 border-indigo-800 hover:bg-indigo-900/60 pixel-shadow-sm",
        },
        {
          id: "clear",
          label: "Clear",
          icon: Trash2,
          onClick: onClear,
          className: "bg-slate-800 border-2 border-slate-700 hover:border-amber-600 hover:text-amber-500 pixel-shadow-sm",
        },
        {
          id: "refresh",
          label: "Refresh",
          icon: RefreshCw,
          onClick: onRefresh,
          className: "bg-slate-800 border-2 border-slate-700 hover:border-cyan-500 hover:text-cyan-400 pixel-shadow-sm",
        },
        {
          id: "copy",
          label: "Copy",
          icon: Copy,
          onClick: onCopy,
          className: "bg-slate-800 border-2 border-slate-700 hover:border-white pixel-shadow-sm",
        },
        {
          id: "save",
          label: "Save",
          icon: Save,
          onClick: onSave,
          className: "bg-slate-800 border-2 border-slate-700 hover:border-emerald-500 hover:text-emerald-400 pixel-shadow-sm",
        },
        {
          id: "send",
          label: "Send",
          icon: Send,
          onClick: onSendSlack,
          className: "bg-emerald-900/40 text-emerald-300 border-2 border-emerald-700 hover:bg-emerald-900/60 pixel-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5",
        },
      ];
    }

    // Default/Christmas theme actions
    return [
      {
        id: "ai-fill",
        label: "Santa Fill",
        icon: Snowflake,
        onClick: onAIFillAll,
        className: "text-red-100 bg-red-900/50 hover:bg-red-900/70 border border-red-500/30",
      },
      {
        id: "quick-fill",
        label: "Fill",
        icon: Zap,
        onClick: () => onQuickFill("Pending", "Will check tomorrow"),
        className: "text-blue-100 bg-blue-900/50 hover:bg-blue-900/70 border border-blue-500/30",
      },
      {
        id: "clear",
        label: "Clear",
        icon: Trash2,
        onClick: onClear,
        className: "text-yellow-100 bg-yellow-900/50 hover:bg-yellow-900/70 border border-yellow-500/30",
      },
      {
        id: "refresh",
        label: "Refresh",
        icon: RefreshCw,
        onClick: onRefresh,
        className: "text-purple-100 bg-purple-900/50 hover:bg-purple-900/70 border border-purple-500/30",
      },
      {
        id: "copy",
        label: "Copy",
        icon: Copy,
        onClick: onCopy,
        className: "text-cyan-100 bg-cyan-900/50 hover:bg-cyan-900/70 border border-cyan-500/30",
      },
      {
        id: "save",
        label: "Save",
        icon: Save,
        onClick: onSave,
        variant: "outline" as const,
        className: "text-emerald-100 bg-emerald-900/50 hover:bg-emerald-900/70 border border-emerald-500/30",
      },
      {
        id: "send",
        label: "Send",
        icon: Send,
        onClick: onSendSlack,
        variant: "default" as const,
        className: "bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-900/20",
      },
    ];
  };

  const actions = getActions();

  return (
    <div className="hidden sm:flex items-center gap-3 pt-2">
      {actions.map((action) => (
        <Fragment key={action.id}>
          <Button
            variant={"variant" in action ? action.variant : "ghost"}
            size="sm"
            onClick={action.onClick}
            className={cn(
              "h-9 px-4",
              action.className,
              theme === Theme.CHRISTMAS && "snow-btn"
            )}
            title={action.label}
          >
            <action.icon className="w-3.5 h-3.5 mr-1.5" />
            <span>{action.label}</span>
          </Button>
          {/* Divider after Refresh button for Pixel theme */}
          {theme === Theme.PIXEL && action.id === "refresh" && (
            <div className="h-6 w-0.5 bg-slate-800 mx-1" />
          )}
        </Fragment>
      ))}
    </div>
  );
}

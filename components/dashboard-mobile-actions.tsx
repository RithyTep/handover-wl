"use client";

import { Save, Send, Zap, Trash2, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme } from "@/enums/theme.enum";

interface DashboardMobileActionsProps {
  theme: Theme;
  onAIFillAll: () => void;
  onQuickFill: () => void;
  onClear: () => void;
  onSave: () => void;
  onSendSlack: () => void;
}

export function DashboardMobileActions({
  theme,
  onAIFillAll,
  onQuickFill,
  onClear,
  onSave,
  onSendSlack,
}: DashboardMobileActionsProps) {
  const actions = [
    {
      id: "ai-fill",
      icon: Snowflake,
      onClick: onAIFillAll,
      className: "bg-red-900/40 border border-red-500/30 active:bg-red-900/80",
      iconColor: "text-red-200",
    },
    {
      id: "quick-fill",
      icon: Zap,
      onClick: onQuickFill,
      className: "bg-blue-900/40 border border-blue-500/30 active:bg-blue-900/80",
      iconColor: "text-blue-200",
    },
    {
      id: "clear",
      icon: Trash2,
      onClick: onClear,
      className: "bg-yellow-900/40 border border-yellow-500/30 active:bg-yellow-900/80",
      iconColor: "text-yellow-200",
    },
    {
      id: "save",
      icon: Save,
      onClick: onSave,
      className: "bg-emerald-900/40 border border-emerald-500/30 active:bg-emerald-900/80",
      iconColor: "text-emerald-200",
    },
    {
      id: "send",
      icon: Send,
      onClick: onSendSlack,
      className: "bg-green-600 active:bg-green-700 text-white shadow-lg shadow-green-900/20",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden z-50">
      <div className="flex items-center justify-around">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={cn(
              "flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl transition-all active:scale-95",
              action.className,
              theme === Theme.CHRISTMAS && "snow-btn"
            )}
          >
            <action.icon className={cn("w-5 h-5", action.iconColor)} />
          </button>
        ))}
      </div>
    </div>
  );
}

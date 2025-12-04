"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ThemeInfo } from "@/lib/types";

interface ThemeButtonProps {
  theme: ThemeInfo;
  isSelected: boolean;
  onSelect: (themeId: string) => void;
  disabled?: boolean;
}

export function ThemeButton({ theme, isSelected, onSelect, disabled }: ThemeButtonProps) {
  return (
    <button
      onClick={() => onSelect(theme.id)}
      disabled={disabled}
      className={cn(
        "relative p-4 rounded-lg border-2 transition-all text-left",
        isSelected
          ? "border-green-500 bg-green-500/10"
          : "border-border hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer"
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="bg-green-500 text-white rounded-full p-1">
            <Check className="w-3 h-3" />
          </div>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="text-3xl">{theme.icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{theme.name}</h3>
          {isSelected && (
            <span className="text-xs text-green-600 dark:text-green-400 mb-2 block">
              Currently active
            </span>
          )}
          <p className="text-sm text-muted-foreground">{theme.description}</p>
        </div>
      </div>
    </button>
  );
}

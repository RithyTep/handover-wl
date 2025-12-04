"use client";

import { ThemeButton } from "./theme-button";
import type { ThemeInfo } from "@/lib/types";

interface ThemeListProps {
  themes: ThemeInfo[];
  selectedThemeId: string;
  onThemeSelect: (themeId: string) => void;
  loading?: boolean;
}

export function ThemeList({ themes, selectedThemeId, onThemeSelect, loading }: ThemeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {themes.map((theme) => (
        <ThemeButton
          key={theme.id}
          theme={theme}
          isSelected={theme.id === selectedThemeId}
          onSelect={onThemeSelect}
          disabled={loading}
        />
      ))}
    </div>
  );
}

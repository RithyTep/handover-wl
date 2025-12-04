"use client";

import { ThemeButton } from "./theme-button.component";
import type { ThemeInfo } from "@/interfaces/theme.interface";
import type { Theme } from "@/enums/theme.enum";

interface ThemeListProps {
  themes: ThemeInfo[];
  selectedTheme: Theme;
  onSelect: (theme: Theme) => void;
  disabled: boolean;
}

export function ThemeList({ themes, selectedTheme, onSelect, disabled }: ThemeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {themes.map((theme) => (
        <ThemeButton
          key={theme.id}
          theme={theme}
          isSelected={selectedTheme === theme.id}
          onSelect={onSelect}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

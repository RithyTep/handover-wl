import type { ThemeInfo, Theme } from "@/lib/types";

export const THEMES: ThemeInfo[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean and professional theme",
    icon: "🎨",
  },
  {
    id: "christmas",
    name: "Christmas",
    description: "Festive holiday theme with snow and decorations",
    icon: "🎄",
  },
];

export const DEFAULT_THEME: Theme = "christmas";

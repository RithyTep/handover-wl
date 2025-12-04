import type { ThemeInfo } from "@/interfaces/theme.interface";
import { Theme } from "@/enums/theme.enum";

export const THEMES: ThemeInfo[] = [
  {
    id: Theme.DEFAULT,
    name: "Default",
    description: "Clean and professional theme",
    icon: "🎨",
  },
  {
    id: Theme.CHRISTMAS,
    name: "Christmas",
    description: "Festive holiday theme with snow and decorations",
    icon: "🎄",
  },
];

export const DEFAULT_THEME: Theme = Theme.CHRISTMAS;

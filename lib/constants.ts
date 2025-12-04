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
  {
    id: Theme.PIXEL,
    name: "Pixel",
    description: "Retro pixel-art inspired theme with sharp edges",
    icon: "🎮",
  },
  {
    id: Theme.LUNAR,
    name: "Lunar",
    description: "Festive Lunar New Year theme with red and gold accents",
    icon: "🧧",
  },
  {
    id: Theme.CODING,
    name: "Coding",
    description: "Hacker-style terminal theme with 404 error aesthetics",
    icon: "💻",
  },
];

export const DEFAULT_THEME: Theme = Theme.CHRISTMAS;

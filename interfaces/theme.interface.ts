import { Theme } from "@/enums/theme.enum";

export interface ThemeInfo {
  id: Theme;
  name: string;
  description: string;
  icon: string;
}

export interface ThemePreferenceResponse {
  theme: Theme;
}

export interface ThemeSetRequest {
  theme: Theme;
}

export interface ThemeSetResponse {
  success: boolean;
  theme: Theme;
}

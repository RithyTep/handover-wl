import { ThemeRepository } from "@/server/repository/theme.repository";
import type { Theme } from "@/enums/theme.enum";
import type { ThemeInfo } from "@/interfaces/theme.interface";
import { THEMES } from "@/lib/constants";

export class ThemeService {
  private repository: ThemeRepository;

  constructor() {
    this.repository = new ThemeRepository();
  }

  getAllThemes(): ThemeInfo[] {
    return THEMES;
  }

  async getSelectedTheme(): Promise<Theme> {
    return this.repository.getThemePreference();
  }

  async setSelectedTheme(theme: Theme): Promise<void> {
    await this.repository.setThemePreference(theme);
  }
}

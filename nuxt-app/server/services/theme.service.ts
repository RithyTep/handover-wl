import { ThemeRepository } from '../repository/theme.repository'
import { THEMES } from '../utils/constants'
import type { Theme, ThemeInfo } from '~/types/theme'

let themeCache: { theme: Theme, timestamp: number } | null = null
const THEME_CACHE_TTL = 10000

export class ThemeService {
  private repository: ThemeRepository

  constructor() {
    this.repository = new ThemeRepository()
  }

  getAllThemes(): ThemeInfo[] {
    return THEMES
  }

  async getSelectedTheme(): Promise<Theme> {
    const now = Date.now()
    if (themeCache && now - themeCache.timestamp < THEME_CACHE_TTL) {
      return themeCache.theme
    }
    const theme = await this.repository.getThemePreference()
    themeCache = { theme, timestamp: now }
    return theme
  }

  async setSelectedTheme(theme: Theme): Promise<void> {
    await this.repository.setThemePreference(theme)
    themeCache = { theme, timestamp: Date.now() }
  }
}

// Singleton instance
let themeServiceInstance: ThemeService | null = null

export function getThemeService(): ThemeService {
  if (!themeServiceInstance) {
    themeServiceInstance = new ThemeService()
  }
  return themeServiceInstance
}

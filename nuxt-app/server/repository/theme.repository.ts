import { prisma } from '../utils/prisma'
import { Theme, isValidTheme } from '~/types/theme'

const THEME_KEY = 'theme_preference'
const DEFAULT_THEME = Theme.DEFAULT

export class ThemeRepository {
  async getThemePreference(): Promise<Theme> {
    const setting = await prisma.appSetting.findUnique({
      where: { key: THEME_KEY },
    })

    if (!setting) {
      return DEFAULT_THEME
    }

    if (isValidTheme(setting.value)) {
      return setting.value
    }

    return DEFAULT_THEME
  }

  async setThemePreference(theme: Theme): Promise<void> {
    await prisma.appSetting.upsert({
      where: { key: THEME_KEY },
      update: { value: theme, updatedAt: new Date() },
      create: { key: THEME_KEY, value: theme },
    })
  }
}

import { getThemeService } from '../../services/theme.service'

export default defineEventHandler(async () => {
  const themeService = getThemeService()
  const theme = await themeService.getSelectedTheme()
  const themes = themeService.getAllThemes()

  return {
    success: true,
    selectedTheme: theme,
    themes,
  }
})

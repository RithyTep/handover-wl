import { z } from 'zod'
import { getThemeService } from '../../services/theme.service'
import { themeSchema } from '~/types/theme'

const inputSchema = z.object({
  theme: themeSchema,
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = inputSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid theme',
    })
  }

  const themeService = getThemeService()
  await themeService.setSelectedTheme(parsed.data.theme)

  return {
    success: true,
    theme: parsed.data.theme,
  }
})

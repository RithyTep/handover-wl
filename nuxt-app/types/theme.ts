import { z } from 'zod'

export enum Theme {
  DEFAULT = 'default',
  CHRISTMAS = 'christmas',
  PIXEL = 'pixel',
  LUNAR = 'lunar',
  CODING = 'coding',
  CLASH = 'clash',
  ANGKOR_PIXEL = 'angkor_pixel',
}

export const ThemeValues = Object.values(Theme) as [Theme, ...Theme[]]

export const themeSchema = z.nativeEnum(Theme)

export interface ThemeInfo {
  id: Theme
  name: string
  description: string
  icon: string
}

export const isValidTheme = (value: unknown): value is Theme => {
  return themeSchema.safeParse(value).success
}

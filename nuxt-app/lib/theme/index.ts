import { MessageSquare, FileText, Command } from 'lucide-vue-next'
import type { Theme } from '~/enums'
import type {
  ThemeConfig,
  ThemeHeaderConfig,
  ThemeLayoutConfig,
  ThemeTableConfig,
  HeaderNavItem,
} from './types'
import { defaultThemeConfig } from './default'
import type { Component } from 'vue'

export type {
  ThemeConfig,
  ThemeHeaderConfig,
  ThemeLayoutConfig,
  ThemeTableConfig,
  ThemeActionButton,
  ThemeMobileAction,
  HeaderNavItem,
} from './types'

// For now, use default config for all themes
// Can be expanded later with theme-specific configs
const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  default: defaultThemeConfig,
  pixel: defaultThemeConfig,
  lunar: defaultThemeConfig,
  christmas: defaultThemeConfig,
  coding: defaultThemeConfig,
  clash: defaultThemeConfig,
  angkor_pixel: defaultThemeConfig,
}

export const getThemeConfig = (theme: Theme): ThemeConfig => {
  return THEME_CONFIGS[theme] ?? THEME_CONFIGS.default
}

export const getHeaderConfig = (theme: Theme): ThemeHeaderConfig => {
  return getThemeConfig(theme).header
}

export const getLayoutConfig = (theme: Theme): ThemeLayoutConfig => {
  return getThemeConfig(theme).layout
}

export const getTableConfig = (theme: Theme): ThemeTableConfig => {
  return getThemeConfig(theme).table
}

export const getActionsConfig = (theme: Theme) => {
  return getThemeConfig(theme).actions
}

export const getMobileActionsConfig = (theme: Theme) => {
  return getThemeConfig(theme).mobileActions
}

export const getHeaderNavItems = (theme: Theme): HeaderNavItem[] => {
  // For now, use default nav items for all themes
  // Can be expanded with theme-specific items
  return [
    { href: '/feedback', label: 'Feedback', icon: MessageSquare },
    { href: '/changelog', label: 'Changelog', icon: FileText },
  ]
}

export const getKbdIcon = (theme: Theme): { icon?: Component; svgIcon?: string } => {
  const config = getHeaderConfig(theme)
  if (config.nav.kbdIcon) {
    return { svgIcon: config.nav.kbdIcon }
  }
  return { icon: Command }
}

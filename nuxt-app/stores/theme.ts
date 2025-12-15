import { defineStore } from 'pinia'
import { Theme, isValidTheme, type ThemeInfo } from '~/types/theme'

const STORAGE_KEY = 'theme_preference'

export const useThemeStore = defineStore('theme', () => {
  // State
  const selectedTheme = ref<Theme | null>(null)

  // Actions
  function setTheme(theme: Theme) {
    selectedTheme.value = theme
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, theme)
    }
  }

  function loadFromLocalStorage() {
    if (import.meta.server) return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isValidTheme(stored)) {
      selectedTheme.value = stored
    }
  }

  function initializeFromServer(themes: ThemeInfo[]) {
    if (selectedTheme.value === null && themes.length > 0) {
      const firstTheme = themes[0].id
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, firstTheme)
      }
      selectedTheme.value = firstTheme
    }
  }

  // Initialize from localStorage on client
  if (import.meta.client) {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isValidTheme(stored)) {
      selectedTheme.value = stored
    }
  }

  return {
    selectedTheme,
    setTheme,
    loadFromLocalStorage,
    initializeFromServer,
  }
})

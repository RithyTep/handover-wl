import { useThemeStore } from '~/stores/theme'
import type { Theme, ThemeInfo } from '~/types/theme'

interface UseThemeReturn {
  themes: Ref<ThemeInfo[]>
  selectedTheme: ComputedRef<Theme>
  isLoading: Ref<boolean>
  isSaving: Ref<boolean>
  handleThemeSelect: (theme: Theme) => void
  handleSaveToServer: (theme: Theme) => Promise<void>
}

export function useTheme(): UseThemeReturn {
  const themeStore = useThemeStore()

  const themes = ref<ThemeInfo[]>([])
  const isLoading = ref(true)
  const isSaving = ref(false)
  const hasInitialized = ref(false)

  const selectedTheme = computed(() => themeStore.selectedTheme ?? 'default' as Theme)

  // Fetch themes and selected theme from server
  const fetchThemes = async () => {
    isLoading.value = true
    try {
      const response = await $fetch<{
        success: boolean
        selectedTheme: Theme
        themes: ThemeInfo[]
      }>('/api/theme')

      if (response.success) {
        themes.value = response.themes

        // Initialize from server if not already set
        if (!hasInitialized.value && themeStore.selectedTheme === null) {
          themeStore.setTheme(response.selectedTheme)
        }
        hasInitialized.value = true
      }
    } catch (err) {
      console.error('[useTheme] Error fetching themes:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Handle theme selection (local only)
  const handleThemeSelect = (theme: Theme) => {
    if (theme === themeStore.selectedTheme) return
    themeStore.setTheme(theme)
  }

  // Save theme to server
  const handleSaveToServer = async (theme: Theme) => {
    isSaving.value = true
    try {
      await $fetch('/api/theme', {
        method: 'POST',
        body: { theme },
      })
    } catch (err) {
      console.error('[useTheme] Error saving theme:', err)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  // Initialize on mount
  onMounted(() => {
    // Load from localStorage first
    themeStore.loadFromLocalStorage()
    // Then fetch from server
    fetchThemes()
  })

  return {
    themes: themes as Ref<ThemeInfo[]>,
    selectedTheme,
    isLoading: isLoading as Ref<boolean>,
    isSaving: isSaving as Ref<boolean>,
    handleThemeSelect,
    handleSaveToServer,
  }
}

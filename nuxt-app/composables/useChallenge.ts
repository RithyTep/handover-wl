import {
  initChallengeSession,
  clearChallengeSession,
  getSessionTimeRemaining,
} from '~/lib/security/challenge-manager'

interface UseChallengeReturn {
  /** Whether challenge session is initialized */
  isInitialized: Ref<boolean>
  /** Whether initialization is in progress */
  isLoading: Ref<boolean>
  /** Any error during initialization */
  error: Ref<Error | null>
  /** Time remaining on session (ms) */
  timeRemaining: Ref<number>
  /** Manually reinitialize session */
  refresh: () => Promise<void>
  /** Clear session */
  clear: () => void
}

export function useChallenge(): UseChallengeReturn {
  const isInitialized = ref(false)
  const isLoading = ref(true)
  const error = ref<Error | null>(null)
  const timeRemaining = ref(0)

  let intervalId: ReturnType<typeof setInterval> | null = null

  // Initialize challenge session
  const init = async () => {
    try {
      isLoading.value = true
      error.value = null
      await initChallengeSession()
      isInitialized.value = true
      timeRemaining.value = getSessionTimeRemaining()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to initialize challenge')
      isInitialized.value = false
    } finally {
      isLoading.value = false
    }
  }

  // Update time remaining periodically
  const startTimeCheck = () => {
    if (intervalId) return

    intervalId = setInterval(async () => {
      if (!isInitialized.value) return

      const remaining = getSessionTimeRemaining()
      timeRemaining.value = remaining

      // Auto-refresh when expired
      if (remaining <= 0) {
        isInitialized.value = false
        try {
          await initChallengeSession()
          isInitialized.value = true
          timeRemaining.value = getSessionTimeRemaining()
        } catch (err) {
          error.value = err instanceof Error ? err : new Error('Session refresh failed')
        }
      }
    }, 60000) // Check every minute
  }

  const stopTimeCheck = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // Manually refresh session
  const refresh = async () => {
    isLoading.value = true
    error.value = null
    clearChallengeSession()

    try {
      await initChallengeSession()
      isInitialized.value = true
      timeRemaining.value = getSessionTimeRemaining()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to refresh challenge')
      isInitialized.value = false
    } finally {
      isLoading.value = false
    }
  }

  // Clear session
  const clear = () => {
    clearChallengeSession()
    isInitialized.value = false
    timeRemaining.value = 0
  }

  // Initialize on mount
  onMounted(() => {
    init()
    startTimeCheck()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    stopTimeCheck()
  })

  // Watch for initialization to start time check
  watch(isInitialized, (initialized) => {
    if (initialized) {
      startTimeCheck()
    }
  })

  return {
    isInitialized: isInitialized as Ref<boolean>,
    isLoading: isLoading as Ref<boolean>,
    error: error as Ref<Error | null>,
    timeRemaining: timeRemaining as Ref<number>,
    refresh,
    clear,
  }
}

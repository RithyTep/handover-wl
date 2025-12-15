interface ShiftSettings {
  eveningToken: string
  nightToken: string
  eveningMentions: string
  nightMentions: string
}

interface UseSchedulerReturn {
  // Scheduler state
  scheduleEnabled: Ref<boolean>
  loading: Ref<boolean>
  toggleScheduler: () => Promise<void>

  // Channel settings
  customChannelId: Ref<string>
  saveChannelId: () => Promise<void>

  // Shift settings
  eveningToken: Ref<string>
  nightToken: Ref<string>
  eveningMentions: Ref<string>
  nightMentions: Ref<string>
  saveShiftSettings: () => Promise<void>

  // Manual trigger
  triggeringComments: Ref<boolean>
  triggerScheduledComments: () => Promise<void>
}

export function useScheduler(): UseSchedulerReturn {
  const { $toast } = useNuxtApp()

  // Scheduler state
  const scheduleEnabled = ref(false)
  const loading = ref(true)

  // Channel settings
  const customChannelId = ref('')

  // Shift settings
  const eveningToken = ref('')
  const nightToken = ref('')
  const eveningMentions = ref('')
  const nightMentions = ref('')

  // Manual trigger
  const triggeringComments = ref(false)

  // Fetch initial data
  const fetchSchedulerState = async () => {
    try {
      const response = await $fetch<{ enabled: boolean }>('/api/scheduler')
      scheduleEnabled.value = response.enabled
    } catch (e) {
      console.error('Failed to fetch scheduler state:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchShiftSettings = async () => {
    try {
      const response = await $fetch<{ data: ShiftSettings }>('/api/settings/shift-tokens')
      if (response.data) {
        eveningToken.value = response.data.eveningToken
        nightToken.value = response.data.nightToken
        eveningMentions.value = response.data.eveningMentions
        nightMentions.value = response.data.nightMentions
      }
    } catch (e) {
      console.error('Failed to fetch shift settings:', e)
    }
  }

  const fetchChannelSettings = async () => {
    try {
      const response = await $fetch<{ channelId: string | null }>('/api/settings/channel')
      customChannelId.value = response.channelId || ''
    } catch (e) {
      console.error('Failed to fetch channel settings:', e)
    }
  }

  // Toggle scheduler
  const toggleScheduler = async () => {
    const newValue = !scheduleEnabled.value

    try {
      const response = await $fetch<{ enabled: boolean }>('/api/scheduler', {
        method: 'POST',
        body: { enabled: newValue },
      })

      scheduleEnabled.value = response.enabled

      if (response.enabled) {
        $toast?.success('Scheduler enabled! Reports will be sent at configured times.')
      } else {
        $toast?.success('Scheduler disabled')
      }
    } catch (e) {
      $toast?.error(`Failed to update scheduler: ${(e as Error).message}`)
    }
  }

  // Save channel ID
  const saveChannelId = async () => {
    try {
      await $fetch('/api/settings/channel', {
        method: 'POST',
        body: { channel_id: customChannelId.value },
      })
      $toast?.success('Custom channel ID saved successfully!')
    } catch (e) {
      $toast?.error(`Error saving channel ID: ${(e as Error).message}`)
    }
  }

  // Save shift settings
  const saveShiftSettings = async () => {
    try {
      await $fetch('/api/settings/shift-tokens', {
        method: 'POST',
        body: {
          evening_user_token: eveningToken.value,
          night_user_token: nightToken.value,
          evening_mentions: eveningMentions.value,
          night_mentions: nightMentions.value,
        },
      })
      $toast?.success('Shift settings saved successfully!')
    } catch (e) {
      $toast?.error(`Error saving shift settings: ${(e as Error).message}`)
    }
  }

  // Trigger scheduled comments
  const triggerScheduledComments = async () => {
    triggeringComments.value = true

    try {
      const response = await $fetch<{
        replied: boolean
        ticketsCount?: number
        message?: string
      }>('/api/scan-and-reply-handover', {
        method: 'POST',
      })

      if (response.replied) {
        $toast?.success(`Reply posted successfully! (${response.ticketsCount} tickets)`)
      } else {
        $toast?.info(response.message || 'No handover messages found that need replies')
      }
    } catch (e) {
      $toast?.error(`Error scanning messages: ${(e as Error).message}`)
    } finally {
      triggeringComments.value = false
    }
  }

  // Initialize on mount
  onMounted(() => {
    fetchSchedulerState()
    fetchShiftSettings()
    fetchChannelSettings()
  })

  return {
    scheduleEnabled,
    loading,
    toggleScheduler,
    customChannelId,
    saveChannelId,
    eveningToken,
    nightToken,
    eveningMentions,
    nightMentions,
    saveShiftSettings,
    triggeringComments,
    triggerScheduledComments,
  }
}

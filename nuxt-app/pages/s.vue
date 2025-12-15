<script setup lang="ts">
import { Clock, Save, Lock } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import {
  SchedulerStatus,
  ChannelSettings,
  ShiftConfig,
  ManualTrigger,
} from '~/components/scheduler'

const AUTH_KEY = 'scheduler_auth'
const AUTH_PASSWORD = 'khmer4er'

// Authentication state
const isAuthenticated = ref(false)
const password = ref('')
const showDialog = ref(true)
const authError = ref('')

// Check session storage on mount
onMounted(() => {
  if (import.meta.client) {
    const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true'
    if (isAuth) {
      isAuthenticated.value = true
      showDialog.value = false
    }
  }
})

const handleSubmit = () => {
  if (password.value === AUTH_PASSWORD) {
    isAuthenticated.value = true
    showDialog.value = false
    authError.value = ''
    if (import.meta.client) {
      sessionStorage.setItem(AUTH_KEY, 'true')
    }
  } else {
    authError.value = 'Incorrect password'
    password.value = ''
  }
}

const handlePasswordChange = (e: Event) => {
  password.value = (e.target as HTMLInputElement).value
  authError.value = ''
}

// Scheduler composable
const {
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
} = useScheduler()
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Auth Dialog -->
    <template v-if="!isAuthenticated">
      <div class="flex items-center justify-center min-h-screen">
        <Dialog :open="showDialog">
          <DialogContent class="sm:max-w-md" @interact-outside.prevent>
            <DialogHeader>
              <div
                class="w-14 h-14 sm:w-12 sm:h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4"
              >
                <Lock class="w-7 h-7 sm:w-6 sm:h-6" />
              </div>
              <DialogTitle class="text-center text-lg">Enter Password</DialogTitle>
              <DialogDescription class="text-center text-sm">
                This page is password protected
              </DialogDescription>
            </DialogHeader>
            <form class="space-y-4" @submit.prevent="handleSubmit">
              <div>
                <Input
                  type="password"
                  :value="password"
                  placeholder="Enter password"
                  class="h-11 sm:h-10 text-base sm:text-sm"
                  autofocus
                  @input="handlePasswordChange"
                />
                <p v-if="authError" class="text-sm text-red-500 mt-2">{{ authError }}</p>
              </div>
              <Button type="submit" class="w-full h-11 sm:h-10">
                Unlock
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </template>

    <!-- Scheduler Content -->
    <template v-else>
      <div class="p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center h-full min-h-[50vh]">
            <div class="text-center">
              <Clock class="w-8 h-8 animate-spin mx-auto mb-2 text-foreground" />
              <p class="text-sm text-muted-foreground">Loading scheduler...</p>
            </div>
          </div>

          <!-- Scheduler Page Content -->
          <div v-else class="w-full h-full flex flex-col gap-6 max-w-2xl">
            <div>
              <h2 class="text-2xl font-semibold tracking-tight mb-2">Scheduler</h2>
              <p class="text-sm text-muted-foreground">
                Configure shift-based handover reports with custom user tokens.
              </p>
            </div>

            <SchedulerStatus
              :enabled="scheduleEnabled"
              :loading="loading"
              @toggle="toggleScheduler"
            />

            <ChannelSettings v-model:channel-id="customChannelId" @save="saveChannelId" />

            <ShiftConfig
              v-model:token="eveningToken"
              v-model:mentions="eveningMentions"
              variant="evening"
            />

            <ShiftConfig
              v-model:token="nightToken"
              v-model:mentions="nightMentions"
              variant="night"
            />

            <div class="border border-border rounded-lg p-6 bg-card">
              <Button variant="default" size="lg" class="w-full" @click="saveShiftSettings">
                <Save class="w-4 h-4 mr-2" />
                Save All Shift Settings
              </Button>
              <p class="text-xs text-muted-foreground mt-2 text-center">
                Save tokens and mentions for both evening and night shifts
              </p>
            </div>

            <ManualTrigger
              :triggering="triggeringComments"
              @trigger="triggerScheduledComments"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

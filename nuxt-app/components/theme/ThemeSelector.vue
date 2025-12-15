<script setup lang="ts">
import { Palette, Save } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils'
import { Theme } from '~/enums'

interface Props {
  variant?: Theme
}

const props = withDefaults(defineProps<Props>(), {
  variant: Theme.DEFAULT,
})

const { themes, selectedTheme, isLoading, handleThemeSelect, handleSaveToServer, isSaving } =
  useTheme()

const isOpen = ref(false)
const pendingTheme = ref<Theme>(selectedTheme.value as Theme)
const hasChanges = ref(false)

watch([selectedTheme, isOpen], () => {
  pendingTheme.value = selectedTheme.value as Theme
  hasChanges.value = false
})

const THEME_BUTTON_STYLES: Record<Theme, string> = {
  [Theme.CHRISTMAS]: 'text-white/70 hover:text-white hover:bg-white/10',
  [Theme.PIXEL]: 'text-slate-300 hover:text-indigo-400 transition-colors',
  [Theme.LUNAR]: 'text-stone-400 hover:text-amber-400 hover:bg-stone-800/50 transition-colors',
  [Theme.CODING]: 'text-zinc-500 hover:text-indigo-400 transition-colors',
  [Theme.CLASH]: 'text-[#ccc] hover:text-[#fbcc14] transition-colors',
  [Theme.ANGKOR_PIXEL]:
    'text-[#f5e6d3] hover:text-[#ffd700] hover:bg-[#3d5a4a]/50 transition-colors',
  [Theme.DEFAULT]: 'text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors',
}

const buttonClassName = computed(() => THEME_BUTTON_STYLES[props.variant] ?? THEME_BUTTON_STYLES.default)

const handleOpen = () => {
  isOpen.value = true
}

const handlePendingChange = (value: string) => {
  pendingTheme.value = value as Theme
  hasChanges.value = value !== selectedTheme.value
}

const handleSave = async () => {
  if (pendingTheme.value !== selectedTheme.value) {
    handleThemeSelect(pendingTheme.value)
  }
  await handleSaveToServer(pendingTheme.value)
  hasChanges.value = false
  isOpen.value = false
}

const pendingThemeName = computed(() => {
  return themes.value.find((t) => t.id === pendingTheme.value)?.name
})
</script>

<template>
  <div>
    <Button
      variant="ghost"
      size="sm"
      :class="cn(buttonClassName)"
      aria-label="Open theme selector"
      aria-haspopup="dialog"
      @click="handleOpen"
    >
      <Palette class="w-4 h-4 mr-1.5" aria-hidden="true" />
      <span class="hidden sm:inline">Theme</span>
    </Button>

    <Dialog v-model:open="isOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Theme</DialogTitle>
          <DialogDescription> Choose a theme. Click save to apply changes. </DialogDescription>
        </DialogHeader>

        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <div class="text-muted-foreground" role="status" aria-live="polite">Loading themes...</div>
        </div>

        <div v-else class="space-y-6 py-4">
          <Select
            :model-value="pendingTheme"
            :disabled="isSaving"
            @update:model-value="handlePendingChange"
          >
            <SelectTrigger
              class="w-full border"
              :style="{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }"
              aria-label="Select theme"
            >
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent
              class="border"
              :style="{ backgroundColor: '#1f2937', borderColor: '#374151' }"
            >
              <SelectItem
                v-for="theme in themes"
                :key="theme.id"
                :value="theme.id"
                class="cursor-pointer"
                :style="{ color: '#f3f4f6' }"
              >
                {{ theme.name }}
              </SelectItem>
            </SelectContent>
          </Select>

          <p v-if="hasChanges" class="text-sm text-amber-500">
            Theme changed to "{{ pendingThemeName }}". Click save to apply.
          </p>

          <div class="p-4 bg-muted rounded-lg">
            <h4 class="font-semibold mb-2">About Rithy</h4>
            <p class="text-sm text-muted-foreground">ABA 003 791 262</p>
          </div>

          <div class="flex justify-end gap-2">
            <Button variant="outline" :disabled="isSaving" @click="isOpen = false"> Cancel </Button>
            <Button :disabled="isSaving" :aria-busy="isSaving" @click="handleSave">
              <Save class="w-4 h-4 mr-2" />
              {{ isSaving ? 'Saving...' : 'Save Preference' }}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

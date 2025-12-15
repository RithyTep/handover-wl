<script setup lang="ts">
interface Props {
  assignee: string
  assigneeAvatar: string | null
}

const props = defineProps<Props>()

function getAssigneeDisplay(name: string): string {
  if (name.toLowerCase().includes('leo')) {
    return `${name} (PO)`
  }
  return name
}

const displayName = computed(() => getAssigneeDisplay(props.assignee))

const initial = computed(() => {
  if (props.assignee === 'Unassigned') return '?'
  return props.assignee.charAt(0).toUpperCase()
})
</script>

<template>
  <div class="flex items-center gap-2 whitespace-nowrap">
    <img
      v-if="assigneeAvatar"
      :src="assigneeAvatar"
      :alt="assignee"
      class="w-5 h-5 rounded-full ring-1 ring-white/30"
    />
    <div
      v-else
      class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-medium text-white"
    >
      {{ initial }}
    </div>
    <span class="text-xs text-white">{{ displayName }}</span>
  </div>
</template>

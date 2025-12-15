import { Bug, MessageSquare, Lightbulb, Sparkles } from 'lucide-vue-next'
import type { Component } from 'vue'
import { FeedbackType } from '~/enums'

export interface FeedbackTypeOption {
  id: FeedbackType
  label: string
  description: string
  icon: Component
  color: string
}

export const feedbackTypes: FeedbackTypeOption[] = [
  {
    id: FeedbackType.BUG,
    label: 'Bug Report',
    description: 'Report an issue or error',
    icon: Bug,
    color: 'text-red-500 bg-red-500/10 border-red-500/20',
  },
  {
    id: FeedbackType.FEEDBACK,
    label: 'Feedback',
    description: 'General feedback about the app',
    icon: MessageSquare,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: FeedbackType.SUGGESTION,
    label: 'Suggestion',
    description: 'Suggest an improvement',
    icon: Lightbulb,
    color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  },
  {
    id: FeedbackType.FEATURE,
    label: 'New Feature',
    description: 'Request a new feature',
    icon: Sparkles,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
]

export function getTypeConfig(type: FeedbackType): FeedbackTypeOption {
  return feedbackTypes.find((t) => t.id === type) || feedbackTypes[1]
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export interface FeedbackItem {
  id: number
  type: FeedbackType
  title: string
  description: string
  created_at: string
}

"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trpc } from "@/components/trpc-provider"
import { FeedbackType } from "@/enums"
import { FeedbackTypeSelector } from "./feedback-type-selector"
import { FeedbackDetailsCard } from "./feedback-details-card"
import { AnonymousNotice } from "./anonymous-notice"

interface FeedbackFormProps {
  onSuccess: () => void
}

export function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createFeedbackMutation = trpc.feedback.create.useMutation({
    onSuccess: () => {
      onSuccess()
      toast.success("Thank you for your feedback!")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit feedback")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedType || !title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      await createFeedbackMutation.mutateAsync({
        type: selectedType,
        title: title.trim(),
        description: description.trim(),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = selectedType && title.trim() && description.trim()

  return (
    <form onSubmit={handleSubmit}>
      <FeedbackTypeSelector selectedType={selectedType} onSelectType={setSelectedType} />
      <FeedbackDetailsCard
        selectedType={selectedType}
        title={title}
        description={description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
      />
      <AnonymousNotice />
      <Button type="submit" size="lg" className="w-full" disabled={!isValid || isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </>
        )}
      </Button>
    </form>
  )
}

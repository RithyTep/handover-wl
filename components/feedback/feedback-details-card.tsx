"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FeedbackType } from "@/enums"

interface FeedbackDetailsCardProps {
  selectedType: FeedbackType | null
  title: string
  description: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}

function getPlaceholder(type: FeedbackType | null): string {
  if (type === "bug") {
    return "Please describe the issue, steps to reproduce, and expected behavior..."
  }
  if (type === "feature") {
    return "Describe the feature you'd like to see and how it would help..."
  }
  return "Share your thoughts, ideas, or suggestions..."
}

export function FeedbackDetailsCard({
  selectedType,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: FeedbackDetailsCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Details</CardTitle>
        <CardDescription>
          Provide as much detail as possible to help us understand your feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Brief summary of your feedback"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground text-right">{title.length}/200</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder={getPlaceholder(selectedType)}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={6}
            maxLength={2000}
          />
          <p className="text-xs text-muted-foreground text-right">{description.length}/2000</p>
        </div>
      </CardContent>
    </Card>
  )
}

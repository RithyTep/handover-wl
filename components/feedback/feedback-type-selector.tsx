"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FeedbackType } from "@/enums"
import { feedbackTypes } from "./feedback-types"

interface FeedbackTypeSelectorProps {
  selectedType: FeedbackType | null
  onSelectType: (type: FeedbackType) => void
}

export function FeedbackTypeSelector({ selectedType, onSelectType }: FeedbackTypeSelectorProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">What type of feedback?</CardTitle>
        <CardDescription>Select the category that best fits your feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {feedbackTypes.map((type) => {
            const Icon = type.icon
            const isSelected = selectedType === type.id
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onSelectType(type.id)}
                className={cn(
                  "flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left",
                  isSelected
                    ? type.color
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                )}
                aria-pressed={isSelected}
              >
                <Icon className={cn("w-5 h-5 mb-2", isSelected ? "" : "text-muted-foreground")} />
                <span className="font-medium text-sm">{type.label}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{type.description}</span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

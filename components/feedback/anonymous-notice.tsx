"use client"

import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AnonymousNotice() {
  return (
    <Card className="mb-6 border-muted bg-muted/30">
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Anonymous Submission</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your feedback is completely anonymous. No personal information is collected or stored.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

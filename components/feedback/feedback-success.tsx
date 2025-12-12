"use client"

import { useRouter } from "next/navigation"
import { Check, List, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FeedbackSuccessProps {
	onSubmitAnother: () => void
	onViewAll: () => void
}

export function FeedbackSuccess({ onSubmitAnother, onViewAll }: FeedbackSuccessProps) {
	const router = useRouter()

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-2xl mx-auto px-4 py-8">
				<Card className="border-green-500/20 bg-green-500/5">
					<CardContent className="pt-8 pb-8 text-center">
						<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
							<Check className="w-8 h-8 text-green-500" />
						</div>
						<h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
						<p className="text-muted-foreground mb-6">
							Your feedback has been submitted anonymously. We appreciate your input!
						</p>
						<div className="flex gap-3 justify-center">
							<Button variant="outline" onClick={onSubmitAnother}>
								Submit Another
							</Button>
							<Button variant="outline" onClick={onViewAll}>
								<List className="w-4 h-4 mr-2" />
								View All Feedback
							</Button>
							<Button onClick={() => router.push("/")}>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Dashboard
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

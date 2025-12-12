"use client"

import { MessageSquare, RefreshCw, Loader2, PlusCircle, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { IFeedbackItem } from "@/interfaces"
import { getTypeConfig, formatDate } from "./feedback-types"

interface FeedbackListProps {
	feedbackList: IFeedbackItem[]
	isLoading: boolean
	onRefresh: () => void
	onSwitchToSubmit: () => void
}

export function FeedbackList({
	feedbackList,
	isLoading,
	onRefresh,
	onSwitchToSubmit,
}: FeedbackListProps) {
	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<p className="text-sm text-muted-foreground">
					{feedbackList.length} feedback submissions
				</p>
				<Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
					<RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
					Refresh
				</Button>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
				</div>
			) : feedbackList.length === 0 ? (
				<Card className="border-dashed">
					<CardContent className="py-12 text-center">
						<MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
						<p className="text-muted-foreground">No feedback yet. Be the first to share!</p>
						<Button variant="outline" size="sm" className="mt-4" onClick={onSwitchToSubmit}>
							<PlusCircle className="w-4 h-4 mr-2" />
							Submit Feedback
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{feedbackList.map((item) => {
						const typeConfig = getTypeConfig(item.type)
						const Icon = typeConfig.icon
						return (
							<Card key={item.id}>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between gap-3">
										<div className="flex items-start gap-3 flex-1 min-w-0">
											<div className={cn("p-2 rounded-lg shrink-0", typeConfig.color.split(" ").slice(1).join(" "))}>
												<Icon className={cn("w-4 h-4", typeConfig.color.split(" ")[0])} />
											</div>
											<div className="flex-1 min-w-0">
												<CardTitle className="text-base truncate">{item.title}</CardTitle>
												<div className="flex items-center gap-2 mt-1">
													<Badge variant="outline" className={cn("text-xs", typeConfig.color)}>
														{typeConfig.label}
													</Badge>
													<span className="text-xs text-muted-foreground flex items-center gap-1">
														<Calendar className="w-3 h-3" />
														{formatDate(item.created_at)}
													</span>
												</div>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>
								</CardContent>
							</Card>
						)
					})}
				</div>
			)}
		</div>
	)
}

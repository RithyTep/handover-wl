import {
	type TicketHistory,
	type AIAutofillRequest,
} from "@/lib/types/ai-autofill"

export interface TicketContext {
	context: string
	hasRecentActivity: boolean
}

export function buildTicketContext(
	ticket: AIAutofillRequest["ticket"],
	history: TicketHistory | null
): TicketContext {
	let context = `TICKET BASICS:
Key: ${ticket.key}
Summary: ${ticket.summary}
Current Status: ${ticket.status}
Assignee: ${ticket.assignee}
Priority: ${ticket.wlMainTicketType || "N/A"} / ${ticket.wlSubTicketType || "N/A"}
Customer Level: ${ticket.customerLevel || "N/A"}
Created: ${new Date(ticket.created).toLocaleDateString()}
Due Date: ${ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString() : "N/A"}`

	let hasRecentActivity = false

	if (history) {
		if (history.comments.length > 0) {
			hasRecentActivity = true
			context += buildCommentsSection(history)
		}

		if (history.statusChanges.length > 0) {
			hasRecentActivity = true
			context += buildStatusChangesSection(history)
		}

		if (history.assigneeChanges.length > 0) {
			context += buildAssigneeChangesSection(history)
		}

		if (history.description) {
			context += buildDescriptionSection(history.description)
		}
	}

	if (!hasRecentActivity) {
		context +=
			"\n\n⚠️ NOTE: No recent comments or status changes found. Base analysis on ticket basics and description."
	}

	return { context: context.trim(), hasRecentActivity }
}

function buildCommentsSection(history: TicketHistory): string {
	let section = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 RECENT COMMENTS (MOST IMPORTANT - READ THESE FIRST):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

	history.comments.forEach((comment, index) => {
		const isLatest = index === 0
		const marker = isLatest
			? "🔥 [LATEST COMMENT]"
			: `[Comment ${history.comments.length - index}]`

		const maxLength = isLatest ? 800 : 400
		const truncated = comment.body.length > maxLength
		const displayText = truncated
			? comment.body.slice(0, maxLength) + "..."
			: comment.body

		section += `\n\n${marker}
Date: ${comment.created}
Author: ${comment.author}
Content: ${displayText}`
	})

	return section
}

function buildStatusChangesSection(history: TicketHistory): string {
	let section = `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RECENT STATUS CHANGES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

	history.statusChanges.forEach((change) => {
		section += `\n- ${change.date}: ${change.from} → ${change.to} (by ${change.author})`
	})

	return section
}

function buildAssigneeChangesSection(history: TicketHistory): string {
	let section = `\n\n👤 RECENT ASSIGNEE CHANGES:`

	history.assigneeChanges.forEach((change) => {
		section += `\n- ${change.date}: ${change.from} → ${change.to}`
	})

	return section
}

function buildDescriptionSection(description: string): string {
	const descriptionPreview = description.slice(0, 300)
	const truncated = description.length > 300

	return `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 ORIGINAL DESCRIPTION (for background only):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${descriptionPreview}${truncated ? "..." : ""}`
}

export function buildAIPrompt(context: string): string {
	return `You are an AI assistant creating handover notes for a support team. Your PRIMARY job is to analyze the MOST RECENT COMMENT to understand what's happening NOW.

${context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR TASK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate two statements for the handover:

1️⃣ STATUS (What's happening RIGHT NOW):

   🎯 YOUR PRIORITY ORDER:
   1. If there's a LATEST COMMENT (marked with 🔥), extract the current situation from it
   2. If no recent comment, use the latest status change
   3. If nothing recent, infer from ticket status and description

   ❌ DO NOT say:
   - "Ticket is in WL - Processing status"
   - "Currently being worked on"
   - "Awaiting review"

   ✅ DO say things like:
   - "Customer reported database timeout error yesterday, logs collected"
   - "Engineering team identified memory leak in auth service"
   - "Waiting for customer to confirm if issue persists after cache clear"
   - "Fix deployed to production on Nov 14, monitoring for 48 hours"
   - "Customer hasn't responded to follow-up email sent Nov 10"

   📏 LIMIT: 20 words maximum

2️⃣ ACTION (What needs to happen NEXT):

   🎯 Be ULTRA SPECIFIC:
   - WHO needs to do it
   - WHAT exactly they need to do
   - WHEN if time-sensitive

   ❌ DO NOT say:
   - "Follow up on ticket"
   - "Continue monitoring"
   - "Check status"

   ✅ DO say things like:
   - "Sarah to call customer by EOD Monday to discuss migration timeline"
   - "Escalate to database team if timeout occurs again"
   - "Close ticket after customer confirms no issues for 72 hours"
   - "Schedule demo call with customer for new feature walkthrough"
   - "Send follow-up email to customer requesting error logs"

   📏 LIMIT: 20 words maximum

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 The LATEST COMMENT is your MOST IMPORTANT source - it shows what's happening NOW
🔴 Extract concrete details from comments (names, dates, specific issues, actions taken)
🔴 Be specific, not generic
🔴 Focus on actionable information
🔴 Use natural, professional language

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Respond with ONLY this JSON (no markdown, no backticks):
{
  "status": "your status here",
  "action": "your action here"
}`
}

export function getSystemMessage(): string {
	return "You are a precise assistant specialized in analyzing support ticket comments to create handover notes. You ALWAYS prioritize the most recent comment over everything else. You extract specific details like names, dates, issues, and actions. You respond with valid JSON only."
}

import { createLogger } from "@/lib/logger"
import { getJiraConfig } from "@/lib/env"
import { fetchTickets, loadTicketData, getTicketsWithSavedData } from "@/lib/services"
import type { SlackCommandPayload } from "@/lib/security/slack-verify"

const logger = createLogger("SlackCommands")

export interface SlackCommandResponse {
	response_type?: "ephemeral" | "in_channel"
	text: string
	blocks?: SlackBlock[]
}

interface SlackBlock {
	type: string
	text?: { type: string; text: string; emoji?: boolean }
	elements?: Array<{ type: string; text: string }>
	accessory?: Record<string, unknown>
}

/**
 * Routes slash command to appropriate handler based on text content.
 */
export async function handleSlashCommand(
	payload: SlackCommandPayload
): Promise<SlackCommandResponse> {
	const { text, userName } = payload
	const args = text.trim().toLowerCase().split(/\s+/)
	const subcommand = args[0] || ""

	logger.info("Processing slash command", { userName, subcommand, args })

	switch (subcommand) {
		case "":
		case "help":
			return buildHelpResponse()
		case "list":
			return await handleListCommand()
		case "send":
			return await handleSendCommand(payload)
		default:
			// Assume it's a ticket key like TCP-12345
			if (isTicketKey(subcommand)) {
				return await handleViewTicketCommand(subcommand.toUpperCase())
			}
			return buildHelpResponse(`Unknown command: \`${subcommand}\``)
	}
}

function isTicketKey(text: string): boolean {
	return /^[a-z]+-\d+$/i.test(text)
}

function buildHelpResponse(prefix?: string): SlackCommandResponse {
	const lines = [
		prefix ? `${prefix}\n` : "",
		"*Available Commands:*",
		"\u2022 `/handover` - Show this help message",
		"\u2022 `/handover TCP-12345` - View ticket handover status",
		"\u2022 `/handover list` - Show all pending handover tickets",
		"\u2022 `/handover send` - Trigger handover message to channel",
	].filter(Boolean)

	return {
		response_type: "ephemeral",
		text: lines.join("\n"),
	}
}

async function handleViewTicketCommand(ticketKey: string): Promise<SlackCommandResponse> {
	const { baseUrl } = getJiraConfig()

	try {
		const savedData = await loadTicketData()
		const tickets = await getTicketsWithSavedData(savedData)
		const ticket = tickets.find((t) => t.key.toUpperCase() === ticketKey)

		if (!ticket) {
			return {
				response_type: "ephemeral",
				text: `Ticket \`${ticketKey}\` not found in current handover queue.`,
			}
		}

		const ticketUrl = `${baseUrl}/browse/${ticketKey}`
		const blocks: SlackBlock[] = [
			{
				type: "header",
				text: { type: "plain_text", text: `${ticketKey}`, emoji: true },
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: [
						`*Summary:* ${ticket.summary}`,
						`*Status:* ${ticket.status}`,
						`*Assignee:* ${ticket.assignee}`,
						`*WL Main Type:* ${ticket.wlMainTicketType}`,
						`*WL Sub Type:* ${ticket.wlSubTicketType}`,
						"",
						"*Handover Info:*",
						`\u2022 Status: ${ticket.savedStatus || "--"}`,
						`\u2022 Action: ${ticket.savedAction || "--"}`,
					].join("\n"),
				},
			},
			{
				type: "section",
				text: { type: "mrkdwn", text: `<${ticketUrl}|View in Jira>` },
			},
		]

		return {
			response_type: "ephemeral",
			text: `Ticket ${ticketKey}: ${ticket.summary}`,
			blocks,
		}
	} catch (error) {
		logger.error("Failed to fetch ticket", { ticketKey, error })
		return {
			response_type: "ephemeral",
			text: `Failed to fetch ticket \`${ticketKey}\`. Please try again.`,
		}
	}
}

async function handleListCommand(): Promise<SlackCommandResponse> {
	const { baseUrl } = getJiraConfig()

	try {
		const savedData = await loadTicketData()
		const tickets = await getTicketsWithSavedData(savedData)

		if (tickets.length === 0) {
			return {
				response_type: "ephemeral",
				text: "No tickets in the handover queue.",
			}
		}

		const ticketLines = tickets.slice(0, 10).map((t, i) => {
			const status = t.savedStatus !== "--" ? t.savedStatus : "_pending_"
			return `${i + 1}. <${baseUrl}/browse/${t.key}|${t.key}> - ${t.summary.slice(0, 50)}${t.summary.length > 50 ? "..." : ""} (${status})`
		})

		const moreText = tickets.length > 10 ? `\n_...and ${tickets.length - 10} more tickets_` : ""

		return {
			response_type: "ephemeral",
			text: `*Handover Queue (${tickets.length} tickets):*\n${ticketLines.join("\n")}${moreText}`,
		}
	} catch (error) {
		logger.error("Failed to list tickets", { error })
		return {
			response_type: "ephemeral",
			text: "Failed to fetch ticket list. Please try again.",
		}
	}
}

async function handleSendCommand(payload: SlackCommandPayload): Promise<SlackCommandResponse> {
	const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://handover-production.rithytep.online"

	// For sending, we redirect to the dashboard since it requires selecting tickets
	// In future, this could trigger the actual send via response_url
	return {
		response_type: "ephemeral",
		text: [
			"To send a handover, please use the dashboard:",
			`<${appUrl}|Open Handover Dashboard>`,
			"",
			"_Tip: You can configure scheduled handovers in the dashboard settings._",
		].join("\n"),
	}
}

import { describe, it, expect, vi } from "vitest"
import {
	formatTicketMessage,
	buildShiftHeader,
	getHandoverMarker,
	type TicketMessageData,
} from "../slack-formatter.service"

// Mock the env module
vi.mock("@/lib/env", () => ({
	getJiraConfig: () => ({
		baseUrl: "https://test.atlassian.net",
		email: "test@test.com",
		apiToken: "test-token",
	}),
}))

describe("SlackFormatterService", () => {
	const mockTickets: TicketMessageData[] = [
		{
			key: "PROJ-1",
			summary: "Fix login bug",
			wlMainTicketType: "Bug",
			wlSubTicketType: "Critical",
			savedStatus: "In Progress",
			savedAction: "Review code",
		},
		{
			key: "PROJ-2",
			summary: "Add new feature",
			wlMainTicketType: "Feature",
			wlSubTicketType: "Enhancement",
			savedStatus: "Done",
			savedAction: "Deploy",
		},
	]

	describe("formatTicketMessage", () => {
		it("should format tickets with default options", () => {
			const result = formatTicketMessage(mockTickets)

			expect(result).toContain("Please refer to this ticket information")
			expect(result).toContain("--- Ticket 1 ---")
			expect(result).toContain("--- Ticket 2 ---")
			expect(result).toContain("<https://test.atlassian.net/browse/PROJ-1|PROJ-1>")
			expect(result).toContain("Fix login bug")
			expect(result).toContain("WL Main Type: Bug")
			expect(result).toContain("Status: In Progress")
			expect(result).toContain("===========================")
		})

		it("should include header when provided", () => {
			const result = formatTicketMessage(mockTickets, {
				header: "*Evening Shift Handover*",
			})

			expect(result).toContain("*Evening Shift Handover*")
			expect(result).toContain("Please refer to this ticket information")
		})

		it("should include mentions when provided", () => {
			const result = formatTicketMessage(mockTickets, {
				mentions: "<@U123456> <@U789012>",
			})

			expect(result).toContain("<@U123456> <@U789012>")
		})

		it("should exclude footer when includeFooter is false", () => {
			const result = formatTicketMessage(mockTickets, {
				includeFooter: false,
			})

			expect(result).not.toContain("===========================")
		})

		it("should handle empty tickets array", () => {
			const result = formatTicketMessage([])

			expect(result).toContain("_No tickets to report._")
			expect(result).not.toContain("--- Ticket")
		})

		it("should format all ticket details correctly", () => {
			const result = formatTicketMessage([mockTickets[0]])

			expect(result).toContain("Ticket Link: <https://test.atlassian.net/browse/PROJ-1|PROJ-1> Fix login bug")
			expect(result).toContain("WL Main Type: Bug")
			expect(result).toContain("WL Sub Type: Critical")
			expect(result).toContain("Status: In Progress")
			expect(result).toContain("Action: Review code")
		})

		it("should combine all options correctly", () => {
			const result = formatTicketMessage(mockTickets, {
				header: "*Test Header*",
				mentions: "<@U123>",
				includeFooter: true,
			})

			expect(result).toContain("*Test Header*")
			expect(result).toContain("<@U123>")
			expect(result).toContain("===========================")
		})
	})

	describe("buildShiftHeader", () => {
		it("should build evening shift header with capitalized label", () => {
			const result = buildShiftHeader("evening")

			expect(result).toContain("*Evening Shift Handover")
			expect(result).toContain("*")
		})

		it("should build night shift header with capitalized label", () => {
			const result = buildShiftHeader("night")

			expect(result).toContain("*Night Shift Handover")
			expect(result).toContain("*")
		})

		it("should include date and time", () => {
			const result = buildShiftHeader("evening")

			// Should contain some date-like pattern
			expect(result.length).toBeGreaterThan(20)
			expect(result).toMatch(/\d/)
		})
	})

	describe("getHandoverMarker", () => {
		it("should return the handover marker string", () => {
			const result = getHandoverMarker()

			expect(result).toBe("*Ticket Handover Information*")
		})
	})
})

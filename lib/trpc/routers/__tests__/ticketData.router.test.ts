import { describe, it, expect, vi, beforeEach } from "vitest"

// Use vi.hoisted to define mocks before vi.mock is hoisted
const { mockSaveTicketData } = vi.hoisted(() => ({
	mockSaveTicketData: vi.fn(),
}))

// Mock the service
vi.mock("@/server/services/ticket.service", () => ({
	TicketService: class MockTicketService {
		saveTicketData = mockSaveTicketData
	},
}))

// Mock database init
vi.mock("@/server/repository/database.repository", () => ({
	initDatabase: vi.fn().mockResolvedValue(undefined),
}))

// Mock challenge validation (for protected mutations)
vi.mock("@/lib/security/challenge.service", () => ({
	validateChallenge: vi.fn().mockResolvedValue({ valid: true }),
	createChallengeErrorResponse: vi.fn(),
}))

// Import router after mocks are set up
import { ticketDataRouter } from "../ticketData"

describe("ticketDataRouter", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe("save", () => {
		it("should save ticket data with status and action", async () => {
			mockSaveTicketData.mockResolvedValue(undefined)

			const caller = ticketDataRouter.createCaller({ headers: new Headers() })
			const result = await caller.save({
				"status-PROJ-1": "In Progress",
				"action-PROJ-1": "Review code",
				"status-PROJ-2": "Done",
				"action-PROJ-2": "Deploy",
			})

			expect(mockSaveTicketData).toHaveBeenCalledWith({
				"PROJ-1": { status: "In Progress", action: "Review code" },
				"PROJ-2": { status: "Done", action: "Deploy" },
			})
			expect(result.success).toBe(true)
			expect(result.ticketCount).toBe(2)
		})

		it("should handle single ticket", async () => {
			mockSaveTicketData.mockResolvedValue(undefined)

			const caller = ticketDataRouter.createCaller({ headers: new Headers() })
			const result = await caller.save({
				"status-PROJ-1": "Open",
				"action-PROJ-1": "Investigate",
			})

			expect(mockSaveTicketData).toHaveBeenCalledWith({
				"PROJ-1": { status: "Open", action: "Investigate" },
			})
			expect(result.ticketCount).toBe(1)
		})

		it("should ignore non-status/action keys", async () => {
			mockSaveTicketData.mockResolvedValue(undefined)

			const caller = ticketDataRouter.createCaller({ headers: new Headers() })
			const result = await caller.save({
				"status-PROJ-1": "Open",
				"action-PROJ-1": "Test",
				"random-key": "ignored",
				"other": "also ignored",
			})

			expect(mockSaveTicketData).toHaveBeenCalledWith({
				"PROJ-1": { status: "Open", action: "Test" },
			})
			expect(result.ticketCount).toBe(1)
		})

		it("should handle empty input", async () => {
			mockSaveTicketData.mockResolvedValue(undefined)

			const caller = ticketDataRouter.createCaller({ headers: new Headers() })
			const result = await caller.save({})

			expect(mockSaveTicketData).toHaveBeenCalledWith({})
			expect(result.ticketCount).toBe(0)
		})

		it("should default missing status/action to --", async () => {
			mockSaveTicketData.mockResolvedValue(undefined)

			const caller = ticketDataRouter.createCaller({ headers: new Headers() })
			const result = await caller.save({
				"status-PROJ-1": "Open",
				// Missing action-PROJ-1
			})

			expect(mockSaveTicketData).toHaveBeenCalledWith({
				"PROJ-1": { status: "Open", action: "--" },
			})
			expect(result.ticketCount).toBe(1)
		})

		it("should handle multiple tickets with different statuses", async () => {
			mockSaveTicketData.mockResolvedValue(undefined)

			const caller = ticketDataRouter.createCaller({ headers: new Headers() })
			const result = await caller.save({
				"status-TICKET-001": "New",
				"action-TICKET-001": "Assign",
				"status-TICKET-002": "In Progress",
				"action-TICKET-002": "Review",
				"status-TICKET-003": "Blocked",
				"action-TICKET-003": "Escalate",
			})

			expect(result.ticketCount).toBe(3)
		})
	})
})

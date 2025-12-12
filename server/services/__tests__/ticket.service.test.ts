import { describe, it, expect, vi, beforeEach } from "vitest"
import { TicketService } from "../ticket.service"

// Create mock functions
const mockFindAll = vi.fn()
const mockFindByKey = vi.fn()
const mockUpsertMany = vi.fn()
const mockDelete = vi.fn()

// Mock the repository module
vi.mock("@/server/repository/ticket.repository", () => ({
	TicketRepository: class MockTicketRepository {
		findAll = mockFindAll
		findByKey = mockFindByKey
		upsertMany = mockUpsertMany
		delete = mockDelete
	},
}))

describe("TicketService", () => {
	let service: TicketService

	beforeEach(() => {
		vi.clearAllMocks()
		service = new TicketService()
	})

	describe("saveTicketData", () => {
		it("should call repository upsertMany with ticket data", async () => {
			const tickets = {
				"PROJ-1": { status: "In Progress", action: "Review" },
				"PROJ-2": { status: "Done", action: "Close" },
			}

			await service.saveTicketData(tickets)

			expect(mockUpsertMany).toHaveBeenCalledWith(tickets)
		})

		it("should handle empty tickets", async () => {
			await service.saveTicketData({})

			expect(mockUpsertMany).toHaveBeenCalledWith({})
		})
	})

	describe("loadTicketData", () => {
		it("should transform repository rows to domain format", async () => {
			const mockRows = [
				{
					ticket_key: "PROJ-1",
					status: "In Progress",
					action: "Review",
					updated_at: new Date("2024-01-01T10:00:00Z"),
				},
				{
					ticket_key: "PROJ-2",
					status: "Done",
					action: "Close",
					updated_at: new Date("2024-01-02T10:00:00Z"),
				},
			]

			mockFindAll.mockResolvedValue(mockRows)

			const result = await service.loadTicketData()

			expect(result).toEqual({
				"PROJ-1": {
					status: "In Progress",
					action: "Review",
					updated_at: "2024-01-01T10:00:00.000Z",
				},
				"PROJ-2": {
					status: "Done",
					action: "Close",
					updated_at: "2024-01-02T10:00:00.000Z",
				},
			})
		})

		it("should handle null updated_at", async () => {
			const mockRows = [
				{
					ticket_key: "PROJ-1",
					status: "In Progress",
					action: "Review",
					updated_at: null,
				},
			]

			mockFindAll.mockResolvedValue(mockRows)

			const result = await service.loadTicketData()

			expect(result["PROJ-1"].updated_at).toBeUndefined()
		})

		it("should return empty object when no tickets exist", async () => {
			mockFindAll.mockResolvedValue([])

			const result = await service.loadTicketData()

			expect(result).toEqual({})
		})
	})

	describe("getTicketData", () => {
		it("should return ticket data when found", async () => {
			const mockRow = {
				ticket_key: "PROJ-1",
				status: "In Progress",
				action: "Review",
				updated_at: new Date("2024-01-01T10:00:00Z"),
			}

			mockFindByKey.mockResolvedValue(mockRow)

			const result = await service.getTicketData("PROJ-1")

			expect(mockFindByKey).toHaveBeenCalledWith("PROJ-1")
			expect(result).toEqual({
				status: "In Progress",
				action: "Review",
				updated_at: "2024-01-01T10:00:00.000Z",
			})
		})

		it("should return null when ticket not found", async () => {
			mockFindByKey.mockResolvedValue(null)

			const result = await service.getTicketData("NONEXISTENT")

			expect(result).toBeNull()
		})
	})

	describe("deleteTicketData", () => {
		it("should call repository delete and return result", async () => {
			mockDelete.mockResolvedValue(true)

			const result = await service.deleteTicketData("PROJ-1")

			expect(mockDelete).toHaveBeenCalledWith("PROJ-1")
			expect(result).toBe(true)
		})

		it("should return false when delete fails", async () => {
			mockDelete.mockResolvedValue(false)

			const result = await service.deleteTicketData("NONEXISTENT")

			expect(result).toBe(false)
		})
	})
})

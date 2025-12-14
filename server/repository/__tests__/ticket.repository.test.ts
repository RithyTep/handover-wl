import { describe, it, expect, vi, beforeEach } from "vitest"
import { TicketRepository } from "../ticket.repository"
import { prisma } from "@/lib/prisma"

// Mock prisma
vi.mock("@/lib/prisma", () => ({
	prisma: {
		ticketData: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			upsert: vi.fn(),
			delete: vi.fn(),
			deleteMany: vi.fn(),
		},
		$transaction: vi.fn(),
	},
}))

describe("TicketRepository", () => {
	let repository: TicketRepository

	beforeEach(() => {
		repository = new TicketRepository()
		vi.clearAllMocks()
	})

	describe("findAll", () => {
		it("should return all tickets transformed to domain model", async () => {
			const mockPrismaData = [
				{ ticketKey: "PROJ-1", status: "In Progress", action: "Review", updatedAt: new Date("2024-01-01") },
				{ ticketKey: "PROJ-2", status: "Done", action: "Close", updatedAt: new Date("2024-01-02") },
			]

			vi.mocked(prisma.ticketData.findMany).mockResolvedValue(mockPrismaData)

			const result = await repository.findAll()

			expect(prisma.ticketData.findMany).toHaveBeenCalledTimes(1)
			expect(result).toHaveLength(2)
			expect(result[0]).toEqual({
				ticket_key: "PROJ-1",
				status: "In Progress",
				action: "Review",
				updated_at: new Date("2024-01-01"),
			})
			expect(result[1]).toEqual({
				ticket_key: "PROJ-2",
				status: "Done",
				action: "Close",
				updated_at: new Date("2024-01-02"),
			})
		})

		it("should return empty array when no tickets exist", async () => {
			vi.mocked(prisma.ticketData.findMany).mockResolvedValue([])

			const result = await repository.findAll()

			expect(result).toEqual([])
		})
	})

	describe("findByKey", () => {
		it("should return ticket when found", async () => {
			const mockPrismaData = {
				ticketKey: "PROJ-1",
				status: "In Progress",
				action: "Review",
				updatedAt: new Date("2024-01-01"),
			}

			vi.mocked(prisma.ticketData.findUnique).mockResolvedValue(mockPrismaData)

			const result = await repository.findByKey("PROJ-1")

			expect(prisma.ticketData.findUnique).toHaveBeenCalledWith({
				where: { ticketKey: "PROJ-1" },
			})
			expect(result).toEqual({
				ticket_key: "PROJ-1",
				status: "In Progress",
				action: "Review",
				updated_at: new Date("2024-01-01"),
			})
		})

		it("should return null when ticket not found", async () => {
			vi.mocked(prisma.ticketData.findUnique).mockResolvedValue(null)

			const result = await repository.findByKey("NONEXISTENT")

			expect(result).toBeNull()
		})
	})

	describe("upsert", () => {
		it("should upsert a ticket and return domain model", async () => {
			const mockPrismaData = {
				ticketKey: "PROJ-1",
				status: "Done",
				action: "Close",
				updatedAt: new Date("2024-01-01"),
			}

			vi.mocked(prisma.ticketData.upsert).mockResolvedValue(mockPrismaData)

			const result = await repository.upsert("PROJ-1", "Done", "Close")

			expect(prisma.ticketData.upsert).toHaveBeenCalledWith({
				where: { ticketKey: "PROJ-1" },
				update: { status: "Done", action: "Close", updatedAt: expect.any(Date) },
				create: { ticketKey: "PROJ-1", status: "Done", action: "Close" },
			})
			expect(result.ticket_key).toBe("PROJ-1")
			expect(result.status).toBe("Done")
			expect(result.action).toBe("Close")
		})
	})

	describe("upsertMany", () => {
		it("should upsert multiple tickets in a transaction", async () => {
			const tickets = {
				"PROJ-1": { status: "In Progress", action: "Review" },
				"PROJ-2": { status: "Done", action: "Close" },
			}

			vi.mocked(prisma.$transaction).mockResolvedValue([])

			await repository.upsertMany(tickets)

			expect(prisma.$transaction).toHaveBeenCalledTimes(1)
			expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Array))
		})

		it("should handle empty tickets object", async () => {
			vi.mocked(prisma.$transaction).mockResolvedValue([])

			await repository.upsertMany({})

			expect(prisma.$transaction).toHaveBeenCalledWith([])
		})
	})

	describe("delete", () => {
		it("should return true when ticket is deleted successfully", async () => {
			vi.mocked(prisma.ticketData.delete).mockResolvedValue({
				ticketKey: "PROJ-1",
				status: "Done",
				action: "Close",
				updatedAt: new Date(),
			})

			const result = await repository.delete("PROJ-1")

			expect(prisma.ticketData.delete).toHaveBeenCalledWith({
				where: { ticketKey: "PROJ-1" },
			})
			expect(result).toBe(true)
		})

		it("should return false when delete fails", async () => {
			vi.mocked(prisma.ticketData.delete).mockRejectedValue(new Error("Not found"))

			const result = await repository.delete("NONEXISTENT")

			expect(result).toBe(false)
		})
	})

	describe("deleteAll", () => {
		it("should delete all tickets", async () => {
			vi.mocked(prisma.ticketData.deleteMany).mockResolvedValue({ count: 5 })

			await repository.deleteAll()

			expect(prisma.ticketData.deleteMany).toHaveBeenCalledTimes(1)
		})
	})
})

import { describe, it, expect, vi, beforeEach } from "vitest"
import { BackupType } from "@/enums"

// Use vi.hoisted to define mocks before vi.mock is hoisted
const { mockGetAllItems, mockCreate, mockRestore, mockTransformToItem } = vi.hoisted(() => ({
	mockGetAllItems: vi.fn(),
	mockCreate: vi.fn(),
	mockRestore: vi.fn(),
	mockTransformToItem: vi.fn(),
}))

// Mock the service
vi.mock("@/server/services/backup.service", () => ({
	BackupService: class MockBackupService {
		getAllItems = mockGetAllItems
		create = mockCreate
		restore = mockRestore
		transformToItem = mockTransformToItem
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
import { backupRouter } from "../backup"

describe("backupRouter", () => {
	const mockBackup = {
		id: 1,
		backup_type: "manual",
		description: "Test backup",
		data: {},
		created_at: "2024-01-01T00:00:00.000Z",
	}

	const mockBackupItem = {
		id: 1,
		backup_type: "manual",
		description: "Test backup",
		created_at: "2024-01-01T00:00:00.000Z",
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe("getAll", () => {
		it("should return all backups", async () => {
			mockGetAllItems.mockResolvedValue([mockBackupItem])

			const caller = backupRouter.createCaller({})
			const result = await caller.getAll()

			expect(mockGetAllItems).toHaveBeenCalled()
			expect(result.success).toBe(true)
			expect(result.backups).toEqual([mockBackupItem])
		})

		it("should return empty array when no backups exist", async () => {
			mockGetAllItems.mockResolvedValue([])

			const caller = backupRouter.createCaller({})
			const result = await caller.getAll()

			expect(result.success).toBe(true)
			expect(result.backups).toEqual([])
		})
	})

	describe("create", () => {
		it("should create a new backup", async () => {
			mockCreate.mockResolvedValue(mockBackup)
			mockTransformToItem.mockReturnValue(mockBackupItem)

			const caller = backupRouter.createCaller({ headers: new Headers() })
			const result = await caller.create({
				backup_type: BackupType.MANUAL,
				description: "Test backup",
			})

			expect(mockCreate).toHaveBeenCalledWith("manual", "Test backup")
			expect(mockTransformToItem).toHaveBeenCalledWith(mockBackup)
			expect(result.success).toBe(true)
			expect(result.backup).toEqual(mockBackupItem)
		})

		it("should create a backup with auto type", async () => {
			const autoBackup = { ...mockBackup, backup_type: "auto" }
			const autoBackupItem = { ...mockBackupItem, backup_type: "auto" }
			mockCreate.mockResolvedValue(autoBackup)
			mockTransformToItem.mockReturnValue(autoBackupItem)

			const caller = backupRouter.createCaller({ headers: new Headers() })
			const result = await caller.create({
				backup_type: BackupType.AUTO,
				description: "Automatic backup",
			})

			expect(mockCreate).toHaveBeenCalledWith("auto", "Automatic backup")
			expect(result.backup.backup_type).toBe("auto")
		})
	})

	describe("restore", () => {
		it("should restore from a backup", async () => {
			mockRestore.mockResolvedValue(undefined)

			const caller = backupRouter.createCaller({ headers: new Headers() })
			const result = await caller.restore({ backupId: 1 })

			expect(mockRestore).toHaveBeenCalledWith(1)
			expect(result.success).toBe(true)
		})

		it("should handle restore of different backup ids", async () => {
			mockRestore.mockResolvedValue(undefined)

			const caller = backupRouter.createCaller({ headers: new Headers() })
			const result = await caller.restore({ backupId: 99 })

			expect(mockRestore).toHaveBeenCalledWith(99)
			expect(result.success).toBe(true)
		})
	})
})

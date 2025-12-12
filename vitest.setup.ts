import "@testing-library/jest-dom/vitest"
import { afterAll, afterEach, vi } from "vitest"

// Mock environment variables
vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost:5432/test")
vi.stubEnv("JIRA_URL", "https://test.atlassian.net")
vi.stubEnv("JIRA_EMAIL", "test@test.com")
vi.stubEnv("JIRA_API_TOKEN", "test-token")
vi.stubEnv("SLACK_BOT_TOKEN", "xoxb-test-token")
vi.stubEnv("SLACK_CHANNEL", "C123456")
vi.stubEnv("OPENAI_API_KEY", "sk-test-key")
vi.stubEnv("AI_MODEL", "gpt-4o-mini")

// Mock Prisma globally
vi.mock("@/lib/prisma", () => ({
	prisma: {
		ticketData: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			upsert: vi.fn(),
			delete: vi.fn(),
			deleteMany: vi.fn(),
		},
		scheduledComment: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			deleteMany: vi.fn(),
			createMany: vi.fn(),
		},
		backup: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			delete: vi.fn(),
			deleteMany: vi.fn(),
		},
		feedback: {
			findMany: vi.fn(),
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
		},
		appSetting: {
			findUnique: vi.fn(),
			upsert: vi.fn(),
		},
		$transaction: vi.fn((callback) => callback({
			ticketData: {
				upsert: vi.fn(),
				deleteMany: vi.fn(),
			},
			scheduledComment: {
				create: vi.fn(),
				deleteMany: vi.fn(),
			},
			appSetting: {
				upsert: vi.fn(),
			},
		})),
		$queryRaw: vi.fn(),
		$disconnect: vi.fn(),
	},
}))

// Mock logger to prevent console output during tests
vi.mock("@/lib/logger", () => ({
	createLogger: () => ({
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		debug: vi.fn(),
		time: vi.fn(() => ({ end: vi.fn() })),
	}),
	logger: {
		db: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), time: vi.fn(() => ({ end: vi.fn() })) },
		jira: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), time: vi.fn(() => ({ end: vi.fn() })) },
		slack: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), time: vi.fn(() => ({ end: vi.fn() })) },
		scheduler: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), time: vi.fn(() => ({ end: vi.fn() })) },
		api: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), time: vi.fn(() => ({ end: vi.fn() })) },
	},
}))

// Reset all mocks after each test
afterEach(() => {
	vi.clearAllMocks()
})

// Clean up after all tests
afterAll(() => {
	vi.unstubAllEnvs()
})

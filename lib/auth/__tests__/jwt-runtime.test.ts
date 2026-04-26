import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import path from "node:path"

describe("jwt runtime compatibility", () => {
	it("does not import node crypto in the shared jwt module", () => {
		const jwtPath = path.resolve(process.cwd(), "lib/auth/jwt.ts")
		const source = readFileSync(jwtPath, "utf8")

		expect(source).not.toMatch(/from\s+["']crypto["']/)
	})
})

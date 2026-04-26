import { describe, expect, it } from "vitest"
import { Theme } from "@/enums"
import { THEMES } from "@/lib/constants"
import { THEME_VALUES, isValidTheme } from "@/lib/types"

describe("theme registration", () => {
	it("accepts sakura as a valid theme value", () => {
		expect(isValidTheme("sakura")).toBe(true)
		expect(THEME_VALUES).toContain(Theme.SAKURA)
	})

	it("exposes sakura in the selectable theme list", () => {
		expect(THEMES).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: Theme.SAKURA,
					name: "Sakura",
				}),
			])
		)
	})
})

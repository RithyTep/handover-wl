import { describe, expect, it } from "vitest"
import { Theme } from "@/enums"
import { getHeaderNavItems, getThemeConfig } from "@/lib/theme"

describe("sakura theme config", () => {
	it("returns the sakura theme config", () => {
		const config = getThemeConfig(Theme.SAKURA)

		expect(config.layout.body).toBe("theme-sakura")
		expect(config.header.logo.svgIcon).toBe("/icons/sakura/blossom.svg")
		expect(config.actions.aiFill.svgIcon).toBe("/icons/sakura/blossom.svg")
	})

	it("uses sakura-specific header nav icons", () => {
		const items = getHeaderNavItems(Theme.SAKURA)

		expect(items).toEqual([
			{
				href: "/feedback",
				label: "Feedback",
				svgIcon: "/icons/sakura/fan.svg",
			},
			{
				href: "/changelog",
				label: "Changelog",
				svgIcon: "/icons/sakura/branch.svg",
			},
		])
	})
})

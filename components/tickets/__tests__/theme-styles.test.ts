import { describe, expect, it } from "vitest"
import { Theme } from "@/enums"
import { getButtonThemeStyles, getTableThemeStyles } from "@/components/tickets"

describe("sakura ticket theme styles", () => {
	it("returns sakura-specific table styles", () => {
		const styles = getTableThemeStyles(Theme.SAKURA)

		expect(styles.container).toContain("sakura-table-shell")
		expect(styles.header).toContain("sakura-table-header")
		expect(styles.row(0)).toContain("sakura-table-row")
		expect(styles.cell(0)).toContain("sakura-table-cell")
	})

	it("returns sakura-specific toggle button styles", () => {
		expect(getButtonThemeStyles(Theme.SAKURA)).toContain("sakura-toggle-btn")
	})
})

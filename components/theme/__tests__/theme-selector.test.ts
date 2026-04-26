import { describe, expect, it } from "vitest"
import { Theme } from "@/enums"
import { getThemeSelectorSurfaceStyles } from "@/components/theme/theme-selector"

describe("theme selector sakura styles", () => {
	it("returns light sakura surface classes", () => {
		const styles = getThemeSelectorSurfaceStyles(Theme.SAKURA)

		expect(styles.dialogContent).toContain("bg-white/92")
		expect(styles.selectTrigger).toContain("bg-white/90")
		expect(styles.selectContent).toContain("bg-white/95")
		expect(styles.aboutCard).toContain("bg-rose-50/70")
		expect(styles.saveButton).toContain("bg-white")
	})
})

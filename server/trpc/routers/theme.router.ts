import { router, publicProcedure, protectedMutation } from "@/server/trpc/server"
import { ThemeService } from "@/server/services/theme.service"
import { themeSchema } from "@/lib/types"

const themeService = new ThemeService()

export const themeRouter = router({
	getAll: publicProcedure.query(() => {
		return themeService.getAllThemes()
	}),

	getSelected: publicProcedure.query(async () => {
		const theme = await themeService.getSelectedTheme()
		return { theme }
	}),

	setSelected: protectedMutation.input(themeSchema).mutation(async ({ input }) => {
		await themeService.setSelectedTheme(input)
		return { success: true, theme: input }
	}),
})

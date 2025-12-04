import { router, publicProcedure } from "@/server/trpc/server";
import { ThemeService } from "@/server/services/theme.service";
import { themeSetRequestSchema } from "@/schemas/theme.schema";

const themeService = new ThemeService();

export const themeRouter = router({
  getAll: publicProcedure.query(() => {
    return themeService.getAllThemes();
  }),

  getSelected: publicProcedure.query(async () => {
    const theme = await themeService.getSelectedTheme();
    return { theme };
  }),

  setSelected: publicProcedure
    .input(themeSetRequestSchema)
    .mutation(async ({ input }) => {
      await themeService.setSelectedTheme(input.theme);
      return { success: true, theme: input.theme };
    }),
});

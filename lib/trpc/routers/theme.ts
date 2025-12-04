import { z } from "zod";
import { router, publicProcedure } from "../server";
import { getThemePreference, setThemePreference } from "@/lib/services/database";
import { THEMES } from "@/lib/constants";
import type { ThemeInfo } from "@/interfaces/theme.interface";

export const themeRouter = router({
  getAll: publicProcedure.query(async (): Promise<ThemeInfo[]> => {
    // Return themes from constants
    // In the future, this could fetch from database if themes are dynamic
    return THEMES;
  }),

  getSelected: publicProcedure.query(async () => {
    const theme = await getThemePreference();
    return { theme };
  }),

  setSelected: publicProcedure
    .input(
      z.object({
        theme: z.enum(["default", "christmas", "pixel", "lunar", "coding"]),
      })
    )
    .mutation(async ({ input }) => {
      await setThemePreference(input.theme);
      return { success: true, theme: input.theme };
    }),
});

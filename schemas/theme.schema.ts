import { z } from "zod";
import { Theme } from "@/enums/theme.enum";

export const themeEnumSchema = z.nativeEnum(Theme);

export const themeSetRequestSchema = z.object({
  theme: themeEnumSchema,
});

export const themeInfoSchema = z.object({
  id: themeEnumSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

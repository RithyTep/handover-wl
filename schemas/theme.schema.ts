import { z } from "zod"
import { Theme } from "@/enums"

export const themeSchema = z.nativeEnum(Theme)

export const themeSetRequestSchema = z.object({
	theme: themeSchema,
})

export const themeInfoSchema = z.object({
	id: themeSchema,
	name: z.string().min(1),
	description: z.string().min(1),
	icon: z.string().min(1),
})

export type ThemeSetRequest = z.infer<typeof themeSetRequestSchema>
export type ThemeInfoSchema = z.infer<typeof themeInfoSchema>

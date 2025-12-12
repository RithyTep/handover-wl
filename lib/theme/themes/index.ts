/**
 * Theme Configurations Index
 *
 * Re-exports all theme configurations and provides the theme map.
 */

import type { Theme } from "@/lib/types"
import type { ThemeConfig } from "../types"

// Individual theme exports
export { defaultThemeConfig } from "./default"
export { pixelThemeConfig } from "./pixel"
export { lunarThemeConfig } from "./lunar"
export { christmasThemeConfig } from "./christmas"
export { codingThemeConfig } from "./coding"
export { clashThemeConfig } from "./clash"
export { angkorPixelThemeConfig } from "./angkor-pixel"

// Import for map
import { defaultThemeConfig } from "./default"
import { pixelThemeConfig } from "./pixel"
import { lunarThemeConfig } from "./lunar"
import { christmasThemeConfig } from "./christmas"
import { codingThemeConfig } from "./coding"
import { clashThemeConfig } from "./clash"
import { angkorPixelThemeConfig } from "./angkor-pixel"

/**
 * Theme Configuration Map
 *
 * Maps theme identifiers to their configurations.
 */
export const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
	default: defaultThemeConfig,
	pixel: pixelThemeConfig,
	lunar: lunarThemeConfig,
	christmas: christmasThemeConfig,
	coding: codingThemeConfig,
	clash: clashThemeConfig,
	angkor_pixel: angkorPixelThemeConfig,
}

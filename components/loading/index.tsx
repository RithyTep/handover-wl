import { DefaultLoading } from "./default-loading"
import { ChristmasLoading } from "./christmas-loading"
import { PixelLoading } from "./pixel-loading"
import { LunarLoading } from "./lunar-loading"
import { CodingLoading } from "./coding-loading"
import { ClashLoading } from "./clash-loading"
import { AngkorPixelLoading } from "./angkor-pixel-loading"

export function ThemedLoading() {
	return (
		<>
			<style>{`.loading-theme{display:none}[data-loading-theme="default"] .loading-default,[data-loading-theme="christmas"] .loading-christmas,[data-loading-theme="pixel"] .loading-pixel,[data-loading-theme="lunar"] .loading-lunar,[data-loading-theme="coding"] .loading-coding,[data-loading-theme="clash"] .loading-clash,[data-loading-theme="angkor_pixel"] .loading-angkor-pixel{display:block}`}</style>
			<div className="loading-theme loading-default"><DefaultLoading /></div>
			<div className="loading-theme loading-christmas"><ChristmasLoading /></div>
			<div className="loading-theme loading-pixel"><PixelLoading /></div>
			<div className="loading-theme loading-lunar"><LunarLoading /></div>
			<div className="loading-theme loading-coding"><CodingLoading /></div>
			<div className="loading-theme loading-clash"><ClashLoading /></div>
			<div className="loading-theme loading-angkor-pixel"><AngkorPixelLoading /></div>
		</>
	)
}

// Re-export individual components for direct use
export { DefaultLoading } from "./default-loading"
export { ChristmasLoading } from "./christmas-loading"
export { PixelLoading } from "./pixel-loading"
export { LunarLoading } from "./lunar-loading"
export { CodingLoading } from "./coding-loading"
export { ClashLoading } from "./clash-loading"
export { AngkorPixelLoading } from "./angkor-pixel-loading"

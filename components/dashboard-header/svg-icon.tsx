import Image from "next/image"
import { cn } from "@/lib/utils"
import type { SvgIconProps } from "./types"

export const SvgIcon = ({ src, className, alt = "" }: SvgIconProps) => (
	<Image
		src={src}
		alt={alt}
		width={16}
		height={16}
		className={cn("w-4 h-4", className)}
		aria-hidden="true"
	/>
)

"use client"

import Image from "next/image"

export function SakuraScene() {
	return (
		<div className="fixed inset-0 z-0 pointer-events-none overflow-hidden sakura-scene">
			<Image
				src="/assets/sakura/background/sakura-dashboard-bg.png"
				alt=""
				fill
				priority
				className="object-cover object-center"
			/>
			<div className="absolute inset-0 sakura-image-soften" />
			<div className="absolute inset-0 sakura-paper-noise" />
		</div>
	)
}

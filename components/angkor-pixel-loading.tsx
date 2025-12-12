"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface AngkorPixelLoadingProps {
	isLoading?: boolean
	progress?: number
	message?: string
}

export function AngkorPixelLoading({
	isLoading = true,
	progress = 0,
	message = "Loading...",
}: AngkorPixelLoadingProps) {
	const [animatedProgress, setAnimatedProgress] = useState(0)
	const [dots, setDots] = useState("")

	useEffect(() => {
		if (isLoading) {
			const progressInterval = setInterval(() => {
				setAnimatedProgress((prev) => {
					if (progress > 0) return progress
					const next = prev + Math.random() * 10
					return next > 90 ? 90 : next
				})
			}, 200)

			const dotsInterval = setInterval(() => {
				setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
			}, 500)

			return () => {
				clearInterval(progressInterval)
				clearInterval(dotsInterval)
			}
		} else {
			setAnimatedProgress(100)
		}
	}, [isLoading, progress])

	if (!isLoading && animatedProgress >= 100) return null

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2d4a3e]">
			<div
				className="absolute inset-0 opacity-30"
				style={{
					backgroundImage: "url('/assets/angkor-pixel/background.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					imageRendering: "pixelated",
				}}
			/>

			<div className="relative z-10 flex flex-col items-center gap-6">
				<div className="angkor-monster-goblin" style={{ transform: "scale(1.5)" }} />

				<div className="relative w-80">
					<div
						className="h-10 rounded-lg overflow-hidden"
						style={{
							background: "linear-gradient(180deg, #3a2a1a 0%, #2a1a0a 100%)",
							border: "3px solid #8b7355",
							boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
						}}
					>
							<div
							className="h-full transition-all duration-300 ease-out"
							style={{
								width: `${animatedProgress}%`,
								background: "linear-gradient(180deg, #d4af37 0%, #b8960f 50%, #8b7355 100%)",
								boxShadow: "inset 0 2px 0 rgba(255,255,255,0.3), 0 0 10px rgba(212,175,55,0.5)",
							}}
						/>
					</div>

						<div className="absolute inset-0 flex items-center justify-center">
						<span
							className="text-sm font-bold"
							style={{
								color: "#f5e6d3",
								textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
								fontFamily: "'Kantumruy Pro', monospace",
							}}
						>
							{Math.round(animatedProgress)}%
						</span>
					</div>
				</div>

					<p
					className="text-lg font-bold uppercase tracking-wider"
					style={{
						color: "#ffd700",
						textShadow: "2px 2px 0 #3a2a1a",
						fontFamily: "'Kantumruy Pro', monospace",
					}}
				>
					{message}
					{dots}
				</p>

					<div className="absolute -top-20 -left-20 opacity-60">
					<Image
						src="/assets/angkor-pixel/pixel-art/cloud-1.png"
						alt=""
						width={150}
						height={80}
						style={{ imageRendering: "pixelated" }}
					/>
				</div>
				<div className="absolute -top-10 -right-20 opacity-60">
					<Image
						src="/assets/angkor-pixel/pixel-art/cloud-2.png"
						alt=""
						width={120}
						height={60}
						style={{ imageRendering: "pixelated" }}
					/>
				</div>
			</div>
		</div>
	)
}

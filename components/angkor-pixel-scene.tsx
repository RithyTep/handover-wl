"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Cloud {
	id: number
	src: string
	top: number
	delay: number
	duration: number
	scale: number
}

interface Monster {
	id: number
	type: "goblin" | "mushroom" | "skeleton" | "flying-eye"
	position: "left" | "right"
}

export function AngkorPixelScene() {
	const [clouds, setClouds] = useState<Cloud[]>([])
	const [monsters, setMonsters] = useState<Monster[]>([])

	useEffect(() => {
		// Generate random clouds
		const cloudSources = [
			"/assets/angkor-pixel/pixel-art/cloud-1.png",
			"/assets/angkor-pixel/pixel-art/cloud-2.png",
			"/assets/angkor-pixel/pixel-art/cloud-3.png",
			"/assets/angkor-pixel/pixel-art/cloud-sun.png",
		]

		const generatedClouds: Cloud[] = Array.from({ length: 5 }, (_, i) => ({
			id: i,
			src: cloudSources[Math.floor(Math.random() * cloudSources.length)],
			top: Math.random() * 30 + 5,
			delay: Math.random() * 30,
			duration: 60 + Math.random() * 40,
			scale: 0.3 + Math.random() * 0.4,
		}))
		setClouds(generatedClouds)

		// Generate monsters
		const monsterTypes: Monster["type"][] = ["goblin", "mushroom", "skeleton", "flying-eye"]
		const generatedMonsters: Monster[] = [
			{ id: 1, type: monsterTypes[Math.floor(Math.random() * monsterTypes.length)], position: "left" },
			{ id: 2, type: monsterTypes[Math.floor(Math.random() * monsterTypes.length)], position: "right" },
		]
		setMonsters(generatedMonsters)
	}, [])

	return (
		<>
			{/* Floating clouds */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				{clouds.map((cloud) => (
					<div
						key={cloud.id}
						className="absolute"
						style={{
							top: `${cloud.top}%`,
							left: "-20%",
							animation: `angkor-cloud-drift ${cloud.duration}s linear infinite`,
							animationDelay: `${cloud.delay}s`,
							transform: `scale(${cloud.scale})`,
							opacity: 0.8,
						}}
					>
						<Image
							src={cloud.src}
							alt="Cloud"
							width={400}
							height={200}
							className="object-contain"
							style={{ imageRendering: "pixelated" }}
						/>
					</div>
				))}
			</div>
		</>
	)
}

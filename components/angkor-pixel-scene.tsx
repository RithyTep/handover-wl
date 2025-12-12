import Image from "next/image"

interface Cloud {
	id: number
	src: string
	top: number
	delay: number
	duration: number
	scale: number
}

const CLOUDS: Cloud[] = [
	{ id: 0, src: "/assets/angkor-pixel/pixel-art/cloud-1.png", top: 8, delay: 0, duration: 70, scale: 0.5 },
	{ id: 1, src: "/assets/angkor-pixel/pixel-art/cloud-2.png", top: 18, delay: 15, duration: 85, scale: 0.4 },
	{ id: 2, src: "/assets/angkor-pixel/pixel-art/cloud-sun.png", top: 5, delay: 8, duration: 90, scale: 0.6 },
	{ id: 3, src: "/assets/angkor-pixel/pixel-art/cloud-3.png", top: 25, delay: 22, duration: 75, scale: 0.35 },
	{ id: 4, src: "/assets/angkor-pixel/pixel-art/cloud-1.png", top: 32, delay: 5, duration: 80, scale: 0.45 },
]

export function AngkorPixelScene() {

	return (
		<>
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				{CLOUDS.map((cloud) => (
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
							alt=""
							width={400}
							height={200}
							className="object-contain"
							style={{ imageRendering: "pixelated" }}
							priority
						/>
					</div>
				))}
			</div>
		</>
	)
}

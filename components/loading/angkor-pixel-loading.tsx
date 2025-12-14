export function AngkorPixelLoading() {
	return (
		<div
			className="min-h-screen relative overflow-hidden flex items-center justify-center"
			style={{
				backgroundColor: "#2d4a3e",
				backgroundImage: "url('/assets/angkor-pixel/background.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="relative z-10 flex flex-col items-center gap-6 p-8">
				<div
					className="relative"
					style={{
						width: "96px",
						height: "96px",
						backgroundImage:
							"url('/assets/angkor-pixel/pixel-art/face-brown-spiky.png')",
						backgroundSize: "contain",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
						imageRendering: "pixelated",
						animation: "angkor-bounce 1s ease-in-out infinite",
					}}
				/>

				<h1
					className="text-3xl sm:text-4xl font-bold uppercase tracking-wide text-center"
					style={{
						color: "#ffd700",
						textShadow:
							"-2px -2px 0 #3a2a1a, 2px -2px 0 #3a2a1a, -2px 2px 0 #3a2a1a, 2px 2px 0 #3a2a1a, 0 4px 0 #1a0a00",
						fontFamily: "'Press Start 2P', 'Kantumruy Pro', monospace",
						fontSize: "20px",
					}}
				>
					Handover
				</h1>

				<div
					className="relative w-80 max-w-[90vw]"
					style={{
						height: "48px",
					}}
				>
					<div
						className="absolute inset-0"
						style={{
							backgroundImage:
								"url('/assets/angkor-pixel/buttons/progress-bar-6.png')",
							backgroundSize: "100% 100%",
							backgroundRepeat: "no-repeat",
							imageRendering: "pixelated",
							animation: "angkor-progress-frames 3s steps(1) infinite",
						}}
					/>
				</div>
			</div>

			<style>
				{`
					@keyframes angkor-bounce {
						0%, 100% { transform: translateY(0); }
						50% { transform: translateY(-8px); }
					}
					@keyframes angkor-progress-frames {
						0% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-6.png'); }
						16.67% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-5.png'); }
						33.33% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-4.png'); }
						50% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-3.png'); }
						66.67% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-2.png'); }
						83.33% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-1.png'); }
						100% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-1.png'); }
					}
				`}
			</style>
		</div>
	)
}

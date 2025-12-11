export default function Loading() {
	return (
		<div
			className="min-h-screen relative overflow-hidden flex items-center justify-center"
			style={{
				backgroundColor: '#2d4a3e',
				backgroundImage: "url('/assets/angkor-pixel/background.png')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			{/* CSS Keyframes for animations */}
			<style dangerouslySetInnerHTML={{
				__html: `
					@keyframes angkor-progress-frames {
						0%, 16.66% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-6.png'); }
						16.67%, 33.32% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-5.png'); }
						33.33%, 49.99% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-4.png'); }
						50%, 66.66% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-3.png'); }
						66.67%, 83.32% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-2.png'); }
						83.33%, 100% { background-image: url('/assets/angkor-pixel/buttons/progress-bar-1.png'); }
					}
					@keyframes angkor-bounce {
						0%, 100% { transform: translateY(0); }
						50% { transform: translateY(-8px); }
					}
					@keyframes angkor-dots {
						0%, 20% { opacity: 0; }
						40% { opacity: 1; }
						100% { opacity: 0; }
					}
				`
			}} />

			{/* Loading Content */}
			<div className="relative z-10 flex flex-col items-center gap-6 p-8">
				{/* Pixel Art Character */}
				<div
					className="relative"
					style={{
						width: '96px',
						height: '96px',
						backgroundImage: "url('/assets/angkor-pixel/pixel-art/face-brown-spiky.png')",
						backgroundSize: 'contain',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						imageRendering: 'pixelated',
						animation: 'angkor-bounce 1s ease-in-out infinite',
					}}
				/>

				{/* Title */}
				<h1
					className="text-3xl sm:text-4xl font-bold uppercase tracking-wide text-center"
					style={{
						color: '#ffd700',
						textShadow: '-2px -2px 0 #3a2a1a, 2px -2px 0 #3a2a1a, -2px 2px 0 #3a2a1a, 2px 2px 0 #3a2a1a, 0 4px 0 #1a0a00',
						fontFamily: "'Press Start 2P', 'Kantumruy Pro', monospace",
						fontSize: '20px',
					}}
				>
					Handover
				</h1>

				{/* Subtitle */}
				<p
					className="text-xs uppercase tracking-widest"
					style={{
						color: '#d4af37',
						textShadow: '1px 1px 0 #3a2a1a',
						fontFamily: "'Press Start 2P', monospace",
						fontSize: '8px',
					}}
				>
					Task Manager
				</p>

				{/* Progress Bar Container */}
				<div
					className="relative w-80 max-w-[90vw]"
					style={{
						height: '48px',
					}}
				>
					{/* Animated Progress Bar (cycles through PNG frames) */}
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: "url('/assets/angkor-pixel/buttons/progress-bar-6.png')",
							backgroundSize: '100% 100%',
							backgroundRepeat: 'no-repeat',
							imageRendering: 'pixelated',
							animation: 'angkor-progress-frames 3s steps(1) infinite',
						}}
					/>

					{/* Progress Text */}
					<div
						className="absolute inset-0 flex items-center justify-center"
						style={{
							color: '#f5e6d3',
							textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
							fontFamily: "'Press Start 2P', monospace",
							fontSize: '10px',
						}}
					>
						Loading
						<span style={{ animation: 'angkor-dots 1.5s infinite', animationDelay: '0s' }}>.</span>
						<span style={{ animation: 'angkor-dots 1.5s infinite', animationDelay: '0.3s' }}>.</span>
						<span style={{ animation: 'angkor-dots 1.5s infinite', animationDelay: '0.6s' }}>.</span>
					</div>
				</div>

			</div>
		</div>
	)
}

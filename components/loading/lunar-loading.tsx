export function LunarLoading() {
	return (
		<div
			className="min-h-screen flex items-center justify-center"
			style={{
				background: "linear-gradient(180deg, #1a0a0a 0%, #2d1515 50%, #1a0a0a 100%)",
			}}
		>
			<div className="flex flex-col items-center gap-6">
				{/* Lantern */}
				<div className="relative">
					<div
						className="text-7xl"
						style={{ animation: "lunar-sway 3s ease-in-out infinite" }}
					>
						🏮
					</div>
				</div>

				<h1
					className="text-3xl font-bold"
					style={{
						color: "#d4af37",
						textShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
					}}
				>
					Handover
				</h1>

				{/* Dragon decoration */}
				<div className="flex gap-2 text-2xl">
					<span style={{ animation: "lunar-float 2s ease-in-out infinite" }}>🐉</span>
					<span style={{ animation: "lunar-float 2s ease-in-out infinite 0.3s" }}>🧧</span>
					<span style={{ animation: "lunar-float 2s ease-in-out infinite 0.6s" }}>🐉</span>
				</div>

				<p className="text-amber-200/60 text-sm">恭喜发财...</p>
			</div>

			<style>{`
				@keyframes lunar-sway {
					0%, 100% { transform: rotate(-5deg); }
					50% { transform: rotate(5deg); }
				}
				@keyframes lunar-float {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-10px); }
				}
			`}</style>
		</div>
	)
}

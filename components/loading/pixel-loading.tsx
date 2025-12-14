export function PixelLoading() {
	return (
		<div
			className="min-h-screen flex items-center justify-center"
			style={{
				backgroundColor: "#0f0a1a",
				backgroundImage: `
					linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
					linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
				`,
				backgroundSize: "20px 20px",
			}}
		>
			<div className="flex flex-col items-center gap-6">
				{/* Pixel art loading bar */}
				<div
					className="w-48 h-8 border-4 border-indigo-500 bg-slate-900"
					style={{ imageRendering: "pixelated" }}
				>
					<div
						className="h-full bg-indigo-500"
						style={{
							animation: "pixel-load 2s ease-in-out infinite",
							imageRendering: "pixelated",
						}}
					/>
				</div>
			</div>

			<style>{`
				@keyframes pixel-load {
					0%, 100% { width: 0%; }
					50% { width: 100%; }
				}
			`}</style>
		</div>
	)
}

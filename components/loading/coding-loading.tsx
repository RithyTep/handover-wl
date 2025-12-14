export function CodingLoading() {
	return (
		<div
			className="min-h-screen flex items-center justify-center"
			style={{
				backgroundColor: "#0d1117",
				backgroundImage: `
					radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.05) 0%, transparent 50%),
					radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)
				`,
			}}
		>
			<div className="flex flex-col items-center gap-6">
				{/* Terminal window */}
				<div
					className="w-64 rounded-lg overflow-hidden"
					style={{
						backgroundColor: "#161b22",
						border: "1px solid #30363d",
						boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
					}}
				>
					{/* Title bar */}
					<div
						className="flex items-center gap-2 px-3 py-2"
						style={{ backgroundColor: "#21262d" }}
					>
						<div className="flex gap-1.5">
							<div className="w-3 h-3 rounded-full bg-red-500" />
							<div className="w-3 h-3 rounded-full bg-yellow-500" />
							<div className="w-3 h-3 rounded-full bg-green-500" />
						</div>
						<span className="text-xs text-gray-500 ml-2">terminal</span>
					</div>
					{/* Terminal content */}
					<div className="p-4 font-mono text-sm">
						<div className="text-green-400">$ loading handover</div>
						<div
							className="text-cyan-400 mt-2"
							style={{ animation: "coding-blink 1s infinite" }}
						>
							▊
						</div>
					</div>
				</div>

				<h1
					className="text-2xl font-bold"
					style={{
						fontFamily: "monospace",
						color: "#58a6ff",
					}}
				>
					Handover
				</h1>

				<p className="text-gray-500 text-sm font-mono">Compiling...</p>
			</div>

			<style>{`
				@keyframes coding-blink {
					0%, 50% { opacity: 1; }
					51%, 100% { opacity: 0; }
				}
			`}</style>
		</div>
	)
}

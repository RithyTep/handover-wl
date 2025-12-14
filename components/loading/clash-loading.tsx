const CLASH_KEYFRAMES = `
	@keyframes clash-spin {
		0% { transform: translate(-50%, -50%) rotate(120deg); }
		100% { transform: translate(-50%, -50%) rotate(720deg); }
	}
	@keyframes clash-sword-disappear {
		0% { opacity: 1; }
		100% { opacity: 0; }
	}
	@keyframes clash-sword-appear {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}
	@keyframes clash-scale-shadow {
		0% { transform: translate(-50%, -50%) scale(1); }
		100% { transform: translate(-50%, -50%) scale(50); }
	}
	@keyframes clash-glow {
		0% { box-shadow: none; }
		50% { box-shadow: 0 0 12px 6px #fdd835; }
		100% { box-shadow: none; }
	}
	@keyframes clash-show-content {
		0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
		50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
		100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
	}
`

function SwordBlade({ color, tipColor }: { color: string; tipColor: string }) {
	return (
		<div
			style={{
				height: "80%",
				width: "75%",
				margin: "0 auto",
				backgroundColor: color === "gradient" ? undefined : color,
				backgroundImage:
					color === "gradient"
						? "linear-gradient(to right, #b0bec5 50%, #cfd8dc 50%)"
						: undefined,
				position: "relative",
				boxShadow: "0 2px 5px rgba(0, 0, 0, 0.35)",
				animation: color !== "gradient" ? "clash-glow 0.5s ease-in-out 0.2s forwards" : undefined,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "-39px",
					left: "0",
					width: "0",
					height: "0",
					borderLeft: "19px solid transparent",
					borderRight: "0 solid transparent",
					borderBottom: `40px solid ${tipColor === "gradient" ? "#b0bec5" : tipColor}`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: "-39px",
					right: "0",
					width: "0",
					height: "0",
					borderLeft: "0 solid transparent",
					borderRight: "19px solid transparent",
					borderBottom: `40px solid ${tipColor === "gradient" ? "#cfd8dc" : tipColor}`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: "100%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					backgroundColor: color === "gradient" ? "#cfd8dc" : color,
					width: "150%",
					height: "6%",
					borderRadius: "10px",
					border: `5px solid ${color === "gradient" ? "#b0bec5" : color}`,
					boxShadow: color === "gradient" ? "0 2px 5px rgba(0, 0, 0, 0.25)" : undefined,
					animation: color !== "gradient" ? "clash-glow 0.5s ease-in-out 0.2s forwards" : undefined,
				}}
			/>
		</div>
	)
}

function SwordHolder({ color, borderColor }: { color: string; borderColor: string }) {
	return (
		<div
			style={{
				margin: "0 auto",
				width: "40%",
				height: "30%",
				backgroundColor: color,
				border: `5px solid ${borderColor}`,
				borderBottomLeftRadius: "8px",
				borderBottomRightRadius: "8px",
				boxShadow: color !== borderColor ? "0 2px 5px rgba(0, 0, 0, 0.35)" : undefined,
				position: "relative",
				animation: color === borderColor ? "clash-glow 0.5s ease-in-out 0.2s forwards" : undefined,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "100%",
					left: "50%",
					transform: "translateX(-50%)",
					width: "125%",
					height: "25%",
					backgroundColor: color,
					border: `5px solid ${borderColor}`,
					borderRadius: "8px",
					boxShadow: color !== borderColor ? "0 2px 5px rgba(0, 0, 0, 0.35)" : undefined,
					animation: color === borderColor ? "clash-glow 0.5s ease-in-out 0.2s forwards" : undefined,
				}}
			/>
		</div>
	)
}

function LoadedContent() {
	return (
		<div
			className="absolute text-center"
			style={{
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				width: "400px",
				maxWidth: "90vw",
				opacity: 0,
				animation: "clash-show-content 0.5s ease-in-out 0.8s forwards",
			}}
		>
			<img
				src="/assets/clash/emblem.png"
				alt="Clash of Clans"
				className="w-32 h-auto mx-auto drop-shadow-2xl mb-4"
				style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}
			/>
			<h1
				className="text-4xl sm:text-5xl font-bold uppercase tracking-wide mb-2"
				style={{
					color: "#fbcc14",
					textShadow:
						"-3px -3px 0 #582e00, 3px -3px 0 #582e00, -3px 3px 0 #582e00, 3px 3px 0 #582e00, 0 5px 0 #3a1a00",
					fontFamily: "'Bungee', 'Supercell Magic', sans-serif",
				}}
			>
				Handover
			</h1>
			<p
				className="text-sm uppercase tracking-widest mb-6"
				style={{ color: "#daa520", textShadow: "1px 1px 0 #582e00" }}
			>
				Clan Task Manager
			</p>
			<div
				className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
				style={{ backgroundColor: "rgba(88, 46, 0, 0.8)", border: "2px solid #daa520" }}
			>
				<div className="flex gap-1">
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className="w-2 h-2 rounded-full animate-bounce"
							style={{ backgroundColor: "#fdd835", animationDelay: `${i * 0.15}s` }}
						/>
					))}
				</div>
				<span
					className="text-sm font-bold uppercase tracking-wider"
					style={{ color: "#fdd835", fontFamily: "'Bungee', sans-serif" }}
				>
					Loading...
				</span>
			</div>
		</div>
	)
}

export function ClashLoading() {
	return (
		<div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#2196f3" }}>
			<style dangerouslySetInnerHTML={{ __html: CLASH_KEYFRAMES }} />

			<div id="sword-container" className="absolute inset-0">
				{/* Main Sword */}
				<div
					className="absolute"
					style={{
						width: "50px",
						height: "200px",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						marginTop: "11px",
						animation:
							"clash-spin 0.3s ease-in-out forwards, clash-sword-disappear 0.3s ease-in-out 0.8s forwards",
					}}
				>
					<SwordBlade color="gradient" tipColor="gradient" />
					<SwordHolder color="#cfd8dc" borderColor="#b0bec5" />
				</div>

				{/* Shadow Sword */}
				<div
					className="absolute"
					style={{
						width: "50px",
						height: "200px",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%) scale(1)",
						marginTop: "11px",
						zIndex: -1,
						opacity: 0,
						animation:
							"clash-sword-appear 0s linear 0.3s forwards, clash-scale-shadow 0.3s ease-in-out 0.7s forwards",
					}}
				>
					<SwordBlade color="#673ab7" tipColor="#673ab7" />
					<SwordHolder color="#673ab7" borderColor="#673ab7" />
				</div>

				<LoadedContent />
			</div>
		</div>
	)
}

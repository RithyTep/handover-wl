"use client";

const EMBERS = [
	{ left: "8%", delay: "0s", duration: "11s", size: 4 },
	{ left: "22%", delay: "3s", duration: "14s", size: 3 },
	{ left: "38%", delay: "6s", duration: "12s", size: 5 },
	{ left: "55%", delay: "1.5s", duration: "13s", size: 3 },
	{ left: "70%", delay: "4.5s", duration: "15s", size: 4 },
	{ left: "84%", delay: "7.5s", duration: "12s", size: 3 },
	{ left: "93%", delay: "2s", duration: "14s", size: 5 },
];

export function PchumBenScene() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{/* Candle embers rising from the festival grounds */}
			{EMBERS.map((ember, i) => (
				<span
					key={i}
					className="pchum-ember"
					style={{
						left: ember.left,
						width: ember.size,
						height: ember.size,
						animationDelay: ember.delay,
						animationDuration: ember.duration,
					}}
				/>
			))}
		</div>
	);
}

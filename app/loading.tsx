export default function Loading() {
	return (
		<div
			className="min-h-screen relative overflow-hidden"
			style={{
				backgroundColor: '#2196f3',
			}}
		>
			{/* CSS Keyframes - using style tag for SSR */}
			<style dangerouslySetInnerHTML={{
				__html: `
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
			}} />

			{/* Sword Container */}
			<div id="sword-container" className="absolute inset-0">
				{/* Main Sword */}
				<div
					className="absolute"
					style={{
						width: '50px',
						height: '200px',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						marginTop: '11px',
						animation: 'clash-spin 0.3s ease-in-out forwards, clash-sword-disappear 0.3s ease-in-out 0.8s forwards',
					}}
				>
					{/* Blade */}
					<div
						style={{
							height: '80%',
							width: '75%',
							margin: '0 auto',
							backgroundImage: 'linear-gradient(to right, #b0bec5 50%, #cfd8dc 50%)',
							position: 'relative',
							boxShadow: '0 2px 5px rgba(0, 0, 0, 0.35)',
						}}
					>
						{/* Blade tip left */}
						<div
							style={{
								position: 'absolute',
								top: '-39px',
								left: '0',
								width: '0',
								height: '0',
								borderLeft: '19px solid transparent',
								borderRight: '0 solid transparent',
								borderBottom: '40px solid #b0bec5',
							}}
						/>
						{/* Blade tip right */}
						<div
							style={{
								position: 'absolute',
								top: '-39px',
								right: '0',
								width: '0',
								height: '0',
								borderLeft: '0 solid transparent',
								borderRight: '19px solid transparent',
								borderBottom: '40px solid #cfd8dc',
							}}
						/>
						{/* Middle guard */}
						<div
							style={{
								position: 'absolute',
								top: '100%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								backgroundColor: '#cfd8dc',
								width: '150%',
								height: '6%',
								borderRadius: '10px',
								border: '5px solid #b0bec5',
								boxShadow: '0 2px 5px rgba(0, 0, 0, 0.25)',
							}}
						/>
					</div>
					{/* Holder */}
					<div
						style={{
							margin: '0 auto',
							width: '40%',
							height: '30%',
							backgroundColor: '#cfd8dc',
							border: '5px solid #b0bec5',
							borderBottomLeftRadius: '8px',
							borderBottomRightRadius: '8px',
							boxShadow: '0 2px 5px rgba(0, 0, 0, 0.35)',
							position: 'relative',
						}}
					>
						{/* Holder end */}
						<div
							style={{
								position: 'absolute',
								top: '100%',
								left: '50%',
								transform: 'translateX(-50%)',
								width: '125%',
								height: '25%',
								backgroundColor: '#cfd8dc',
								border: '5px solid #b0bec5',
								borderRadius: '8px',
								boxShadow: '0 2px 5px rgba(0, 0, 0, 0.35)',
							}}
						/>
					</div>
				</div>

				{/* Shadow Sword (purple glow effect) */}
				<div
					className="absolute"
					style={{
						width: '50px',
						height: '200px',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%) scale(1)',
						marginTop: '11px',
						zIndex: -1,
						opacity: 0,
						animation: 'clash-sword-appear 0s linear 0.3s forwards, clash-scale-shadow 0.3s ease-in-out 0.7s forwards',
					}}
				>
					{/* Blade */}
					<div
						style={{
							height: '80%',
							width: '75%',
							margin: '0 auto',
							backgroundColor: '#673ab7',
							position: 'relative',
							boxShadow: '0 2px 5px rgba(0, 0, 0, 0.35)',
							animation: 'clash-glow 0.5s ease-in-out 0.2s forwards',
						}}
					>
						{/* Blade tip left */}
						<div
							style={{
								position: 'absolute',
								top: '-39px',
								left: '0',
								width: '0',
								height: '0',
								borderLeft: '19px solid transparent',
								borderRight: '0 solid transparent',
								borderBottom: '40px solid #673ab7',
							}}
						/>
						{/* Blade tip right */}
						<div
							style={{
								position: 'absolute',
								top: '-39px',
								right: '0',
								width: '0',
								height: '0',
								borderLeft: '0 solid transparent',
								borderRight: '19px solid transparent',
								borderBottom: '40px solid #673ab7',
							}}
						/>
						{/* Middle guard */}
						<div
							style={{
								position: 'absolute',
								top: '100%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								backgroundColor: '#673ab7',
								width: '150%',
								height: '6%',
								borderRadius: '10px',
								border: '5px solid #673ab7',
								animation: 'clash-glow 0.5s ease-in-out 0.2s forwards',
							}}
						/>
					</div>
					{/* Holder */}
					<div
						style={{
							margin: '0 auto',
							width: '40%',
							height: '30%',
							backgroundColor: '#673ab7',
							border: '5px solid #673ab7',
							borderBottomLeftRadius: '8px',
							borderBottomRightRadius: '8px',
							position: 'relative',
							animation: 'clash-glow 0.5s ease-in-out 0.2s forwards',
						}}
					>
						{/* Holder end */}
						<div
							style={{
								position: 'absolute',
								top: '100%',
								left: '50%',
								transform: 'translateX(-50%)',
								width: '125%',
								height: '25%',
								backgroundColor: '#673ab7',
								border: '5px solid #673ab7',
								borderRadius: '8px',
								animation: 'clash-glow 0.5s ease-in-out 0.2s forwards',
							}}
						/>
					</div>
				</div>

				{/* Loaded Content - Emblem, Title, and Loading */}
				<div
					className="absolute text-center"
					style={{
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '400px',
						maxWidth: '90vw',
						opacity: 0,
						animation: 'clash-show-content 0.5s ease-in-out 0.8s forwards',
					}}
				>
					{/* Clash of Clans Emblem */}
					<img
						src="/assets/clash/emblem.png"
						alt="Clash of Clans"
						className="w-32 h-auto mx-auto drop-shadow-2xl mb-4"
						style={{
							filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
						}}
					/>

					{/* Handover Title */}
					<h1
						className="text-4xl sm:text-5xl font-bold uppercase tracking-wide mb-2"
						style={{
							color: '#fbcc14',
							textShadow: '-3px -3px 0 #582e00, 3px -3px 0 #582e00, -3px 3px 0 #582e00, 3px 3px 0 #582e00, 0 5px 0 #3a1a00',
							fontFamily: "'Bungee', 'Supercell Magic', sans-serif",
						}}
					>
						Handover
					</h1>

					{/* Subtitle */}
					<p
						className="text-sm uppercase tracking-widest mb-6"
						style={{
							color: '#daa520',
							textShadow: '1px 1px 0 #582e00',
						}}
					>
						Clan Task Manager
					</p>

					{/* Loading text */}
					<div
						className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
						style={{
							backgroundColor: 'rgba(88, 46, 0, 0.8)',
							border: '2px solid #daa520',
						}}
					>
						<div className="flex gap-1">
							{[0, 1, 2].map((i) => (
								<div
									key={i}
									className="w-2 h-2 rounded-full animate-bounce"
									style={{
										backgroundColor: '#fdd835',
										animationDelay: `${i * 0.15}s`,
									}}
								/>
							))}
						</div>
						<span
							className="text-sm font-bold uppercase tracking-wider"
							style={{
								color: '#fdd835',
								fontFamily: "'Bungee', sans-serif",
							}}
						>
							Loading...
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

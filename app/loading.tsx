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
      <div className="relative z-10 flex flex-col items-center gap-6 p-8">
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

        <div
          className="relative w-80 max-w-[90vw]"
          style={{
            height: '48px',
          }}
        >
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
        </div>
      </div>
    </div>
  )
}

"use client";

export function CodingScene() {
  return (
    <>
      {/* Technical Background - Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        {/* Syntax Highlight Glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>
    </>
  );
}

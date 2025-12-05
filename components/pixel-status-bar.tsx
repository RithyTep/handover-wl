"use client";

export function PixelStatusBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-950 border-t-2 border-slate-800 p-1 px-4 flex justify-between items-center text-[10px] uppercase text-slate-500 font-bold z-40">
      <div className="flex items-center gap-2">
        <img src="/icons/pixel/gamepad.svg" alt="" className="w-4 h-4" />
        <span>Ready handover-production.up.railway.app</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <img src="/icons/pixel/heart.svg" alt="" className="w-3 h-3" />
          <img src="/icons/pixel/heart.svg" alt="" className="w-3 h-3" />
          <img src="/icons/pixel/heart.svg" alt="" className="w-3 h-3 animate-pulse" />
        </div>
        <div className="flex items-center gap-1">
          <img src="/icons/pixel/coin.svg" alt="" className="w-3 h-3 animate-spin-slow" />
          <span>999</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/icons/pixel/star.svg" alt="" className="w-3 h-3" />
          <span>Pixel Theme</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/icons/pixel/gem.svg" alt="" className="w-3 h-3" />
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/icons/pixel/flag.svg" alt="" className="w-3 h-3" />
          <span>TypeScript</span>
        </div>
      </div>
    </div>
  );
}

"use client";

export function PixelStatusBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-950 border-t-2 border-slate-800 p-1 px-4 flex justify-between items-center text-[10px] uppercase text-slate-500 font-bold z-40">
      <span>Ready handover-production.up.railway.app</span>
      <div className="flex gap-4">
        <span>Pixel Theme</span>
        <span className="">UTF-8</span>
        <span className="">TypeScript</span>
      </div>
    </div>
  );
}

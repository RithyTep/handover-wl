"use client";

import Image from "next/image";

export function PixelStatusBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-950 border-t-2 border-slate-800 p-1 px-4 flex justify-between items-center text-[10px] uppercase text-slate-500 font-bold z-40">
      <div className="flex items-center gap-2">
        <Image
          src="/icons/pixel/gamepad.svg"
          alt=""
          width={12}
          height={12}
          className="opacity-60"
          style={{ imageRendering: "pixelated" }}
        />
        <span>Ready</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Pixel Theme</span>
        <span>UTF-8</span>
        <span>TypeScript</span>
      </div>
    </div>
  );
}

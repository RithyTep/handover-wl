"use client";

import { LunarHongbao } from "./lunar-hongbao";

// Floating lunar decorations configuration
const floatingDecorations = [
  { icon: "lantern", left: "5%", top: "20%", delay: "0s", size: "w-10 h-14" },
  { icon: "plum-blossom", left: "15%", top: "60%", delay: "1.5s", size: "w-8 h-8" },
  { icon: "coin", left: "25%", top: "30%", delay: "3s", size: "w-8 h-8" },
  { icon: "gold-ingot", left: "35%", top: "75%", delay: "0.8s", size: "w-10 h-8" },
  { icon: "fan", left: "55%", top: "25%", delay: "2.2s", size: "w-9 h-9" },
  { icon: "koi", left: "65%", top: "65%", delay: "4s", size: "w-10 h-10" },
  { icon: "drum", left: "75%", top: "35%", delay: "1.2s", size: "w-9 h-9" },
  { icon: "tangerine", left: "85%", top: "55%", delay: "2.8s", size: "w-8 h-8" },
  { icon: "dumpling", left: "45%", top: "80%", delay: "3.5s", size: "w-8 h-8" },
  { icon: "knot", left: "90%", top: "20%", delay: "1s", size: "w-8 h-10" },
];

// Firework positions
const fireworks = [
  { left: "10%", top: "10%", delay: "0s", size: "w-14 h-14" },
  { left: "30%", top: "5%", delay: "1.5s", size: "w-12 h-12" },
  { left: "70%", top: "8%", delay: "3s", size: "w-16 h-16" },
  { left: "85%", top: "12%", delay: "2s", size: "w-10 h-10" },
  { left: "50%", top: "3%", delay: "4s", size: "w-12 h-12" },
];

export function LunarScene() {
  return (
    <>
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Red glow - top left */}
        <div
          className="lunar-glow lunar-glow-red absolute -top-32 -left-32 w-96 h-96"
        />
        {/* Amber glow - bottom right */}
        <div
          className="lunar-glow lunar-glow-amber absolute -bottom-32 -right-32 w-96 h-96"
        />
        {/* Rose glow - center */}
        <div
          className="lunar-glow lunar-glow-rose absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
        />

        {/* Floating decorations */}
        {floatingDecorations.map((item, index) => (
          <img
            key={index}
            src={`/icons/lunar/${item.icon}.svg`}
            alt=""
            className={`absolute lunar-float opacity-40 ${item.size}`}
            style={{
              left: item.left,
              top: item.top,
              animationDelay: item.delay,
            }}
          />
        ))}

        {/* Fireworks */}
        {fireworks.map((fw, index) => (
          <img
            key={`firework-${index}`}
            src="/icons/lunar/firework.svg"
            alt=""
            className={`absolute lunar-firework ${fw.size}`}
            style={{
              left: fw.left,
              top: fw.top,
              animationDelay: fw.delay,
            }}
          />
        ))}

        {/* Dragon at the top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-20 hidden lg:block">
          <img src="/icons/lunar/dragon.svg" alt="" className="w-40 h-32 lunar-dragon" />
        </div>

        {/* Corner lanterns */}
        <div className="absolute top-4 left-4">
          <img src="/icons/lunar/lantern.svg" alt="" className="w-8 h-12 lunar-swing opacity-60" />
        </div>
        <div className="absolute top-4 right-4">
          <img src="/icons/lunar/lantern.svg" alt="" className="w-8 h-12 lunar-swing opacity-60" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Firecracker decorations */}
        <div className="absolute bottom-20 left-6 opacity-30 hidden sm:block">
          <img src="/icons/lunar/firecracker.svg" alt="" className="w-6 h-12" />
        </div>
        <div className="absolute bottom-20 right-6 opacity-30 hidden sm:block">
          <img src="/icons/lunar/firecracker.svg" alt="" className="w-6 h-12" />
        </div>
      </div>

      {/* Floating Hongbao decoration */}
      <LunarHongbao />
    </>
  );
}

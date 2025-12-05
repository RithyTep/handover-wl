"use client";

import { LunarHongbao } from "./lunar-hongbao";

// Minimal elegant floating decorations
const floatingDecorations = [
  { icon: "plum-blossom", left: "8%", top: "25%", delay: "0s", size: "w-6 h-6" },
  { icon: "plum-blossom", left: "45%", top: "15%", delay: "2s", size: "w-5 h-5" },
  { icon: "plum-blossom", left: "78%", top: "35%", delay: "4s", size: "w-6 h-6" },
  { icon: "plum-blossom", left: "92%", top: "60%", delay: "1s", size: "w-5 h-5" },
];

// Subtle fireworks - fewer and smaller
const fireworks = [
  { left: "15%", top: "8%", delay: "0s", size: "w-10 h-10" },
  { left: "75%", top: "5%", delay: "2.5s", size: "w-8 h-8" },
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

        {/* Subtle floating blossoms */}
        {floatingDecorations.map((item, index) => (
          <img
            key={index}
            src={`/icons/lunar/${item.icon}.svg`}
            alt=""
            className={`absolute lunar-float opacity-15 ${item.size}`}
            style={{
              left: item.left,
              top: item.top,
              animationDelay: item.delay,
            }}
          />
        ))}

        {/* Subtle fireworks */}
        {fireworks.map((fw, index) => (
          <img
            key={`firework-${index}`}
            src="/icons/lunar/firework.svg"
            alt=""
            className={`absolute lunar-firework opacity-30 ${fw.size}`}
            style={{
              left: fw.left,
              top: fw.top,
              animationDelay: fw.delay,
            }}
          />
        ))}

        {/* Single elegant lantern */}
        <div className="absolute top-4 right-4 hidden sm:block">
          <img src="/icons/lunar/lantern.svg" alt="" className="w-6 h-10 lunar-swing opacity-30" />
        </div>
      </div>

      {/* Floating Hongbao decoration */}
      <LunarHongbao />
    </>
  );
}

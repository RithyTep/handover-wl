"use client";

import Image from "next/image";
import { LunarHongbao } from "./lunar-hongbao";

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

        {/* Single elegant lantern */}
        <div className="absolute top-4 right-4 hidden sm:block">
          <Image
            src="/icons/lunar/lantern.svg"
            alt=""
            width={24}
            height={40}
            className="w-6 h-10 lunar-swing opacity-30"
          />
        </div>
      </div>

      {/* Floating Hongbao decoration */}
      <LunarHongbao />
    </>
  );
}

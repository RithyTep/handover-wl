"use client"

import Image from "next/image"
import { FLOATING_DECORATIONS } from "./constants"

export function FloatingDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {FLOATING_DECORATIONS.map((deco, index) => (
        <Image
          key={index}
          src={`/icons/christmas/${deco.icon}.svg`}
          alt=""
          width={20}
          height={20}
          className="absolute top-0 christmas-fall w-5 h-5 opacity-20"
          style={{
            left: deco.left,
            animationDelay: deco.delay,
            animationDuration: deco.duration,
          }}
        />
      ))}
    </div>
  )
}

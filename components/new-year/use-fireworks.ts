"use client"

import { useEffect, useCallback } from "react"
import {
  FIREWORK_INTERVAL_MS,
  CANDY_CLEANUP_DELAY_MS,
  CANDY_COUNT,
  CANDY_COLORS,
} from "./constants"

export function useFireworks() {
  const startFireworks = useCallback((x: number, y: number) => {
    const fragment = document.createDocumentFragment()

    for (let i = 0; i < CANDY_COUNT; i++) {
      const candy = document.createElement("div")
      candy.className = "candy"
      candy.style.background = CANDY_COLORS[i % CANDY_COLORS.length]
      const size = Math.random() * 8 + 8
      candy.style.width = `${size}px`
      candy.style.height = `${size}px`
      const angle = (i / CANDY_COUNT) * 2 * Math.PI
      const distance = Math.random() * 60 + 30
      candy.style.setProperty("--x", Math.cos(angle) * distance + "px")
      candy.style.setProperty("--y", Math.sin(angle) * distance + "px")
      candy.style.left = `${x}px`
      candy.style.top = `${y}px`
      fragment.appendChild(candy)
    }

    document.body.appendChild(fragment)
    setTimeout(() => {
      document.querySelectorAll(".candy").forEach((c) => c.remove())
    }, CANDY_CLEANUP_DELAY_MS)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * (window.innerHeight * 0.5)
      startFireworks(x, y)
    }, FIREWORK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [startFireworks])
}

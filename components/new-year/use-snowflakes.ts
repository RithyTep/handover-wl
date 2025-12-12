"use client"

import { useEffect, useRef } from "react"
import { SNOWFLAKE_COUNTS } from "./constants"

export function useSnowflakes() {
  const winterWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = winterWrapperRef.current
    if (!wrapper) return

    const createSnowflakes = (count: number, className: string) => {
      const fragment = document.createDocumentFragment()
      for (let i = 0; i < count; i++) {
        const snowflake = document.createElement("div")
        snowflake.className = `snowflake ${className}`
        snowflake.style.left = Math.random() * 100 + "vw"
        snowflake.style.animationDuration = Math.random() * 15 + 10 + "s"
        snowflake.style.animationDelay = Math.random() * -15 + "s"
        fragment.appendChild(snowflake)
      }
      wrapper.appendChild(fragment)
    }

    createSnowflakes(SNOWFLAKE_COUNTS.small, "_sm")
    createSnowflakes(SNOWFLAKE_COUNTS.medium, "_md")
    createSnowflakes(SNOWFLAKE_COUNTS.large, "_lg")

    return () => {
      if (wrapper) wrapper.innerHTML = ""
    }
  }, [])

  return winterWrapperRef
}

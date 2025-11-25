"use client"

import * as React from "react"

interface ChristmasLoadingProps {
  className?: string
}

export function ChristmasLoading({ className = "" }: ChristmasLoadingProps) {
  return (
    <div className={`flex items-center justify-center min-h-screen w-full ${className}`}>
      <img
        src="/Tenor-unscreen.gif"
        alt="Loading..."
        className="w-24 h-24 object-contain"
      />
    </div>
  )
}

"use client"

import * as React from "react"

interface ChristmasLoadingProps {
  className?: string
}

export function ChristmasLoading({ className = "" }: ChristmasLoadingProps) {
  return (
    <div className={`christmas-loader ${className}`}>
      {/* Floating snow particles */}
      <div className="snow-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="snow-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Main candy cane */}
      <div className="candy-cane-realistic">
        {/* The curved hook */}
        <div className="candy-hook-3d">
          <div className="candy-hook-outer"></div>
          <div className="candy-hook-shine"></div>
        </div>

        {/* The straight stem */}
        <div className="candy-stem-3d">
          <div className="candy-stripe-wrapper">
            <div className="candy-stripes"></div>
          </div>
          <div className="candy-shine"></div>
          <div className="candy-shadow"></div>
        </div>

        {/* Sparkles */}
        <div className="candy-sparkle-3d" style={{ top: '15%', left: '10%' }}></div>
        <div className="candy-sparkle-3d" style={{ top: '45%', right: '5%' }}></div>
        <div className="candy-sparkle-3d" style={{ top: '75%', left: '15%' }}></div>
        <div className="candy-sparkle-3d" style={{ top: '30%', right: '15%' }}></div>
      </div>

      {/* Christmas ornaments */}
      <div className="ornament ornament-1"></div>
      <div className="ornament ornament-2"></div>
      <div className="ornament ornament-3"></div>

      {/* Loading text */}
      <div className="loading-text-wrapper">
        <span className="loading-letter" style={{ animationDelay: '0s' }}>L</span>
        <span className="loading-letter" style={{ animationDelay: '0.1s' }}>o</span>
        <span className="loading-letter" style={{ animationDelay: '0.2s' }}>a</span>
        <span className="loading-letter" style={{ animationDelay: '0.3s' }}>d</span>
        <span className="loading-letter" style={{ animationDelay: '0.4s' }}>i</span>
        <span className="loading-letter" style={{ animationDelay: '0.5s' }}>n</span>
        <span className="loading-letter" style={{ animationDelay: '0.6s' }}>g</span>
        <span className="loading-dots">
          <span style={{ animationDelay: '0s' }}>.</span>
          <span style={{ animationDelay: '0.2s' }}>.</span>
          <span style={{ animationDelay: '0.4s' }}>.</span>
        </span>
      </div>
    </div>
  )
}

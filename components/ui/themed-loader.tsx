"use client";

import { cn } from "@/lib/utils";
import { Theme } from "@/enums/theme.enum";

interface ThemedLoaderProps {
  theme: Theme;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ThemedLoader({ theme, size = "md", className }: ThemedLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  // Christmas theme - Snowflake spinner
  if (theme === Theme.CHRISTMAS) {
    return (
      <div className={cn("christmas-loader", sizeClasses[size], className)}>
        <svg viewBox="0 0 24 24" fill="none" className="animate-spin">
          <path
            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-white"
          />
        </svg>
      </div>
    );
  }

  // Pixel theme - Pixelated loading bar
  if (theme === Theme.PIXEL) {
    return (
      <div className={cn("pixel-loader flex gap-1", className)}>
        <div className={cn("pixel-loader-dot bg-indigo-500", size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4")} style={{ animationDelay: "0s" }} />
        <div className={cn("pixel-loader-dot bg-indigo-400", size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4")} style={{ animationDelay: "0.15s" }} />
        <div className={cn("pixel-loader-dot bg-indigo-300", size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4")} style={{ animationDelay: "0.3s" }} />
      </div>
    );
  }

  // Lunar theme - Lantern glow
  if (theme === Theme.LUNAR) {
    return (
      <div className={cn("lunar-loader relative", sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
        <div className="absolute inset-1 rounded-full bg-amber-500/50 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-red-400/70" />
      </div>
    );
  }

  // Coding theme - Terminal loading
  if (theme === Theme.CODING) {
    return (
      <div className={cn("coding-loader font-mono text-green-500/70", className)}>
        <span className="coding-loader-bracket">[</span>
        <span className="coding-loader-bar" />
        <span className="coding-loader-bracket">]</span>
      </div>
    );
  }

  // Default theme - Professional bank style spinner
  return (
    <div className={cn("default-loader", sizeClasses[size], className)}>
      <svg viewBox="0 0 24 24" fill="none" className="animate-spin" style={{ animationDuration: '1s' }}>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#e2e8f0"
          strokeWidth="2.5"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="45 63"
        />
      </svg>
    </div>
  );
}

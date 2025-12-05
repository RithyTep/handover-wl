"use client";

import * as React from "react";
import { Theme } from "@/enums/theme.enum";
import { useThemeStore } from "@/lib/stores/theme-store";
import { DEFAULT_THEME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ThemedLoadingScreenProps {
  className?: string;
  theme?: Theme;
}

export function ThemedLoadingScreen({ className = "", theme: themeProp }: ThemedLoadingScreenProps) {
  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const theme: Theme = themeProp ?? selectedTheme ?? DEFAULT_THEME;

  // Christmas theme - GIF with festive styling
  if (theme === Theme.CHRISTMAS) {
    return (
      <div className={cn("flex items-center justify-center min-h-screen w-full", className)}>
        <div className="text-center">
          <img
            src="/Tenor-unscreen.gif"
            alt="Loading..."
            className="w-24 h-24 object-contain mx-auto"
          />
          <p className="mt-4 text-white/80 text-sm animate-pulse">Loading festive dashboard...</p>
        </div>
      </div>
    );
  }

  // Pixel theme - Retro loading bar
  if (theme === Theme.PIXEL) {
    return (
      <div className={cn("flex items-center justify-center min-h-screen w-full", className)}>
        <div className="text-center">
          <div className="flex gap-2 justify-center mb-4">
            <div className="w-4 h-4 bg-indigo-500 pixel-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-4 h-4 bg-purple-500 pixel-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-4 h-4 bg-pink-500 pixel-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-4 h-4 bg-indigo-500 pixel-bounce" style={{ animationDelay: "0.3s" }} />
          </div>
          <div className="w-48 h-3 bg-slate-800 border-2 border-slate-600 mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pixel-load-bar" />
          </div>
          <p className="mt-4 text-slate-400 font-mono text-xs">LOADING...</p>
        </div>
      </div>
    );
  }

  // Lunar theme - Lantern glow
  if (theme === Theme.LUNAR) {
    return (
      <div className={cn("flex items-center justify-center min-h-screen w-full", className)}>
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-amber-500/50 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-red-400/70" />
          </div>
          <p className="text-amber-200/80 text-sm">迎春接福...</p>
        </div>
      </div>
    );
  }

  // Coding theme - Terminal loading
  if (theme === Theme.CODING) {
    return (
      <div className={cn("flex items-center justify-center min-h-screen w-full", className)}>
        <div className="text-center font-mono">
          <div className="text-green-500/80 text-sm mb-2">$ loading dashboard</div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-green-500/60">[</span>
            <div className="w-32 h-2 bg-slate-800 overflow-hidden rounded-sm">
              <div className="h-full bg-gradient-to-r from-green-600 to-green-400 coding-load-bar" />
            </div>
            <span className="text-green-500/60">]</span>
          </div>
          <div className="text-green-500/50 text-xs mt-2 flex items-center justify-center">
            <span className="inline-block w-2 h-4 bg-green-500/70 animate-pulse mr-1" />
            initializing...
          </div>
        </div>
      </div>
    );
  }

  // Default theme - Simple clean spinner
  return (
    <div className={cn("flex items-center justify-center min-h-screen w-full", className)}>
      <div className="text-center">
        <svg className="w-12 h-12 mx-auto animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-muted opacity-25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-foreground"
          />
        </svg>
        <p className="mt-4 text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

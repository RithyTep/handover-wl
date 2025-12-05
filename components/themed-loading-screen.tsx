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

// Christmas floating decorations
const christmasDecorations = [
  { icon: "snowflake", delay: "0s", duration: "6s", left: "10%", size: "w-8 h-8" },
  { icon: "ornament", delay: "1s", duration: "7s", left: "25%", size: "w-10 h-10" },
  { icon: "star", delay: "0.5s", duration: "5s", left: "40%", size: "w-6 h-6" },
  { icon: "bell", delay: "2s", duration: "8s", left: "55%", size: "w-8 h-8" },
  { icon: "candy-cane", delay: "1.5s", duration: "6s", left: "70%", size: "w-7 h-7" },
  { icon: "holly", delay: "0.8s", duration: "7s", left: "85%", size: "w-9 h-9" },
  { icon: "gift", delay: "2.5s", duration: "9s", left: "15%", size: "w-10 h-10" },
  { icon: "gingerbread", delay: "1.2s", duration: "6s", left: "60%", size: "w-8 h-8" },
  { icon: "stocking", delay: "3s", duration: "7s", left: "80%", size: "w-7 h-7" },
  { icon: "wreath", delay: "0.3s", duration: "8s", left: "35%", size: "w-9 h-9" },
];

// Pixel floating elements
const pixelElements = [
  { icon: "coin", delay: "0s", left: "8%", animation: "pixel-float-1" },
  { icon: "heart", delay: "0.5s", left: "20%", animation: "pixel-float-2" },
  { icon: "gem", delay: "1s", left: "32%", animation: "pixel-float-3" },
  { icon: "star", delay: "0.3s", left: "45%", animation: "pixel-float-1" },
  { icon: "mushroom", delay: "1.5s", left: "58%", animation: "pixel-float-2" },
  { icon: "key", delay: "0.8s", left: "70%", animation: "pixel-float-3" },
  { icon: "potion", delay: "2s", left: "82%", animation: "pixel-float-1" },
  { icon: "crown", delay: "1.2s", left: "92%", animation: "pixel-float-2" },
];

// Lunar floating decorations
const lunarDecorations = [
  { icon: "lantern", delay: "0s", left: "5%", size: "w-12 h-16" },
  { icon: "firecracker", delay: "0.8s", left: "18%", size: "w-8 h-12" },
  { icon: "red-envelope", delay: "1.5s", left: "30%", size: "w-10 h-10" },
  { icon: "gold-ingot", delay: "0.5s", left: "42%", size: "w-10 h-8" },
  { icon: "plum-blossom", delay: "2s", left: "55%", size: "w-8 h-8" },
  { icon: "coin", delay: "1s", left: "68%", size: "w-8 h-8" },
  { icon: "fan", delay: "1.8s", left: "78%", size: "w-10 h-10" },
  { icon: "knot", delay: "0.3s", left: "90%", size: "w-10 h-12" },
];

// Coding floating icons
const codingIcons = [
  { icon: "git-branch", delay: "0s", left: "5%", opacity: "0.4" },
  { icon: "database", delay: "0.5s", left: "15%", opacity: "0.3" },
  { icon: "server", delay: "1s", left: "25%", opacity: "0.5" },
  { icon: "api", delay: "0.3s", left: "38%", opacity: "0.4" },
  { icon: "bug", delay: "1.5s", left: "50%", opacity: "0.3" },
  { icon: "commit", delay: "0.8s", left: "62%", opacity: "0.5" },
  { icon: "merge", delay: "2s", left: "72%", opacity: "0.4" },
  { icon: "deploy", delay: "1.2s", left: "82%", opacity: "0.3" },
  { icon: "function", delay: "0.6s", left: "92%", opacity: "0.5" },
];

export function ThemedLoadingScreen({ className = "", theme: themeProp }: ThemedLoadingScreenProps) {
  const selectedTheme = useThemeStore((state) => state.selectedTheme);
  const theme: Theme = themeProp ?? selectedTheme ?? DEFAULT_THEME;

  // Christmas theme - Winter wonderland with floating decorations
  if (theme === Theme.CHRISTMAS) {
    return (
      <div className={cn("relative flex items-center justify-center min-h-screen w-full overflow-hidden", className)}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-green-950 to-red-950" />

        {/* Snowfall effect background */}
        <div className="absolute inset-0 christmas-snowfall opacity-30" />

        {/* Floating decorations */}
        {christmasDecorations.map((deco, index) => (
          <img
            key={index}
            src={`/icons/christmas/${deco.icon}.svg`}
            alt=""
            className={cn("absolute top-0 christmas-fall", deco.size)}
            style={{
              left: deco.left,
              animationDelay: deco.delay,
              animationDuration: deco.duration,
            }}
          />
        ))}

        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Tree with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-green-500/30 rounded-full scale-150" />
            <img
              src="/icons/christmas/tree.svg"
              alt="Christmas Tree"
              className="relative w-32 h-32 object-contain mx-auto animate-pulse"
            />
          </div>

          {/* Rotating decorations around tree */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48 christmas-orbit">
              <img src="/icons/christmas/santa.svg" alt="" className="absolute w-10 h-10 -top-2 left-1/2 -translate-x-1/2" />
              <img src="/icons/christmas/reindeer.svg" alt="" className="absolute w-10 h-10 top-1/2 -right-2 -translate-y-1/2" />
              <img src="/icons/christmas/sleigh.svg" alt="" className="absolute w-12 h-8 -bottom-2 left-1/2 -translate-x-1/2" />
              <img src="/icons/christmas/gift.svg" alt="" className="absolute w-10 h-10 top-1/2 -left-2 -translate-y-1/2" />
            </div>
          </div>

          {/* Loading indicator */}
          <div className="mt-8">
            <img
              src="/icons/christmas/loading.svg"
              alt="Loading..."
              className="w-12 h-12 object-contain mx-auto animate-spin-slow"
            />
          </div>

          {/* Text with icons */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <img src="/icons/christmas/star.svg" alt="" className="w-4 h-4 animate-pulse" />
            <p className="text-white/80 text-sm">Loading festive dashboard...</p>
            <img src="/icons/christmas/star.svg" alt="" className="w-4 h-4 animate-pulse" />
          </div>

          {/* Bottom decorations */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <img src="/icons/christmas/candy-cane.svg" alt="" className="w-6 h-6 animate-bounce" style={{ animationDelay: "0s" }} />
            <img src="/icons/christmas/ornament.svg" alt="" className="w-6 h-6 animate-bounce" style={{ animationDelay: "0.2s" }} />
            <img src="/icons/christmas/bell.svg" alt="" className="w-6 h-6 animate-bounce" style={{ animationDelay: "0.4s" }} />
            <img src="/icons/christmas/holly.svg" alt="" className="w-6 h-6 animate-bounce" style={{ animationDelay: "0.6s" }} />
            <img src="/icons/christmas/gingerbread.svg" alt="" className="w-6 h-6 animate-bounce" style={{ animationDelay: "0.8s" }} />
          </div>
        </div>
      </div>
    );
  }

  // Pixel theme - Retro game loading screen
  if (theme === Theme.PIXEL) {
    return (
      <div className={cn("relative flex items-center justify-center min-h-screen w-full overflow-hidden", className)}>
        {/* Retro grid background */}
        <div className="absolute inset-0 bg-slate-900 pixel-grid" />

        {/* Floating pixel elements */}
        {pixelElements.map((elem, index) => (
          <img
            key={index}
            src={`/icons/pixel/${elem.icon}.svg`}
            alt=""
            className={cn("absolute w-8 h-8", elem.animation)}
            style={{
              left: elem.left,
              top: "10%",
              animationDelay: elem.delay,
            }}
          />
        ))}

        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Game title style */}
          <div className="mb-8 pixel-text-shadow">
            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400">
              LOADING
            </span>
          </div>

          {/* Central game character area */}
          <div className="relative mb-8">
            {/* Gamepad with glow */}
            <div className="relative inline-block">
              <div className="absolute inset-0 blur-lg bg-purple-500/50 rounded-lg scale-125" />
              <img
                src="/icons/pixel/gamepad.svg"
                alt="Gamepad"
                className="relative w-24 h-24 object-contain mx-auto pixel-bounce"
              />
            </div>

            {/* Orbiting items */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-40 h-40 pixel-orbit">
                <img src="/icons/pixel/sword.svg" alt="" className="absolute w-8 h-8 -top-4 left-1/2 -translate-x-1/2" />
                <img src="/icons/pixel/shield.svg" alt="" className="absolute w-8 h-8 top-1/2 -right-4 -translate-y-1/2" />
                <img src="/icons/pixel/chest.svg" alt="" className="absolute w-8 h-8 -bottom-4 left-1/2 -translate-x-1/2" />
                <img src="/icons/pixel/ghost.svg" alt="" className="absolute w-8 h-8 top-1/2 -left-4 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Retro loading bar */}
          <div className="w-64 mx-auto mb-4">
            <div className="flex items-center gap-2 mb-2">
              <img src="/icons/pixel/heart.svg" alt="" className="w-5 h-5" />
              <img src="/icons/pixel/heart.svg" alt="" className="w-5 h-5" />
              <img src="/icons/pixel/heart.svg" alt="" className="w-5 h-5 animate-pulse" />
              <span className="ml-auto text-pink-400 font-mono text-xs">LIVES: 3</span>
            </div>
            <div className="h-6 bg-slate-800 border-4 border-slate-600 overflow-hidden pixel-border">
              <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-green-500 pixel-load-bar" />
            </div>
          </div>

          {/* Score display */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <img src="/icons/pixel/coin.svg" alt="" className="w-5 h-5 animate-spin-slow" />
              <span className="text-yellow-400 font-mono text-sm">x 999</span>
            </div>
            <div className="flex items-center gap-1">
              <img src="/icons/pixel/gem.svg" alt="" className="w-5 h-5 animate-pulse" />
              <span className="text-cyan-400 font-mono text-sm">x 42</span>
            </div>
            <div className="flex items-center gap-1">
              <img src="/icons/pixel/star.svg" alt="" className="w-5 h-5 animate-bounce" />
              <span className="text-purple-400 font-mono text-sm">x 7</span>
            </div>
          </div>

          {/* Loading text */}
          <p className="text-slate-400 font-mono text-xs tracking-[0.3em] pixel-blink">
            PRESS START TO CONTINUE
          </p>

          {/* Bottom power-ups */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <img src="/icons/pixel/mushroom.svg" alt="" className="w-6 h-6 pixel-pop" style={{ animationDelay: "0s" }} />
            <img src="/icons/pixel/potion.svg" alt="" className="w-6 h-6 pixel-pop" style={{ animationDelay: "0.1s" }} />
            <img src="/icons/pixel/key.svg" alt="" className="w-6 h-6 pixel-pop" style={{ animationDelay: "0.2s" }} />
            <img src="/icons/pixel/flag.svg" alt="" className="w-6 h-6 pixel-pop" style={{ animationDelay: "0.3s" }} />
            <img src="/icons/pixel/crown.svg" alt="" className="w-6 h-6 pixel-pop" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    );
  }

  // Lunar theme - Chinese New Year celebration
  if (theme === Theme.LUNAR) {
    return (
      <div className={cn("relative flex items-center justify-center min-h-screen w-full overflow-hidden", className)}>
        {/* Rich red background with pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-900 via-red-800 to-red-950" />
        <div className="absolute inset-0 lunar-pattern opacity-10" />

        {/* Floating decorations */}
        {lunarDecorations.map((deco, index) => (
          <img
            key={index}
            src={`/icons/lunar/${deco.icon}.svg`}
            alt=""
            className={cn("absolute lunar-float", deco.size)}
            style={{
              left: deco.left,
              top: `${10 + (index % 3) * 15}%`,
              animationDelay: deco.delay,
            }}
          />
        ))}

        {/* Firework effects */}
        <div className="absolute top-10 left-10">
          <img src="/icons/lunar/firework.svg" alt="" className="w-16 h-16 lunar-firework" style={{ animationDelay: "0s" }} />
        </div>
        <div className="absolute top-20 right-16">
          <img src="/icons/lunar/firework.svg" alt="" className="w-12 h-12 lunar-firework" style={{ animationDelay: "1s" }} />
        </div>
        <div className="absolute top-8 right-1/3">
          <img src="/icons/lunar/firework.svg" alt="" className="w-14 h-14 lunar-firework" style={{ animationDelay: "2s" }} />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Dragon header */}
          <div className="relative mb-6">
            <div className="absolute inset-0 blur-2xl bg-yellow-500/30 rounded-full scale-150" />
            <img
              src="/icons/lunar/dragon.svg"
              alt="Dragon"
              className="relative w-40 h-32 object-contain mx-auto lunar-dragon"
            />
          </div>

          {/* Decorative lanterns */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <img src="/icons/lunar/lantern.svg" alt="" className="w-12 h-16 lunar-swing" style={{ animationDelay: "0s" }} />
            <img src="/icons/lunar/lantern.svg" alt="" className="w-16 h-20 lunar-swing" style={{ animationDelay: "0.3s" }} />
            <img src="/icons/lunar/lantern.svg" alt="" className="w-12 h-16 lunar-swing" style={{ animationDelay: "0.6s" }} />
          </div>

          {/* Main loading animation */}
          <div className="relative mb-6">
            <img
              src="/icons/lunar/loading.svg"
              alt="Loading..."
              className="w-16 h-16 object-contain mx-auto animate-spin-slow"
            />
          </div>

          {/* Chinese text with decorations */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/icons/lunar/plum-blossom.svg" alt="" className="w-6 h-6 animate-pulse" />
            <p className="text-amber-200 text-lg font-medium">恭喜發財</p>
            <img src="/icons/lunar/plum-blossom.svg" alt="" className="w-6 h-6 animate-pulse" />
          </div>

          <p className="text-amber-200/70 text-sm mb-6">迎春接福 Loading...</p>

          {/* Fortune items */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex flex-col items-center">
              <img src="/icons/lunar/red-envelope.svg" alt="" className="w-10 h-10 animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="text-amber-300/60 text-xs mt-1">紅包</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/lunar/gold-ingot.svg" alt="" className="w-10 h-8 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="text-amber-300/60 text-xs mt-1">元寶</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/lunar/coin.svg" alt="" className="w-10 h-10 animate-bounce" style={{ animationDelay: "0.4s" }} />
              <span className="text-amber-300/60 text-xs mt-1">金幣</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/lunar/tangerine.svg" alt="" className="w-10 h-10 animate-bounce" style={{ animationDelay: "0.6s" }} />
              <span className="text-amber-300/60 text-xs mt-1">大吉</span>
            </div>
          </div>

          {/* Bottom decorations */}
          <div className="flex items-center justify-center gap-4">
            <img src="/icons/lunar/koi.svg" alt="" className="w-8 h-8 lunar-swim" />
            <img src="/icons/lunar/drum.svg" alt="" className="w-8 h-8 animate-pulse" />
            <img src="/icons/lunar/fan.svg" alt="" className="w-8 h-8 lunar-fan" />
            <img src="/icons/lunar/dumpling.svg" alt="" className="w-8 h-8 animate-bounce" />
            <img src="/icons/lunar/koi.svg" alt="" className="w-8 h-8 lunar-swim" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>
      </div>
    );
  }

  // Coding theme - Developer terminal experience
  if (theme === Theme.CODING) {
    return (
      <div className={cn("relative flex items-center justify-center min-h-screen w-full overflow-hidden", className)}>
        {/* Dark coding background with grid */}
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 coding-grid opacity-20" />

        {/* Floating code icons */}
        {codingIcons.map((icon, index) => (
          <img
            key={index}
            src={`/icons/coding/${icon.icon}.svg`}
            alt=""
            className="absolute w-10 h-10 coding-float"
            style={{
              left: icon.left,
              top: `${15 + (index % 4) * 20}%`,
              opacity: icon.opacity,
              animationDelay: icon.delay,
            }}
          />
        ))}

        {/* Main content - Terminal window */}
        <div className="relative z-10 w-full max-w-lg mx-4">
          {/* Terminal header */}
          <div className="bg-zinc-800 rounded-t-lg px-4 py-2 flex items-center gap-2 border-b border-zinc-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-zinc-400 text-xs font-mono">terminal — zsh</span>
            </div>
            <img src="/icons/coding/terminal.svg" alt="" className="w-4 h-4 opacity-50" />
          </div>

          {/* Terminal body */}
          <div className="bg-zinc-900/95 rounded-b-lg p-4 font-mono text-sm border border-t-0 border-zinc-800">
            {/* Command lines */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-green-500">➜</span>
                <span className="text-cyan-400">~/project</span>
                <span className="text-zinc-500">git:(</span>
                <span className="text-red-400">main</span>
                <span className="text-zinc-500">)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-yellow-500">$</span>
                <span>npm run dev</span>
                <img src="/icons/coding/console.svg" alt="" className="w-4 h-4 ml-2 opacity-50" />
              </div>
            </div>

            {/* Status icons row */}
            <div className="flex items-center gap-3 mb-4 py-2 border-y border-zinc-800">
              <div className="flex items-center gap-1">
                <img src="/icons/coding/git-branch.svg" alt="" className="w-4 h-4" />
                <span className="text-zinc-500 text-xs">main</span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/icons/coding/commit.svg" alt="" className="w-4 h-4" />
                <span className="text-zinc-500 text-xs">c886cfd</span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/icons/coding/database.svg" alt="" className="w-4 h-4" />
                <span className="text-green-500 text-xs">●</span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/icons/coding/server.svg" alt="" className="w-4 h-4" />
                <span className="text-green-500 text-xs">●</span>
              </div>
            </div>

            {/* Loading animation section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <img src="/icons/coding/code-brackets.svg" alt="" className="w-4 h-4" />
                <span>Compiling modules...</span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">[</span>
                <div className="flex-1 h-2 bg-zinc-800 rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 coding-load-bar" />
                </div>
                <span className="text-zinc-600">]</span>
                <span className="text-indigo-400 text-xs w-12 text-right">87%</span>
              </div>
            </div>

            {/* Module status */}
            <div className="space-y-1 text-xs mb-4">
              <div className="flex items-center gap-2">
                <img src="/icons/coding/function.svg" alt="" className="w-3 h-3" />
                <span className="text-green-500">✓</span>
                <span className="text-zinc-500">Loaded: components/ui</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/icons/coding/api.svg" alt="" className="w-3 h-3" />
                <span className="text-green-500">✓</span>
                <span className="text-zinc-500">Loaded: lib/api</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/icons/coding/variable.svg" alt="" className="w-3 h-3" />
                <span className="text-green-500">✓</span>
                <span className="text-zinc-500">Loaded: stores/theme</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/icons/coding/deploy.svg" alt="" className="w-3 h-3 animate-pulse" />
                <span className="text-yellow-500 animate-pulse">⟳</span>
                <span className="text-zinc-400">Building: app/dashboard</span>
              </div>
            </div>

            {/* Blinking cursor line */}
            <div className="flex items-center gap-2">
              <span className="text-green-500">➜</span>
              <span className="text-cyan-400">~/project</span>
              <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse" />
            </div>
          </div>

          {/* Status bar */}
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/icons/coding/bug.svg" alt="" className="w-5 h-5" />
              <span className="text-zinc-500 text-xs">0 errors</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/icons/coding/merge.svg" alt="" className="w-5 h-5" />
              <span className="text-zinc-500 text-xs">Ready to merge</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/icons/coding/pull-request.svg" alt="" className="w-5 h-5" />
              <span className="text-zinc-500 text-xs">PR #42</span>
            </div>
          </div>

          {/* Bottom icons */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <img src="/icons/coding/keyboard.svg" alt="" className="w-6 h-6 opacity-30 hover:opacity-60 transition-opacity" />
            <img src="/icons/coding/cloud.svg" alt="" className="w-6 h-6 opacity-30 hover:opacity-60 transition-opacity" />
            <img src="/icons/coding/lock.svg" alt="" className="w-6 h-6 opacity-30 hover:opacity-60 transition-opacity" />
            <img src="/icons/coding/cpu.svg" alt="" className="w-6 h-6 opacity-30 hover:opacity-60 transition-opacity" />
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

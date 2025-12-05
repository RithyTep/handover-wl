"use client";

import { CheckCircle, GitBranch } from "lucide-react";

export function CodingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-[#09090b] px-6 py-2 flex items-center justify-between text-[10px] text-zinc-500 font-medium font-mono z-10">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-3 h-3 text-emerald-500" />
        <span className="text-zinc-400">Build Passing</span>
        <span className="text-zinc-600 mx-1">|</span>
        <GitBranch className="w-3 h-3 text-indigo-500" />
        <span className="text-zinc-400">main</span>
      </div>
      <div className="flex gap-4">
        <span className="hover:text-zinc-300 cursor-pointer hidden sm:inline">Ln 142, Col 40</span>
        <span className="hover:text-zinc-300 cursor-pointer hidden sm:inline">UTF-8</span>
        <span className="hover:text-zinc-300 cursor-pointer hidden sm:inline">TypeScript</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Online</span>
        </div>
      </div>
    </footer>
  );
}

"use client";

export function CodingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-[#09090b] px-6 py-2 flex items-center justify-between text-[10px] text-zinc-500 font-medium font-mono z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img src="/icons/coding/deploy.svg" alt="" className="w-3 h-3" />
          <span className="text-emerald-500">Build Passing</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/icons/coding/git-branch.svg" alt="" className="w-3 h-3" />
          <span className="text-zinc-400">main</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/icons/coding/commit.svg" alt="" className="w-3 h-3" />
          <span className="text-zinc-400">c886cfd</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/icons/coding/merge.svg" alt="" className="w-3 h-3" />
          <span className="text-zinc-400">0 PRs</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <img src="/icons/coding/code-brackets.svg" alt="" className="w-3 h-3" />
          <span className="hover:text-zinc-300 cursor-pointer">Ln 142, Col 40</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <img src="/icons/coding/variable.svg" alt="" className="w-3 h-3" />
          <span className="hover:text-zinc-300 cursor-pointer">UTF-8</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <img src="/icons/coding/function.svg" alt="" className="w-3 h-3" />
          <span className="hover:text-zinc-300 cursor-pointer">TypeScript</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/icons/coding/database.svg" alt="" className="w-3 h-3" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>DB</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/icons/coding/server.svg" alt="" className="w-3 h-3" />
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Online</span>
        </div>
      </div>
    </footer>
  );
}

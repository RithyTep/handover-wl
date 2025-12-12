"use client";

export function LunarHongbao() {
  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
      <div className="lunar-hongbao w-16 h-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-red-600 to-red-700 rounded-lg shadow-lg">
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-inner">
            <span className="text-red-700 text-xs font-bold">福</span>
          </div>

          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-red-500 to-red-600 rounded-t-lg border-b border-red-800/30" />
        </div>

        <div className="absolute -inset-2 bg-red-500/20 rounded-xl blur-xl -z-10" />
      </div>
    </div>
  );
}

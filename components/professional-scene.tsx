"use client";

export function ProfessionalScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900" />

      {/* Professional grid pattern - subtle on dark */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #60a5fa 1px, transparent 1px),
            linear-gradient(to bottom, #60a5fa 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Soft accent glows - corporate blue on dark */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/[0.08] rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-indigo-500/[0.06] rounded-full blur-[100px]" />

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </div>
  );
}

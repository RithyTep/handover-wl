"use client";

export function ProfessionalScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />

      {/* Professional grid pattern - very subtle */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1e3a5f 1px, transparent 1px),
            linear-gradient(to bottom, #1e3a5f 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Soft accent glows - corporate blue */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-indigo-600/[0.02] rounded-full blur-[100px]" />

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent" />
    </div>
  );
}

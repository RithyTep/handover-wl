"use client";

const floatingIcons = [
  { icon: "git-branch", left: "8%", top: "20%", delay: "0s", duration: "18s" },
  { icon: "commit", left: "85%", top: "30%", delay: "3s", duration: "20s" },
  { icon: "function", left: "45%", top: "75%", delay: "6s", duration: "16s" },
];

export function CodingScene() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/3 blur-[150px] rounded-full" />

        {floatingIcons.map((item, index) => (
          <img
            key={index}
            src={`/icons/coding/${item.icon}.svg`}
            alt=""
            className="absolute w-6 h-6 coding-float opacity-10"
            style={{
              left: item.left,
              top: item.top,
              animationDelay: item.delay,
              animationDuration: item.duration,
            }}
          />
        ))}
      </div>
    </>
  );
}

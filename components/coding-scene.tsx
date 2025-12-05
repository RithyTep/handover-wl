"use client";

// Floating coding icons configuration
const floatingIcons = [
  { icon: "git-branch", left: "5%", top: "15%", delay: "0s", duration: "12s" },
  { icon: "database", left: "15%", top: "60%", delay: "2s", duration: "14s" },
  { icon: "server", left: "25%", top: "25%", delay: "4s", duration: "10s" },
  { icon: "api", left: "35%", top: "70%", delay: "1s", duration: "13s" },
  { icon: "bug", left: "55%", top: "20%", delay: "3s", duration: "11s" },
  { icon: "commit", left: "65%", top: "65%", delay: "5s", duration: "15s" },
  { icon: "merge", left: "75%", top: "30%", delay: "2.5s", duration: "12s" },
  { icon: "deploy", left: "85%", top: "55%", delay: "1.5s", duration: "14s" },
  { icon: "function", left: "45%", top: "80%", delay: "3.5s", duration: "11s" },
  { icon: "pull-request", left: "90%", top: "15%", delay: "4.5s", duration: "13s" },
  { icon: "cloud", left: "10%", top: "85%", delay: "0.5s", duration: "16s" },
  { icon: "lock", left: "50%", top: "10%", delay: "2.2s", duration: "12s" },
  { icon: "cpu", left: "80%", top: "75%", delay: "3.8s", duration: "14s" },
];

export function CodingScene() {
  return (
    <>
      {/* Technical Background - Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        {/* Syntax Highlight Glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/3 blur-[150px] rounded-full" />

        {/* Floating coding icons */}
        {floatingIcons.map((item, index) => (
          <img
            key={index}
            src={`/icons/coding/${item.icon}.svg`}
            alt=""
            className="absolute w-8 h-8 coding-float opacity-20"
            style={{
              left: item.left,
              top: item.top,
              animationDelay: item.delay,
              animationDuration: item.duration,
            }}
          />
        ))}

        {/* Terminal icon decorations in corners */}
        <div className="absolute top-6 left-6 opacity-10">
          <img src="/icons/coding/terminal.svg" alt="" className="w-12 h-12" />
        </div>
        <div className="absolute bottom-20 right-6 opacity-10">
          <img src="/icons/coding/console.svg" alt="" className="w-10 h-10" />
        </div>

        {/* Keyboard decoration */}
        <div className="absolute bottom-24 left-1/4 opacity-10 hidden lg:block">
          <img src="/icons/coding/keyboard.svg" alt="" className="w-16 h-10" />
        </div>
      </div>
    </>
  );
}

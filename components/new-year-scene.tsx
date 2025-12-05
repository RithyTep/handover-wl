"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Floating Christmas decorations configuration
const floatingDecorations = [
  { icon: "snowflake", left: "5%", delay: "0s", duration: "8s" },
  { icon: "ornament", left: "15%", delay: "1.5s", duration: "9s" },
  { icon: "star", left: "25%", delay: "3s", duration: "7s" },
  { icon: "bell", left: "35%", delay: "0.8s", duration: "10s" },
  { icon: "candy-cane", left: "45%", delay: "2.2s", duration: "8s" },
  { icon: "holly", left: "55%", delay: "4s", duration: "9s" },
  { icon: "gingerbread", left: "65%", delay: "1.2s", duration: "7s" },
  { icon: "stocking", left: "75%", delay: "2.8s", duration: "10s" },
  { icon: "wreath", left: "85%", delay: "3.5s", duration: "8s" },
  { icon: "gift", left: "92%", delay: "1s", duration: "9s" },
];

export function NewYearScene() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showMail, setShowMail] = useState(false);
  const [mailContent, setMailContent] = useState({ text: "", sign: "" });
  const winterWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateTime = () => {
      const today = new Date();
      const targetYear = today.getFullYear() + 1;
      const targetDate = new Date(`January 1, ${targetYear} 00:00:00`).getTime();
      const now = today.getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        const D = 1000 * 60 * 60 * 24;
        const H = 1000 * 60 * 60;
        const S = 1000 * 60;

        setTimeLeft({
          days: Math.floor(diff / D),
          hours: Math.floor((diff % D) / H),
          minutes: Math.floor((diff % H) / S),
          seconds: Math.floor((diff % S) / 1000),
        });
      }
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const wrapper = winterWrapperRef.current;
    if (!wrapper) return;

    const createSnowflakes = (count: number, className: string) => {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const snowflake = document.createElement("div");
        snowflake.className = `snowflake ${className}`;
        snowflake.style.left = Math.random() * 100 + "vw";
        snowflake.style.animationDuration = (Math.random() * 15 + 10) + "s";
        snowflake.style.animationDelay = (Math.random() * -15) + "s";
        fragment.appendChild(snowflake);
      }
      wrapper.appendChild(fragment);
    };

    createSnowflakes(30, "_sm");
    createSnowflakes(15, "_md");
    createSnowflakes(10, "_lg");

    return () => {
      if (wrapper) wrapper.innerHTML = '';
    };
  }, []);

  const startFireworks = useCallback((x: number, y: number) => {
    const candyCount = 8;
    const colors = ["#ADD8E6", "#B2F2BB", "#FFFACD", "#FFB6C1"];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < candyCount; i++) {
      const candy = document.createElement("div");
      candy.className = "candy";
      candy.style.background = colors[i % colors.length];
      const size = Math.random() * 8 + 8;
      candy.style.width = `${size}px`;
      candy.style.height = `${size}px`;
      const angle = (i / candyCount) * 2 * Math.PI;
      const distance = Math.random() * 60 + 30;
      candy.style.setProperty("--x", Math.cos(angle) * distance + "px");
      candy.style.setProperty("--y", Math.sin(angle) * distance + "px");
      candy.style.left = `${x}px`;
      candy.style.top = `${y}px`;
      fragment.appendChild(candy);
    }

    document.body.appendChild(fragment);
    setTimeout(() => {
      document.querySelectorAll('.candy').forEach(c => c.remove());
    }, 1200);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * (window.innerHeight * 0.5);
      startFireworks(x, y);
    }, 4000);
    return () => clearInterval(interval);
  }, [startFireworks]);

  const handleOpenMail = () => {
    const greetings = [
        "Merry Christmas and a Happy New Year! May your days be filled with joy, laughter, and the warmth of loved ones. Don't forget to leave me some cookies and milk—Santa needs his fuel for all that gift delivering! Stay jolly and bright!",
        "Greetings from the North Pole! I've checked my list twice, and you're on the 'Nice' list (of course!). May your Christmas sparkle like Rudolph's nose and your New Year be as magical as a sleigh ride under the stars. Wishing you stockings full of surprises and hearts full of happiness.",
        "The elves and I are wrapping up the year with one wish for you: a holiday season filled with love, laughter, and lots of snowflakes! Remember, the magic of Christmas isn't just in the presents, but in the smiles we share. Wishing you a New Year as wonderful as a fresh batch of cookies!",
        "Ready your sleigh, dear friend—it's time to dash into a holiday season filled with wonder and adventure! May your Christmas be merry, your New Year be bright, and your heart be full of magic. Remember, wherever you go, the spirit of the season follows.",
        "Happy Christmas and a joyful New Year to you! Let this season remind you of all the good in the world—the laughter of children, the kindness of strangers, and the hope in every heart. And don't forget, the greatest gifts aren't under the tree—they're the memories we make together.",
        "Jingle bells, jingle bells, you're on my way! The reindeer and I are gearing up for a magical night, and I've got some goodies with your name on them. May your Christmas be sweet as candy canes and your New Year full of sparkle. Don't forget to save me a cookie or two!"
    ];
    const signs = [
        "With love,",
        "Yours merrily,",
        "Warmest hugs,",
        "Off to the next chimney,",
        "Stay magical,",
        "Happily yours,"
    ];

    setMailContent({
        text: greetings[Math.floor(Math.random() * greetings.length)],
        sign: signs[Math.floor(Math.random() * signs.length)]
    });
    setShowMail(true);
  };

  return (
    <>
      <div className="winter-wrapper pointer-events-none" ref={winterWrapperRef} />

      {/* Floating Christmas SVG decorations */}
      <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
        {floatingDecorations.map((deco, index) => (
          <img
            key={index}
            src={`/icons/christmas/${deco.icon}.svg`}
            alt=""
            className="absolute top-0 christmas-fall w-8 h-8 opacity-60"
            style={{
              left: deco.left,
              animationDelay: deco.delay,
              animationDuration: deco.duration,
            }}
          />
        ))}

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 opacity-40">
          <img src="/icons/christmas/tree.svg" alt="" className="w-12 h-12 animate-pulse" />
        </div>
        <div className="absolute top-4 right-4 opacity-40">
          <img src="/icons/christmas/star.svg" alt="" className="w-10 h-10 animate-bounce" style={{ animationDuration: '2s' }} />
        </div>

        {/* Santa and Reindeer flying across (hidden on mobile) */}
        <div className="absolute top-16 left-0 opacity-30 hidden lg:block">
          <div className="flex items-center gap-2 christmas-orbit" style={{ animationDuration: '30s' }}>
            <img src="/icons/christmas/reindeer.svg" alt="" className="w-10 h-10" />
            <img src="/icons/christmas/sleigh.svg" alt="" className="w-14 h-10" />
            <img src="/icons/christmas/santa.svg" alt="" className="w-10 h-10" />
          </div>
        </div>

        {/* Bottom decorations */}
        <div className="absolute bottom-24 left-8 opacity-30 hidden sm:block">
          <div className="flex items-center gap-3">
            <img src="/icons/christmas/gift.svg" alt="" className="w-8 h-8" />
            <img src="/icons/christmas/gift.svg" alt="" className="w-6 h-6" />
            <img src="/icons/christmas/gift.svg" alt="" className="w-10 h-10" />
          </div>
        </div>
      </div>

      <div className="ground fixed bottom-0 left-0 right-0 z-10 pointer-events-none" />

      <div className="mailbox fixed bottom-[45px] right-[5vw] z-20 cursor-pointer" onClick={handleOpenMail}>
        <div className="basis"></div>
        <div className="box">
          <div className="letters">
            <div className="letter letter-second">
              <img className="letter-image" src="https://img.freepik.com/premium-vector/christmas-mail-postcard-hand-drawn-illustration_514781-2114.jpg" alt="letter" />
            </div>
            <div className="letter letter-first">
              <img className="letter-image" src="https://www.shutterstock.com/image-vector/christmas-new-year-postcard-wish-260nw-761840683.jpg" alt="letter" />
            </div>
          </div>
          <div className="box-title">
            <div className="font-sans-serif">letters from</div>
            <div className="font-script text-2xl">Santa</div>
            <div className="font-sans-serif">for</div>
            <div className="font-script text-2xl">you</div>
          </div>
        </div>
      </div>

      {showMail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowMail(false)}
        >
            <div
              className="mail relative max-w-lg w-full animate-in fade-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()}
            >
                <div className="mail-inner relative">
                    <button
                        type="button"
                        className="mail-close absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors z-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMail(false);
                        }}
                    >
                        ✕
                    </button>
                    <div className="flex items-center gap-2 mb-4">
                      <img src="/icons/christmas/santa.svg" alt="" className="w-8 h-8" />
                      <p className="mail-title text-xl font-bold text-red-800">Ho ho ho!</p>
                    </div>
                    <p className="mb-4 text-gray-800 leading-relaxed">{mailContent.text}</p>
                    <div className="mt-6 space-y-4">
                        <img
                          src="/aba.jpg"
                          alt="QR Code"
                          className="w-32 sm:w-48 mx-auto object-contain border-2 border-red-300 shadow-lg rounded-lg bg-white p-1 sm:p-2"
                        />
                        <div className="text-right flex items-end justify-end gap-2">
                          <div>
                            <div className="text-gray-600">{mailContent.sign}</div>
                            <div className="text-red-700 text-xl font-script">Santa Thy</div>
                          </div>
                          <img src="/icons/christmas/tree.svg" alt="" className="w-10 h-10" />
                        </div>
                    </div>
                    {/* Decoration at bottom of mail */}
                    <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-red-200">
                      <img src="/icons/christmas/candy-cane.svg" alt="" className="w-5 h-5" />
                      <img src="/icons/christmas/ornament.svg" alt="" className="w-5 h-5" />
                      <img src="/icons/christmas/bell.svg" alt="" className="w-5 h-5" />
                      <img src="/icons/christmas/holly.svg" alt="" className="w-5 h-5" />
                      <img src="/icons/christmas/gift.svg" alt="" className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
}

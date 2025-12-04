"use client";

import { useEffect, useState } from "react";

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

interface MatrixDrop {
  id: number;
  x: number;
  delay: number;
  duration: number;
  chars: string[];
}

export function CodingScene() {
  const [drops, setDrops] = useState<MatrixDrop[]>([]);

  useEffect(() => {
    const generateDrops = () => {
      const newDrops: MatrixDrop[] = [];
      const dropCount = Math.floor(window.innerWidth / 30);

      for (let i = 0; i < dropCount; i++) {
        const charCount = Math.floor(Math.random() * 15) + 5;
        const chars = Array.from({ length: charCount }, () =>
          MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        );

        newDrops.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 5,
          duration: Math.random() * 3 + 2,
          chars,
        });
      }
      setDrops(newDrops);
    };

    generateDrops();
    window.addEventListener("resize", generateDrops);
    return () => window.removeEventListener("resize", generateDrops);
  }, []);

  return (
    <>
      {/* Scanlines overlay */}
      <div className="coding-scanlines" />

      {/* Matrix rain */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {drops.map((drop) => (
          <div
            key={drop.id}
            className="coding-matrix-char"
            style={{
              left: `${drop.x}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
            }}
          >
            {drop.chars.map((char, idx) => (
              <div
                key={idx}
                style={{
                  opacity: 1 - idx * 0.06,
                }}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 404 Error decoration */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-none font-mono">
        <div className="coding-error-text text-6xl font-bold opacity-20">
          404
        </div>
        <div className="text-green-500 text-xs opacity-40 mt-1">
          ERROR: TICKET_NOT_FOUND
        </div>
      </div>

      {/* Terminal prompt decoration */}
      <div className="fixed top-20 left-8 z-50 pointer-events-none font-mono text-xs opacity-30">
        <div className="text-green-500">
          <span className="text-green-400">root@jira</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~/handover</span>
          <span className="text-white">$ </span>
          <span className="coding-cursor" />
        </div>
      </div>
    </>
  );
}

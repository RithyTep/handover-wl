"use client";

import { useEffect, useRef } from "react";

export function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const flakes: any[] = [];
    const flakeCount = 200;
    let mX = -100;
    let mY = -100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const reset = (flake: any) => {
      flake.x = Math.floor(Math.random() * canvas.width);
      flake.y = 0;
      flake.size = (Math.random() * 3) + 2;
      flake.speed = (Math.random() * 1) + 0.5;
      flake.velY = flake.speed;
      flake.velX = 0;
      flake.opacity = (Math.random() * 0.5) + 0.3;
    };

    const init = () => {
      flakes.length = 0;
      for (let i = 0; i < flakeCount; i++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        const size = (Math.random() * 3) + 2;
        const speed = (Math.random() * 1) + 0.5;
        const opacity = (Math.random() * 0.5) + 0.3;

        flakes.push({
          speed: speed,
          velY: speed,
          velX: 0,
          x: x,
          y: y,
          size: size,
          stepSize: (Math.random()) / 30,
          step: 0,
          angle: 180,
          opacity: opacity
        });
      }
    };

    const snow = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < flakeCount; i++) {
        const flake = flakes[i];
        const x = mX;
        const y = mY;
        const minDist = 150;
        const x2 = flake.x;
        const y2 = flake.y;

        const dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y));

        if (dist < minDist) {
          const force = minDist / (dist * dist);
          const xcomp = (x - x2) / dist;
          const ycomp = (y - y2) / dist;
          const deltaV = force / 2;

          flake.velX -= deltaV * xcomp;
          flake.velY -= deltaV * ycomp;

        } else {
          flake.velX *= .98;
          if (flake.velY <= flake.speed) {
            flake.velY = flake.speed;
          }
          flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
        }

        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
        flake.y += flake.velY;
        flake.x += flake.velX;

        if (flake.y >= canvas.height || flake.y <= 0) {
          reset(flake);
        }

        if (flake.x >= canvas.width || flake.x <= 0) {
          reset(flake);
        }

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(snow);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mX = e.clientX;
      mY = e.clientY;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    
    resizeCanvas();
    init();
    snow();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas fixed inset-0 pointer-events-none z-0" />;
}

"use client";

import { useMemo } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: string;
}

// Seeded pseudo-random to avoid hydration mismatch
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function StarField({ count = 120 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const r = (n: number) => seededRandom(i * 7 + n);
      const size = r(1) < 0.7 ? "1px" : r(1) < 0.9 ? "2px" : "3px";
      return {
        id: i,
        top: `${(r(2) * 100).toFixed(2)}%`,
        left: `${(r(3) * 100).toFixed(2)}%`,
        size,
        duration: `${(3 + r(4) * 5).toFixed(1)}s`,
        delay: `${(r(5) * 6).toFixed(1)}s`,
        opacity: `${(0.3 + r(6) * 0.7).toFixed(2)}`,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            backgroundColor: "#c8f135",
            opacity: star.opacity,
            animationName: "star-twinkle",
            animationDuration: star.duration,
            animationDelay: star.delay,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}

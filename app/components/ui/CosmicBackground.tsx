"use client";

import { motion } from "framer-motion";
import { StarField } from "./StarField";

interface Planet {
  size: number;
  top: string;
  left: string;
  duration: number;
  color: string;
  blur: number;
  opacity: number;
}

const PLANETS: Planet[] = [
  { size: 320, top: "-10%",  left: "-8%",  duration: 22, color: "rgba(200,241,53,0.06)",   blur: 80, opacity: 1 },
  { size: 200, top: "55%",   left: "80%",  duration: 28, color: "rgba(200,241,53,0.04)",   blur: 60, opacity: 1 },
  { size: 140, top: "30%",   left: "50%",  duration: 18, color: "rgba(255,255,255,0.025)",  blur: 50, opacity: 1 },
  { size: 80,  top: "80%",   left: "20%",  duration: 35, color: "rgba(200,241,53,0.05)",   blur: 40, opacity: 1 },
];

export function CosmicBackground({ grid = true }: { grid?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-[#030303]" />

      {/* Grid */}
      {grid && (
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,241,53,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,241,53,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      )}

      {/* Stars */}
      <StarField count={140} />

      {/* Floating planets */}
      {PLANETS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            background: `radial-gradient(circle at 40% 40%, ${p.color}, transparent 70%)`,
            filter: `blur(${p.blur}px)`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -24, 0],
            x: [0, 12, 0],
          }}
          transition={{
            duration: p.duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 3,
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(3,3,3,0.7) 100%)",
        }}
      />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

// Deterministic pseudo-random for consistent SSR/client rendering
function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"black" | "eye" | "tension" | "flash">(
    "black"
  );
  const [isDone, setIsDone] = useState(false);

  const handleComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("eye"), 400),
      setTimeout(() => setPhase("tension"), 2600),
      setTimeout(() => setPhase("flash"), 3400),
      setTimeout(() => {
        setIsDone(true);
        handleComplete();
      }, 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [handleComplete]);

  if (isDone) return null;

  // Speed line count and properties
  const speedLineCount = 48;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#050505" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ═══ MANGA SPEED LINES ═══ */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: speedLineCount }).map((_, i) => {
              const angle = (i * 360) / speedLineCount;
              const thickness = 1 + seeded(i + 100) * 2;
              const delay = 0.8 + seeded(i) * 0.6;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: `${thickness}px`,
                    height: "250vh",
                    transformOrigin: "center center",
                    rotate: `${angle}deg`,
                    background: `linear-gradient(to bottom, transparent 40%, rgba(255,255,255,${0.03 + seeded(i + 50) * 0.08}) 50%, transparent 60%)`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{
                    scaleY:
                      phase === "tension" || phase === "flash"
                        ? 1
                        : phase === "eye"
                          ? 0.15
                          : 0,
                    opacity:
                      phase === "flash"
                        ? 0.6
                        : phase === "tension"
                          ? 0.35
                          : phase === "eye"
                            ? 0.08
                            : 0,
                  }}
                  transition={{
                    duration: phase === "flash" ? 0.3 : 1,
                    delay: phase === "black" ? 0 : delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              );
            })}
          </div>

          {/* ═══ CONCENTRIC PRESSURE RINGS ═══ */}
          {[160, 260, 400].map((size, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border pointer-events-none"
              style={{
                width: size,
                height: size,
                borderColor: "rgba(255,255,255,0.04)",
                borderWidth: 1,
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: phase === "tension" || phase === "flash" ? 1.5 + i * 0.3 : 0.8,
                opacity:
                  phase === "tension"
                    ? 0.15
                    : phase === "flash"
                      ? 0.3
                      : 0,
              }}
              transition={{
                duration: 1.2,
                delay: 2.0 + i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}

          {/* ═══ THE EYE ═══ */}
          <div
            className="relative z-10"
            style={{ width: 280, height: 140 }}
          >
            {/* Eye shape container — almond/oval with overflow hidden for eyelids */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                borderRadius: "50%",
              }}
            >
              {/* Sclera */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, #f5f0e8 0%, #e8ddd0 60%, #d4c8b8 100%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: phase !== "black" ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              />

              {/* Blood vessels / sclera detail */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={`vein-${i}`}
                  className="absolute"
                  style={{
                    width: 60 + i * 20,
                    height: 1,
                    top: 40 + i * 18,
                    left: i % 2 === 0 ? 10 : undefined,
                    right: i % 2 === 1 ? 10 : undefined,
                    background: `rgba(180, 100, 90, ${0.06 + i * 0.02})`,
                    transform: `rotate(${-8 + i * 5}deg)`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase !== "black" ? 1 : 0 }}
                  transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
                />
              ))}

              {/* Iris */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 76,
                  height: 76,
                  left: "50%",
                  top: "50%",
                  marginLeft: -38,
                  marginTop: -38,
                  background:
                    "radial-gradient(circle at 45% 40%, #a07040 0%, #7a5030 25%, #4a2810 50%, #1a0800 80%, #0a0400 100%)",
                  boxShadow: "0 0 20px rgba(80, 40, 10, 0.4)",
                }}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{
                  scale:
                    phase === "flash"
                      ? 1.15
                      : phase === "tension"
                        ? 1.05
                        : phase === "eye"
                          ? 1
                          : 0.3,
                  opacity: phase !== "black" ? 1 : 0,
                }}
                transition={{
                  duration: phase === "flash" ? 0.25 : 0.8,
                  delay: phase === "eye" ? 0.5 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Iris texture rings */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={`iris-ring-${i}`}
                    className="absolute rounded-full"
                    style={{
                      inset: 8 + i * 8,
                      border: `1px solid rgba(160, 120, 60, ${0.15 - i * 0.04})`,
                    }}
                  />
                ))}
              </motion.div>

              {/* Pupil */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  left: "50%",
                  top: "50%",
                  marginLeft: -14,
                  marginTop: -14,
                  backgroundColor: "#020000",
                  boxShadow: "0 0 12px 4px rgba(0,0,0,0.6)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale:
                    phase === "flash"
                      ? 0.5
                      : phase === "tension"
                        ? 0.85
                        : phase === "eye"
                          ? 1
                          : 0,
                  opacity: phase !== "black" ? 1 : 0,
                }}
                transition={{
                  duration: phase === "flash" ? 0.2 : 0.6,
                  delay: phase === "eye" ? 0.7 : 0,
                }}
              />

              {/* Specular highlight — large */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 14,
                  height: 10,
                  left: "53%",
                  top: "36%",
                  backgroundColor: "rgba(255,255,255,0.92)",
                  filter: "blur(1px)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: phase !== "black" ? 1 : 0,
                  scale: phase === "flash" ? 1.3 : 1,
                }}
                transition={{ delay: 1.0, duration: 0.4 }}
              />

              {/* Specular highlight — small */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 5,
                  height: 4,
                  left: "43%",
                  top: "58%",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  filter: "blur(0.5px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: phase !== "black" ? 1 : 0 }}
                transition={{ delay: 1.2, duration: 0.3 }}
              />

              {/* ── UPPER EYELID ── */}
              <motion.div
                className="absolute"
                style={{
                  left: -20,
                  right: -20,
                  top: -20,
                  height: "75%",
                  backgroundColor: "#080808",
                  borderRadius: "0 0 50% 50%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
                initial={{ y: 0 }}
                animate={{
                  y:
                    phase === "flash"
                      ? -85
                      : phase === "tension"
                        ? -72
                        : phase === "eye"
                          ? -68
                          : 0,
                }}
                transition={{
                  duration: phase === "flash" ? 0.15 : 1.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: phase === "eye" ? 0.3 : 0,
                }}
              >
                {/* Eyelash hints */}
                <div
                  className="absolute bottom-0 left-[15%] right-[15%] h-[2px]"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent)",
                  }}
                />
              </motion.div>

              {/* ── LOWER EYELID ── */}
              <motion.div
                className="absolute"
                style={{
                  left: -20,
                  right: -20,
                  bottom: -20,
                  height: "65%",
                  backgroundColor: "#060606",
                  borderRadius: "50% 50% 0 0",
                  boxShadow: "0 -2px 15px rgba(0,0,0,0.4)",
                }}
                initial={{ y: 0 }}
                animate={{
                  y:
                    phase === "flash"
                      ? 65
                      : phase === "tension"
                        ? 52
                        : phase === "eye"
                          ? 48
                          : 0,
                }}
                transition={{
                  duration: phase === "flash" ? 0.15 : 1.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: phase === "eye" ? 0.3 : 0,
                }}
              />
            </div>

            {/* Eye outline glow */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow:
                  "0 0 40px 10px rgba(160, 100, 40, 0.15), 0 0 80px 20px rgba(160, 100, 40, 0.05)",
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  phase === "tension" || phase === "flash" ? 1 : phase === "eye" ? 0.4 : 0,
              }}
              transition={{ duration: 0.8, delay: 1.0 }}
            />
          </div>

          {/* ═══ LOADING TEXT ═══ */}
          <motion.div
            className="absolute z-20"
            style={{ bottom: "25%" }}
            initial={{ opacity: 0 }}
            animate={{
              opacity:
                phase === "eye" || phase === "tension" ? 1 : phase === "flash" ? 0 : 0,
            }}
            transition={{
              duration: phase === "flash" ? 0.2 : 0.5,
              delay: phase === "eye" ? 1.6 : 0,
            }}
          >
            <motion.p
              className="text-white text-lg font-bold tracking-[0.5em] uppercase loading-shake"
              animate={
                phase === "tension"
                  ? {
                      x: [0, -3, 4, -2, 3, -4, 2, -1, 3, 0],
                      y: [0, 2, -1, 3, -2, 1, -3, 2, -1, 0],
                    }
                  : phase === "eye"
                    ? {
                        x: [0, -1, 1, 0],
                        y: [0, 0.5, -0.5, 0],
                      }
                    : {}
              }
              transition={{
                duration: phase === "tension" ? 0.15 : 0.4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Loading&hellip;
            </motion.p>
            {/* Underline */}
            <motion.div
              className="h-[1px] mx-auto mt-3"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              initial={{ width: 0 }}
              animate={{ width: phase !== "black" ? 120 : 0 }}
              transition={{ delay: 2.0, duration: 0.6 }}
            />
          </motion.div>

          {/* ═══ FLASH BURST on reveal ═══ */}
          {phase === "flash" && (
            <motion.div
              className="absolute inset-0 z-30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.95, 0] }}
              transition={{ duration: 0.7, times: [0, 0.2, 1], ease: "easeOut" }}
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,248,235,1) 0%, rgba(255,240,220,0.8) 30%, rgba(0,0,0,0) 70%)",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { BookData } from "@/lib/data";

interface BookProps {
  book: BookData;
  index: number;
  initialRotateY?: number;
}

// Deterministic pseudo-random for consistent SSR/client rendering
function sr(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function Book({
  book,
  index,
  initialRotateY = -8,
}: BookProps) {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
  };

  // Physical book dimensions
  const W = 260;
  const H = 380;
  const D = 40;

  const spineColor = book.coverColor;

  // Hover target: if initial lean is left (negative), hover rotates right (positive), and vice versa
  const hoverRotateY = initialRotateY < 0 ? 10 : -10;

  return (
    <>
      {/* Book on shelf */}
      <motion.div
        className="relative cursor-pointer"
        style={{ perspective: 1600, width: W, height: H }}
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 0.3 + index * 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            y: isHovered ? -14 : 0,
            rotateY: isHovered ? hoverRotateY : initialRotateY,
            rotateX: isHovered ? -2 : 2,
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ═══ FRONT COVER ═══ */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              width: W,
              height: H,
              backfaceVisibility: "hidden",
              transform: `translateZ(${D / 2}px)`,
              borderRadius: "1px 4px 4px 1px",
            }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: book.coverColor }}
            />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${book.images[0]})`,
                opacity: 0.55,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
            {/* Top edge highlight */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
              }}
            />
            {/* Dynamic light reflection */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: isHovered
                  ? "linear-gradient(115deg, rgba(255,240,200,0.20) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0) 60%)"
                  : "linear-gradient(115deg, rgba(255,240,200,0.04) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)",
              }}
              transition={{ duration: 0.7 }}
            />
            {/* Cover emboss border */}
            <div
              className="absolute inset-[12px] pointer-events-none"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "1px",
              }}
            />
            {/* Title block */}
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <p className="text-white/50 text-[9px] tracking-[0.35em] uppercase mb-2">
                {book.subtitle}
              </p>
              <h2 className="text-white font-light text-[26px] tracking-[0.04em] leading-tight">
                {book.title}
              </h2>
              <div className="w-6 h-[1px] bg-white/20 mt-4" />
            </div>
          </div>

          {/* ═══ BACK COVER ═══ */}
          <div
            className="absolute"
            style={{
              width: W,
              height: H,
              backgroundColor: book.coverColor,
              transform: `translateZ(${-D / 2}px) rotateY(180deg)`,
              backfaceVisibility: "hidden",
              borderRadius: "4px 1px 1px 4px",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.05) 100%)",
              }}
            />
          </div>

          {/* ═══ SPINE (left face) ═══ */}
          <div
            className="absolute top-0 flex items-center justify-center"
            style={{
              width: D,
              height: H,
              backgroundColor: spineColor,
              transform: `rotateY(-90deg) translateZ(${D / 2}px)`,
              transformOrigin: "left center",
              left: -D / 2,
              backfaceVisibility: "hidden",
            }}
          >
            {/* Spine groove lines */}
            <div
              className="absolute top-[10px] left-0 right-0 h-[2px]"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <div
              className="absolute top-[14px] left-0 right-0 h-[1px]"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
            <div
              className="absolute bottom-[10px] left-0 right-0 h-[2px]"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <div
              className="absolute bottom-[14px] left-0 right-0 h-[1px]"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
            {/* Spine highlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.08), rgba(0,0,0,0.08), rgba(255,255,255,0.03))",
              }}
            />
            {/* Spine title */}
            <span
              className="text-white/60 text-[8px] tracking-[0.4em] uppercase whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
              }}
            >
              {book.title}
            </span>
          </div>

          {/* ═══ RIGHT EDGE (pages) ═══ */}
          <div
            className="absolute top-0 overflow-hidden"
            style={{
              width: D,
              height: H,
              transform: `rotateY(90deg) translateZ(${W - D / 2}px)`,
              transformOrigin: "left center",
              left: -D / 2,
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #e8e2da, #f0ebe5, #ebe5dd)",
              }}
            />
            {/* Page lines — deterministic */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0"
                style={{
                  top: 8 + i * ((H - 16) / 30),
                  height: "1px",
                  background: `rgba(0,0,0,${(0.03 + sr(i * 7 + 1) * 0.03).toFixed(4)})`,
                }}
              />
            ))}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.08), transparent 30%, transparent 70%, rgba(0,0,0,0.04))",
              }}
            />
          </div>

          {/* ═══ TOP EDGE (pages) ═══ */}
          <div
            className="absolute left-0"
            style={{
              width: W,
              height: D,
              transform: `rotateX(90deg) translateZ(${D / 2}px)`,
              transformOrigin: "top center",
              top: -D / 2,
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, #f0ebe5, #e8e2da)",
              }}
            />
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0"
                style={{
                  left: 8 + i * ((W - 16) / 18),
                  width: "1px",
                  background: `rgba(0,0,0,${(0.02 + sr(i * 13 + 100) * 0.02).toFixed(4)})`,
                }}
              />
            ))}
          </div>

          {/* ═══ BOTTOM EDGE (pages) ═══ */}
          <div
            className="absolute left-0"
            style={{
              width: W,
              height: D,
              transform: `rotateX(-90deg) translateZ(${H - D / 2}px)`,
              transformOrigin: "top center",
              top: -D / 2,
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, #ebe5dd, #e8e2da)",
              }}
            />
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0"
                style={{
                  left: 8 + i * ((W - 16) / 18),
                  width: "1px",
                  background: `rgba(0,0,0,${(0.02 + sr(i * 17 + 200) * 0.02).toFixed(4)})`,
                }}
              />
            ))}
          </div>

          {/* ═══ WARM SHADOW ═══ */}
          <motion.div
            className="absolute rounded-[50%]"
            style={{
              width: W * 1.15,
              height: 34,
              left: -W * 0.075,
              bottom: -30,
              filter: "blur(20px)",
              transformStyle: "flat",
              transform: "translateZ(-30px)",
            }}
            animate={{
              backgroundColor: isHovered
                ? "rgba(50, 30, 10, 0.30)"
                : "rgba(50, 30, 10, 0.13)",
              scaleX: isHovered ? 1.15 : 1,
              scaleY: isHovered ? 1.3 : 1,
              y: isHovered ? 10 : 0,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </motion.div>

      {/* ═══ BOOK OPENING OVERLAY ═══ */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ backgroundColor: "rgba(240,232,218,0)" }}
            animate={{ backgroundColor: "rgba(240,232,218,1)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className="relative"
              style={{
                perspective: 2500,
                width: 520,
                height: 700,
              }}
              initial={{ scale: 0.35, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Inside pages (revealed after cover opens) */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: "#f8f4ec",
                    borderRadius: "2px 4px 4px 2px",
                    boxShadow: "inset 2px 0 12px rgba(40, 25, 10, 0.06)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {/* Page texture lines */}
                  <div className="absolute inset-0 pointer-events-none opacity-30">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute left-[40px] right-[40px]"
                        style={{
                          top: 80 + i * 28,
                          height: "1px",
                          background: "rgba(80, 60, 30, 0.04)",
                        }}
                      />
                    ))}
                  </div>
                  {/* Title page content */}
                  <div className="text-center relative z-[1]">
                    <motion.div
                      className="w-8 h-[1px] mx-auto mb-8"
                      style={{ backgroundColor: "rgba(160, 140, 100, 0.25)" }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    />
                    <motion.p
                      className="text-[10px] tracking-[0.5em] uppercase mb-4"
                      style={{ color: "rgba(120, 100, 70, 0.5)" }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.7 }}
                    >
                      {book.subtitle}
                    </motion.p>
                    <motion.h1
                      className="text-5xl md:text-6xl font-extralight tracking-wide"
                      style={{ color: "rgba(50, 40, 25, 0.85)" }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.15, duration: 0.7 }}
                    >
                      {book.title}
                    </motion.h1>
                    <motion.div
                      className="w-8 h-[1px] mx-auto mt-8"
                      style={{ backgroundColor: "rgba(160, 140, 100, 0.25)" }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                    />
                  </div>
                </motion.div>

                {/* Spine visible during opening */}
                <motion.div
                  className="absolute top-0 h-full"
                  style={{
                    width: D,
                    left: 0,
                    backgroundColor: spineColor,
                    transform: `translateX(-${D}px) rotateY(-90deg)`,
                    transformOrigin: "right center",
                    backfaceVisibility: "hidden",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(255,255,255,0.06), rgba(0,0,0,0.06), rgba(255,255,255,0.03))",
                    }}
                  />
                </motion.div>

                {/* Front cover — swings open from spine */}
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                    borderRadius: "1px 4px 4px 1px",
                  }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: -155 }}
                  transition={{
                    duration: 1.6,
                    delay: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onAnimationComplete={() => {
                    router.push(`/category/${book.slug}`);
                  }}
                >
                  {/* Cover front */}
                  <div className="absolute inset-0">
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: book.coverColor }}
                    />
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-55"
                      style={{
                        backgroundImage: `url(${book.images[0]})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
                    <div className="absolute bottom-0 left-0 right-0 p-10">
                      <p className="text-white/50 text-[10px] tracking-[0.35em] uppercase mb-2">
                        {book.subtitle}
                      </p>
                      <h2 className="text-white font-light text-4xl tracking-[0.04em]">
                        {book.title}
                      </h2>
                    </div>
                  </div>
                  {/* Cover back face */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      backgroundColor: "#e8e0d4",
                      borderRadius: "4px 1px 1px 4px",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)",
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

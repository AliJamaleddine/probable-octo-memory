"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { BookData } from "@/lib/data";

interface CreativeDeskProps {
  books: BookData[];
}

// Deterministic pseudo-random
function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Photo layout positions on the desk (hand-placed, organic feel)
const photoPositions = [
  { x: "5%", y: "12%", rotate: -3.2, width: 320, aspect: "4/3", tape: "top-left", zBase: 10 },
  { x: "55%", y: "8%", rotate: 2.1, width: 280, aspect: "3/4", tape: "top-right", zBase: 12 },
  { x: "30%", y: "38%", rotate: -1.5, width: 340, aspect: "16/10", tape: "top-center", zBase: 14 },
  { x: "0%", y: "55%", rotate: 2.8, width: 290, aspect: "3/4", tape: "top-left", zBase: 11 },
  { x: "60%", y: "48%", rotate: -2.4, width: 310, aspect: "4/3", tape: "none", zBase: 13 },
  { x: "35%", y: "75%", rotate: 1.2, width: 300, aspect: "3/4", tape: "top-right", zBase: 15 },
];

// Sticky notes scattered around
const stickyNotes = [
  { x: "78%", y: "15%", rotate: -5, color: "#fef3c7", text: "maybe crop here?", size: "small" },
  { x: "82%", y: "55%", rotate: 8, color: "#dbeafe", text: "good light!", size: "small" },
  { x: "2%", y: "85%", rotate: -3, color: "#fce7f3", text: "reshoot at\ngolden hour", size: "medium" },
  { x: "75%", y: "80%", rotate: 12, color: "#dcfce7", text: "new ideas\nsoon...", size: "small" },
];

// Scribble captions that appear on hover
const hoverCaptions = [
  "favorite shot",
  "needs contrast",
  "print this one!",
  "so dreamy",
  "good composition",
  "love the light",
];

// Paper clip SVG path
function PaperClip({ x, y, rotate }: { x: string; y: string; rotate: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.5, duration: 0.4 }}
    >
      <svg
        width="24"
        height="60"
        viewBox="0 0 24 60"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <path
          d="M12 2 C6 2 2 6 2 12 L2 48 C2 54 6 58 12 58 C18 58 22 54 22 48 L22 16 C22 10 18 6 12 6 C8 6 6 8 6 12 L6 44"
          stroke="#a0a0a0"
          strokeWidth="1.5"
          fill="none"
          style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))" }}
        />
      </svg>
    </motion.div>
  );
}

// Tape strip component
function TapeStrip({ position, photoWidth }: { position: string; photoWidth: number }) {
  const tapeWidth = 60 + Math.random() * 30;
  const tapeRotate = (Math.random() - 0.5) * 15;

  const positionStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: -8, left: -10, transform: `rotate(${tapeRotate - 20}deg)` },
    "top-right": { top: -8, right: -10, transform: `rotate(${tapeRotate + 15}deg)` },
    "top-center": { top: -10, left: "50%", marginLeft: -tapeWidth / 2, transform: `rotate(${tapeRotate}deg)` },
    "none": { display: "none" },
  };

  return (
    <div
      className="tape absolute z-20"
      style={{
        width: tapeWidth,
        height: 18,
        ...positionStyles[position],
      }}
    />
  );
}

// Hand-drawn camera doodle SVG
function CameraDoodle({ x, y }: { x: string; y: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 0.35 }}
      transition={{ delay: 2.2, duration: 0.8 }}
    >
      <svg width="80" height="60" viewBox="0 0 80 60">
        <motion.path
          d="M10 20 L25 10 L55 10 L70 20 L75 20 L75 50 L5 50 L5 20 Z"
          className="sketch-line"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.2, duration: 1.2, ease: "easeInOut" }}
        />
        <motion.circle
          cx="40"
          cy="33"
          r="12"
          className="sketch-line"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.8, duration: 0.8, ease: "easeInOut" }}
        />
        <motion.circle
          cx="40"
          cy="33"
          r="6"
          className="sketch-line"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3.2, duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

// Pencil sketch arrow
function SketchArrow({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 12;
  const hx1 = x2 - headLen * Math.cos(angle - 0.4);
  const hy1 = y2 - headLen * Math.sin(angle - 0.4);
  const hx2 = x2 - headLen * Math.cos(angle + 0.4);
  const hy2 = y2 - headLen * Math.sin(angle + 0.4);

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.35 }}
      transition={{ delay, duration: 0.6 }}
    >
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        className="sketch-line"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
      />
      <motion.polyline
        points={`${hx1},${hy1} ${x2},${y2} ${hx2},${hy2}`}
        className="sketch-line"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.3 }}
      />
    </motion.g>
  );
}

// Paper rip transition overlay
function PaperRipTransition({ isActive, onComplete }: { isActive: boolean; onComplete: () => void }) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(onComplete, 900);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div className="fixed inset-0 z-[200] pointer-events-none">
          {/* Left torn piece */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: "#f5f0e6",
              backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(139,109,71,0.03) 0%, transparent 70%)",
            }}
            initial={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
            animate={{
              clipPath: "polygon(0 0, 52% 3%, 48% 12%, 53% 22%, 47% 32%, 52% 42%, 48% 52%, 53% 62%, 47% 72%, 52% 82%, 48% 92%, 50% 100%, 0 100%)",
              x: "-100%",
              rotate: -3,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Right torn piece */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: "#f5f0e6",
              backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(139,109,71,0.03) 0%, transparent 70%)",
            }}
            initial={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" }}
            animate={{
              clipPath: "polygon(48% 3%, 100% 0, 100% 100%, 50% 100%, 52% 92%, 47% 82%, 53% 72%, 48% 62%, 52% 52%, 47% 42%, 53% 32%, 48% 22%, 52% 12%)",
              x: "100%",
              rotate: 3,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Torn edge shadow */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 45%, rgba(0,0,0,0.1) 49%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.1) 51%, transparent 55%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.7, times: [0, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CreativeDesk({ books }: CreativeDeskProps) {
  const router = useRouter();
  const [assembled, setAssembled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [rippingSlug, setRippingSlug] = useState<string | null>(null);
  const [showNotebook, setShowNotebook] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAssembled(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handlePhotoClick = (slug: string) => {
    if (rippingSlug) return;
    setRippingSlug(slug);
  };

  const handleRipComplete = () => {
    if (rippingSlug) {
      router.push(`/category/${rippingSlug}`);
    }
  };

  return (
    <>
      <PaperRipTransition isActive={!!rippingSlug} onComplete={handleRipComplete} />

      <div className="desk-surface min-h-screen relative overflow-hidden">
        {/* Desk vignette / ambient light */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(255,240,200,0.12) 0%, transparent 60%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 80% 80%, rgba(0,0,0,0.08) 0%, transparent 50%)",
          }} />
          {/* Subtle desk edge shadow */}
          <div className="absolute inset-0" style={{
            boxShadow: "inset 0 0 150px rgba(0,0,0,0.15)",
          }} />
        </div>

        {/* === LARGE SKETCHBOOK PAPER UNDER EVERYTHING === */}
        <motion.div
          className="absolute"
          style={{
            left: "8%",
            top: "3%",
            width: "85%",
            height: "92%",
            backgroundColor: "#f5f0e6",
            boxShadow: "0 2px 20px rgba(0,0,0,0.1), 0 8px 40px rgba(0,0,0,0.06)",
            transform: "rotate(-0.5deg)",
            zIndex: 1,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: assembled ? 1 : 0, y: assembled ? 0 : 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Paper texture grain */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='6' height='6' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }} />
          {/* Faint ruled lines */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 31px, #7a8a9a 31px, #7a8a9a 32px)",
            backgroundPosition: "0 20px",
          }} />
        </motion.div>

        {/* === MAIN CONTENT AREA === */}
        <div className="relative z-[5] max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-20">

          {/* ── TITLE: handwritten at top ── */}
          <motion.div
            className="relative text-center mb-4 md:mb-8"
            style={{ zIndex: 20 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: assembled ? 1 : 0, y: assembled ? 0 : -20 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <h1
              className="handwritten text-5xl md:text-7xl lg:text-8xl text-[#2a2420] font-bold"
              style={{ lineHeight: 1.1 }}
            >
              My Photography
            </h1>
            <motion.div
              className="handwritten text-lg md:text-xl text-[#8a7a6a] mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: assembled ? 1 : 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              a visual journal — work in progress
            </motion.div>

            {/* Underline sketch */}
            <svg
              className="mx-auto mt-2"
              width="200"
              height="12"
              viewBox="0 0 200 12"
            >
              <motion.path
                d="M10 8 Q50 2 100 7 Q150 12 190 5"
                className="sketch-line"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: assembled ? 1 : 0 }}
                transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
              />
            </svg>
          </motion.div>

          {/* ── PHOTOS SCATTERED ON DESK ── */}
          <div className="relative" style={{ minHeight: "160vh" }}>

            {/* Pencil sketch arrows (drawn between items) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 30 }}>
              <SketchArrow x1={340} y1={160} x2={420} y2={280} delay={2.5} />
              <SketchArrow x1={750} y1={350} x2={680} y2={450} delay={2.8} />
              <SketchArrow x1={200} y1={680} x2={320} y2={720} delay={3.0} />
            </svg>

            {/* Camera doodle */}
            <CameraDoodle x="85%" y="35%" />

            {/* Film roll doodle */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ left: "88%", top: "68%" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2.6, duration: 0.6 }}
            >
              <svg width="50" height="50" viewBox="0 0 50 50">
                <motion.circle cx="25" cy="25" r="20" className="sketch-line" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 2.6, duration: 0.8 }} />
                <motion.circle cx="25" cy="25" r="8" className="sketch-line" strokeWidth="1"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 3.0, duration: 0.5 }} />
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.circle
                    key={i}
                    cx={25 + 14 * Math.cos((angle * Math.PI) / 180)}
                    cy={25 + 14 * Math.sin((angle * Math.PI) / 180)}
                    r="3"
                    className="sketch-line"
                    strokeWidth="0.8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 3.2 + i * 0.1, duration: 0.3 }}
                  />
                ))}
              </svg>
            </motion.div>

            {/* Color palette doodle */}
            <motion.div
              className="absolute pointer-events-none hidden md:block"
              style={{ left: "90%", top: "12%" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: assembled ? 0.7 : 0, scale: assembled ? 1 : 0.8 }}
              transition={{ delay: 2.8, duration: 0.5 }}
            >
              <div className="flex gap-1">
                {["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"].map((color, i) => (
                  <div
                    key={i}
                    className="rounded-full"
                    style={{ width: 14, height: 14, backgroundColor: color, opacity: 0.6 }}
                  />
                ))}
              </div>
              <p className="handwritten text-[10px] text-[#8a7a6a] mt-1 opacity-50">palette v3</p>
            </motion.div>

            {/* Photos */}
            {books.map((book, i) => {
              const pos = photoPositions[i];
              const isHovered = hoveredIndex === i;
              const isRipping = rippingSlug === book.slug;

              return (
                <motion.div
                  key={book.slug}
                  className="absolute cursor-pointer"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    width: pos.width,
                    maxWidth: "42vw",
                    zIndex: isHovered ? 50 : pos.zBase,
                  }}
                  initial={{
                    opacity: 0,
                    y: -60,
                    rotate: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: assembled ? (isRipping ? 0 : 1) : 0,
                    y: assembled ? 0 : -60,
                    rotate: isHovered ? pos.rotate * 0.3 : pos.rotate,
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{
                    opacity: { duration: 0.5 },
                    y: { duration: 0.7, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
                    rotate: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handlePhotoClick(book.slug)}
                >
                  {/* Polaroid frame */}
                  <motion.div
                    className="polaroid relative"
                    style={{ padding: "10px 10px 44px 10px" }}
                    animate={{
                      boxShadow: isHovered
                        ? "0 8px 20px rgba(0,0,0,0.18), 0 20px 50px rgba(0,0,0,0.12)"
                        : "0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.05)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Tape */}
                    <TapeStrip position={pos.tape} photoWidth={pos.width} />

                    {/* Photo */}
                    <div className="overflow-hidden bg-neutral-200" style={{ aspectRatio: pos.aspect }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={book.images[0]}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out"
                        style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
                        loading="lazy"
                        draggable={false}
                      />
                    </div>

                    {/* Handwritten label */}
                    <div className="mt-2 px-1 flex items-baseline justify-between">
                      <span className="handwritten text-lg text-[#2a2420]">
                        {book.title}
                      </span>
                      <span className="handwritten text-sm text-[#a09080]">
                        {book.images.length} shots
                      </span>
                    </div>
                  </motion.div>

                  {/* Hover scribble caption */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute -bottom-6 left-4 handwritten text-sm text-[#8a7a6a] whitespace-nowrap pointer-events-none"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 0.7, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        → {hoverCaptions[i]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* ── STICKY NOTES ── */}
            {stickyNotes.map((note, i) => (
              <motion.div
                key={i}
                className="sticky-note absolute select-none"
                style={{
                  left: note.x,
                  top: note.y,
                  backgroundColor: note.color,
                  width: note.size === "small" ? 110 : 140,
                  zIndex: 20,
                }}
                initial={{ opacity: 0, x: 40, rotate: 0 }}
                animate={{
                  opacity: assembled ? 1 : 0,
                  x: assembled ? 0 : 40,
                  rotate: note.rotate,
                }}
                transition={{
                  delay: 1.6 + i * 0.12,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  scale: 1.08,
                  rotate: note.rotate * 0.5,
                  transition: { duration: 0.2 },
                }}
              >
                <span className="text-[15px] leading-tight text-[#4a4a40] whitespace-pre-line">
                  {note.text}
                </span>
              </motion.div>
            ))}

            {/* ── PAPER CLIPS ── */}
            <PaperClip x="52%" y="7%" rotate={15} />
            <PaperClip x="28%" y="72%" rotate={-8} />

            {/* ── COFFEE STAIN ── */}
            <motion.div
              className="coffee-stain absolute pointer-events-none"
              style={{
                left: "70%",
                top: "40%",
                width: 90,
                height: 85,
                zIndex: 2,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: assembled ? 1 : 0 }}
              transition={{ delay: 1.0, duration: 1.0 }}
            />

            {/* ── SMALL PENCIL SCRIBBLES ── */}
            <motion.div
              className="absolute pointer-events-none hidden md:block"
              style={{ left: "75%", top: "30%", zIndex: 3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: assembled ? 0.3 : 0 }}
              transition={{ delay: 2.0, duration: 0.6 }}
            >
              <svg width="100" height="40" viewBox="0 0 100 40">
                <motion.path
                  d="M5 20 C20 5 40 35 60 15 C75 0 90 25 95 20"
                  className="sketch-line"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 2.0, duration: 1.0, ease: "easeOut" }}
                />
              </svg>
            </motion.div>

            {/* ── LAYOUT DRAFT SKETCH ── */}
            <motion.div
              className="absolute pointer-events-none hidden lg:block"
              style={{ left: "82%", top: "45%", zIndex: 3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: assembled ? 0.25 : 0 }}
              transition={{ delay: 2.4, duration: 0.6 }}
            >
              <svg width="70" height="90" viewBox="0 0 70 90">
                {/* Grid layout sketch */}
                <motion.rect x="5" y="5" width="60" height="80" rx="2"
                  className="sketch-line" strokeWidth="1"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 2.4, duration: 0.6 }} />
                <motion.line x1="5" y1="35" x2="65" y2="35"
                  className="sketch-line" strokeWidth="0.8"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 2.8, duration: 0.4 }} />
                <motion.line x1="35" y1="35" x2="35" y2="85"
                  className="sketch-line" strokeWidth="0.8"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 3.0, duration: 0.4 }} />
                <motion.rect x="10" y="10" width="50" height="20" rx="1"
                  className="sketch-line" strokeWidth="0.6"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 3.2, duration: 0.3 }} />
              </svg>
              <p className="handwritten text-[9px] text-[#8a7a6a] mt-0.5 opacity-50">layout v2</p>
            </motion.div>

            {/* ── NOTEBOOK (photographer bio) ── */}
            <motion.div
              className="absolute cursor-pointer select-none"
              style={{
                right: "2%",
                bottom: "5%",
                width: 160,
                zIndex: 25,
              }}
              initial={{ opacity: 0, rotate: 8 }}
              animate={{ opacity: assembled ? 1 : 0, rotate: 8 }}
              transition={{ delay: 2.0, duration: 0.6 }}
              onClick={() => setShowNotebook(!showNotebook)}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <div
                className="rounded-sm p-4"
                style={{
                  backgroundColor: "#3a3530",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                <p className="handwritten text-[13px] text-amber-200/80 leading-snug">
                  about me
                </p>
                <div className="w-8 h-[1px] bg-amber-200/20 mt-1 mb-2" />
                <p className="handwritten text-[11px] text-amber-200/50 leading-relaxed">
                  click to read...
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── NOTEBOOK MODAL ── */}
        <AnimatePresence>
          {showNotebook && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotebook(false)}
            >
              <div className="absolute inset-0 bg-black/40" />
              <motion.div
                className="relative rounded-sm p-8 md:p-10 max-w-md mx-4"
                style={{
                  backgroundColor: "#f5f0e6",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  transform: "rotate(-1deg)",
                }}
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 30, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Notebook lines */}
                <div className="absolute inset-0 opacity-[0.06]" style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, #6a7a8a 27px, #6a7a8a 28px)",
                  backgroundPosition: "0 36px",
                }} />
                {/* Red margin line */}
                <div className="absolute top-0 bottom-0 left-10 w-[1px] bg-red-300/20" />

                <div className="relative">
                  <h2 className="handwritten text-3xl text-[#2a2420] mb-4">About the photographer</h2>
                  <div className="handwritten text-lg text-[#5a5040] leading-relaxed space-y-3">
                    <p>
                      I see the world through a viewfinder. Every frame is a story waiting to be told.
                    </p>
                    <p>
                      Based somewhere between airports and coffee shops. Always chasing the light.
                    </p>
                    <p>
                      This desk is where ideas become images. Feel free to explore — nothing here is finished, and that&apos;s the point.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2a2420]/10" />
                    <div>
                      <p className="handwritten text-base text-[#2a2420]">The Photographer</p>
                      <p className="handwritten text-sm text-[#a09080]">always creating</p>
                    </div>
                  </div>
                </div>

                <button
                  className="absolute top-3 right-3 handwritten text-xl text-[#a09080] hover:text-[#2a2420] transition-colors"
                  onClick={() => setShowNotebook(false)}
                >
                  x
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

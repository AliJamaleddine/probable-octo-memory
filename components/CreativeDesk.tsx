"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { BookData } from "@/lib/data";

interface CreativeDeskProps {
  books: BookData[];
}

/*
 * Photo positions — dense central cluster matching the reference image.
 * The reference shows photos tightly packed in the center,
 * overlapping each other like prints spread on a real desk.
 *
 * Positions use % of the central container so they scale with viewport.
 */
const photoConfigs = [
  // Cities — small, left side
  {
    left: "4%", top: "32%", width: "22%", rotate: -4, z: 12,
    aspect: "3/4", tape: "corner-tr" as const, subtitle: "Urban Architectures",
  },
  // Travel — medium, center-left, overlapping cities
  {
    left: "18%", top: "22%", width: "28%", rotate: 2, z: 14,
    aspect: "4/3", tape: "corner-tl" as const, subtitle: "Journeys Across Continents",
  },
  // Portraits — large, dead center, dominant
  {
    left: "34%", top: "15%", width: "26%", rotate: -1.5, z: 16,
    aspect: "3/4", tape: "none" as const, subtitle: "The Human Condition",
  },
  // Landscapes — medium-small, right of center
  {
    left: "54%", top: "28%", width: "22%", rotate: 3.5, z: 13,
    aspect: "4/3", tape: "corner-tr" as const, subtitle: "Silent Horizons",
  },
  // Night — medium, far right
  {
    left: "68%", top: "22%", width: "24%", rotate: -2, z: 15,
    aspect: "3/4", tape: "corner-tl" as const, subtitle: "After Dark",
  },
  // Documentary — bottom center, partially behind others
  {
    left: "22%", top: "54%", width: "25%", rotate: 2.5, z: 11,
    aspect: "3/4", tape: "corner-tr" as const, subtitle: "Stories Untold",
  },
];

// Sticky notes matching the reference
const stickyNotes = [
  {
    left: "1%", top: "6%", rotate: -3, width: 140, color: "#f5e6a3",
    lines: ["IDEAS:", "✓ angles", "✓ lighting", "✓ color", "✓ layout"],
  },
  {
    left: "52%", top: "72%", rotate: 4, width: 160, color: "#f5e6a3",
    lines: ["VISUAL", "STORYTELLING", "", "✓ do moments", "~ do emotions", "✓ do creating"],
  },
];

// Scribbled text scattered around the page
const scribbles = [
  { left: "2%", top: "30%", text: "nuances", rotate: -8, size: 14 },
  { left: "6%", top: "48%", text: "EMOTIONAL\nRETINAL", rotate: 0, size: 11 },
  { left: "1%", top: "62%", text: "contrast\nfocus lighting\ncompositing", rotate: -2, size: 12 },
  { left: "88%", top: "50%", text: "match pace of\nperceiving\ncontext of\nlength", rotate: 2, size: 11 },
  { left: "75%", top: "70%", text: "concept of\ncreating love\nfor moments", rotate: -3, size: 11 },
  { left: "40%", top: "76%", text: "angles & lighting\nlight & composition", rotate: 1, size: 12 },
  { left: "15%", top: "14%", text: "good", rotate: -15, size: 13 },
  { left: "88%", top: "38%", text: "Ye Yengbar\nRetreat", rotate: 5, size: 11 },
];

// Hover captions
const hoverCaptions = [
  "great angles!",
  "keep this one",
  "favorite shot",
  "good composition",
  "strong emotion",
  "print this!",
];

// Tape strip component
function TapeStrip({ position }: { position: "corner-tl" | "corner-tr" | "none" }) {
  if (position === "none") return null;

  const styles: Record<string, React.CSSProperties> = {
    "corner-tl": {
      top: -6, left: -8,
      width: 50, height: 18,
      transform: "rotate(-25deg)",
    },
    "corner-tr": {
      top: -6, right: -8,
      width: 50, height: 18,
      transform: "rotate(20deg)",
    },
  };

  return (
    <div
      className="tape absolute z-20 pointer-events-none"
      style={styles[position]}
    />
  );
}

// Paper clip (blue/silver like the reference)
function PaperClip({ left, top, rotate, color = "#8aaac0" }: {
  left: string; top: string; rotate: number; color?: string;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top, zIndex: 5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ delay: 2.4, duration: 0.5 }}
    >
      <svg width="20" height="52" viewBox="0 0 20 52" style={{ transform: `rotate(${rotate}deg)` }}>
        <path
          d="M10 2 C5 2 2 5 2 10 L2 42 C2 47 5 50 10 50 C15 50 18 47 18 42 L18 14 C18 9 15 6 10 6 C7 6 5 8 5 10 L5 38"
          stroke={color}
          strokeWidth="1.8"
          fill="none"
          style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))" }}
        />
      </svg>
    </motion.div>
  );
}

// Camera doodle (hand-drawn SVG)
function CameraDoodle({ left, top, size = 70 }: { left: string; top: string; size?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top, zIndex: 2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ delay: 2.0, duration: 0.8 }}
    >
      <svg width={size} height={size * 0.7} viewBox="0 0 70 50">
        <motion.path
          d="M8 16 L22 8 L48 8 L62 16 L66 16 L66 42 L4 42 L4 16 Z"
          className="sketch-line"
          strokeWidth="1.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.0, duration: 1.0, ease: "easeInOut" }}
        />
        <motion.circle cx="35" cy="28" r="10" className="sketch-line" strokeWidth="1.4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 2.6, duration: 0.7, ease: "easeInOut" }} />
        <motion.circle cx="35" cy="28" r="5" className="sketch-line" strokeWidth="1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 3.0, duration: 0.5 }} />
        <motion.rect x="25" y="4" width="20" height="5" rx="1" className="sketch-line" strokeWidth="1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 3.2, duration: 0.3 }} />
      </svg>
    </motion.div>
  );
}

// Second camera doodle variant (front view)
function CameraDoodle2({ left, top }: { left: string; top: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top, zIndex: 2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.25 }}
      transition={{ delay: 2.3, duration: 0.8 }}
    >
      <svg width="55" height="55" viewBox="0 0 55 55">
        <motion.circle cx="27" cy="27" r="22" className="sketch-line" strokeWidth="1.3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 2.3, duration: 0.8 }} />
        <motion.circle cx="27" cy="27" r="14" className="sketch-line" strokeWidth="1.1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 2.8, duration: 0.6 }} />
        <motion.circle cx="27" cy="27" r="6" className="sketch-line" strokeWidth="0.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 3.1, duration: 0.4 }} />
        {/* Reflection highlight */}
        <motion.path d="M20 18 Q24 14 32 17" className="sketch-line" strokeWidth="0.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 3.3, duration: 0.3 }} />
      </svg>
    </motion.div>
  );
}

// Pencil lying on desk
function PencilOnDesk() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: "1%", bottom: "12%", zIndex: 6 }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.8, duration: 0.6 }}
    >
      <svg width="200" height="20" viewBox="0 0 200 20" style={{ transform: "rotate(-12deg)" }}>
        {/* Pencil body */}
        <rect x="20" y="5" width="170" height="10" rx="1" fill="#e8b830" opacity="0.85" />
        <rect x="20" y="5" width="170" height="3" rx="1" fill="#d4a520" opacity="0.4" />
        {/* Metal ferrule */}
        <rect x="12" y="4" width="12" height="12" rx="1" fill="#c0b0a0" opacity="0.7" />
        <rect x="14" y="4" width="2" height="12" fill="#a09080" opacity="0.3" />
        {/* Eraser */}
        <rect x="2" y="5" width="12" height="10" rx="2" fill="#e07070" opacity="0.7" />
        {/* Tip */}
        <polygon points="190,5 200,10 190,15" fill="#d4c4a0" opacity="0.7" />
        <polygon points="196,8 200,10 196,12" fill="#3a3530" opacity="0.6" />
      </svg>
    </motion.div>
  );
}

// Crumpled paper ball
function CrumpledPaper({ left, top }: { left: string; top: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top, zIndex: 5 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.8, scale: 1 }}
      transition={{ delay: 2.2, duration: 0.4 }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48">
        <defs>
          <radialGradient id="crumple" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#f0ebe0" />
            <stop offset="60%" stopColor="#ddd5c5" />
            <stop offset="100%" stopColor="#c8bfaf" />
          </radialGradient>
        </defs>
        <ellipse cx="24" cy="26" rx="20" ry="18" fill="url(#crumple)" />
        {/* Crumple lines */}
        <path d="M12 20 Q18 15 24 22 Q30 14 36 21" stroke="#b8af9f" strokeWidth="0.6" fill="none" opacity="0.5" />
        <path d="M14 28 Q20 35 28 26 Q34 32 38 28" stroke="#b8af9f" strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M18 18 Q22 24 20 30" stroke="#c0b8a8" strokeWidth="0.4" fill="none" opacity="0.3" />
        {/* Shadow */}
        <ellipse cx="26" cy="42" rx="14" ry="4" fill="rgba(0,0,0,0.06)" />
      </svg>
    </motion.div>
  );
}

// Color palette swatches (watercolor grid like reference)
function ColorPalette({ left, top }: { left: string; top: string }) {
  const colors = [
    ["#e74c3c", "#e67e22", "#f1c40f"],
    ["#2ecc71", "#3498db", "#9b59b6"],
    ["#1abc9c", "#e84393", "#6c5ce7"],
  ];
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top, zIndex: 6 }}
      initial={{ opacity: 0, rotate: 5 }}
      animate={{ opacity: 0.85, rotate: 5 }}
      transition={{ delay: 2.5, duration: 0.5 }}
    >
      <div className="p-2 rounded-sm" style={{
        backgroundColor: "#f5f0e6",
        boxShadow: "1px 2px 6px rgba(0,0,0,0.1)",
      }}>
        {colors.map((row, ri) => (
          <div key={ri} className="flex gap-1 mb-1">
            {row.map((color, ci) => (
              <div
                key={ci}
                className="rounded-[2px]"
                style={{
                  width: 18, height: 18,
                  backgroundColor: color,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Wireframe layout doodle
function LayoutDoodle({ left, top }: { left: string; top: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top, zIndex: 2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.25 }}
      transition={{ delay: 2.6, duration: 0.6 }}
    >
      <svg width="80" height="100" viewBox="0 0 80 100">
        <motion.rect x="5" y="5" width="70" height="90" rx="2" className="sketch-line" strokeWidth="1.2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.6, duration: 0.6 }} />
        <motion.rect x="10" y="10" width="60" height="20" rx="1" className="sketch-line" strokeWidth="0.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.0, duration: 0.4 }} />
        <motion.line x1="5" y1="38" x2="75" y2="38" className="sketch-line" strokeWidth="0.7"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.2, duration: 0.3 }} />
        <motion.rect x="10" y="44" width="28" height="20" rx="1" className="sketch-line" strokeWidth="0.6"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.4, duration: 0.3 }} />
        <motion.rect x="42" y="44" width="28" height="20" rx="1" className="sketch-line" strokeWidth="0.6"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.5, duration: 0.3 }} />
        <motion.line x1="10" y1="72" x2="55" y2="72" className="sketch-line" strokeWidth="0.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.6, duration: 0.2 }} />
        <motion.line x1="10" y1="78" x2="45" y2="78" className="sketch-line" strokeWidth="0.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.7, duration: 0.2 }} />
        <motion.line x1="10" y1="84" x2="50" y2="84" className="sketch-line" strokeWidth="0.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.8, duration: 0.2 }} />
      </svg>
    </motion.div>
  );
}

// Sketch arrow (hand-drawn)
function SketchArrow({ x1, y1, x2, y2, delay }: {
  x1: string; y1: string; x2: string; y2: string; delay: number;
}) {
  return (
    <motion.svg
      className="absolute pointer-events-none"
      style={{ left: x1, top: y1, zIndex: 3, overflow: "visible" }}
      width="80" height="60" viewBox="0 0 80 60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ delay, duration: 0.6 }}
    >
      <motion.path
        d="M5 30 C20 10 50 50 75 25"
        className="sketch-line" strokeWidth="1.3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
      />
      <motion.path
        d="M68 18 L75 25 L65 28"
        className="sketch-line" strokeWidth="1.3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.3 }}
      />
    </motion.svg>
  );
}

// Lightbulb doodle
function LightbulbDoodle({ left, top }: { left: string; top: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top, zIndex: 2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ delay: 2.1, duration: 0.6 }}
    >
      <svg width="30" height="40" viewBox="0 0 30 40">
        <motion.path d="M15 5 C8 5 3 10 3 17 C3 22 7 25 10 28 L20 28 C23 25 27 22 27 17 C27 10 22 5 15 5Z"
          className="sketch-line" strokeWidth="1.2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 2.1, duration: 0.7 }} />
        <motion.line x1="11" y1="32" x2="19" y2="32" className="sketch-line" strokeWidth="1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.6, duration: 0.2 }} />
        <motion.line x1="12" y1="35" x2="18" y2="35" className="sketch-line" strokeWidth="1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.7, duration: 0.2 }} />
        {/* Rays */}
        {[-45, -20, 0, 20, 45].map((angle, i) => {
          const rad = (angle - 90) * Math.PI / 180;
          const cx = 15, cy = 12;
          return (
            <motion.line key={i}
              x1={cx + 14 * Math.cos(rad)} y1={cy + 14 * Math.sin(rad)}
              x2={cx + 18 * Math.cos(rad)} y2={cy + 18 * Math.sin(rad)}
              className="sketch-line" strokeWidth="0.8"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 2.8 + i * 0.05, duration: 0.15 }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}

// Paper rip transition
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
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: "#ece6da" }}
            initial={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
            animate={{
              clipPath: "polygon(0 0, 52% 3%, 48% 12%, 53% 22%, 47% 32%, 52% 42%, 48% 52%, 53% 62%, 47% 72%, 52% 82%, 48% 92%, 50% 100%, 0 100%)",
              x: "-100%", rotate: -3,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: "#ece6da" }}
            initial={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" }}
            animate={{
              clipPath: "polygon(48% 3%, 100% 0, 100% 100%, 50% 100%, 52% 92%, 47% 82%, 53% 72%, 48% 62%, 52% 52%, 47% 42%, 53% 32%, 48% 22%, 52% 12%)",
              x: "100%", rotate: 3,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, transparent 45%, rgba(0,0,0,0.1) 49%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.1) 51%, transparent 55%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.7, times: [0, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function CreativeDesk({ books }: CreativeDeskProps) {
  const router = useRouter();
  const [assembled, setAssembled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [rippingSlug, setRippingSlug] = useState<string | null>(null);
  const [showNotebook, setShowNotebook] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAssembled(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handlePhotoClick = (slug: string) => {
    if (rippingSlug) return;
    setRippingSlug(slug);
  };

  const handleRipComplete = () => {
    if (rippingSlug) router.push(`/category/${rippingSlug}`);
  };

  return (
    <>
      <PaperRipTransition isActive={!!rippingSlug} onComplete={handleRipComplete} />

      <div className="paper-desk paper-noise min-h-screen relative overflow-hidden">

        {/* Vignette edges */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          boxShadow: "inset 0 0 200px rgba(0,0,0,0.08)",
        }} />

        {/* ══════════ NAVIGATION ══════════ */}
        <motion.nav
          className="absolute top-6 right-8 z-30 flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: assembled ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {["Home", "Projects", "Contact"].map((item) => (
            <span
              key={item}
              className="scribble text-[15px] text-[#5a5040] cursor-pointer hover:text-[#2a2420] transition-colors"
            >
              {item}
            </span>
          ))}
        </motion.nav>

        {/* ══════════ FULL SCENE (viewport-height) ══════════ */}
        <div className="relative w-full" style={{ height: "100vh", minHeight: 700, maxHeight: 1100 }}>

          {/* ── TITLE ── */}
          <motion.div
            className="absolute z-20"
            style={{ left: "22%", top: "4%" }}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: assembled ? 1 : 0, y: assembled ? 0 : -15 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <h1 className="handwritten text-5xl md:text-6xl lg:text-7xl text-[#2a2420] font-semibold" style={{ lineHeight: 1.1 }}>
              A collection of moments...
            </h1>
          </motion.div>

          {/* ── SUBTITLE (faint) ── */}
          <motion.div
            className="absolute z-20 handwritten text-base md:text-lg text-[#9a8a7a]"
            style={{ left: "24%", top: "12%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: assembled ? 0.7 : 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            a visual journal — work in progress
          </motion.div>

          {/* ══════════ BACKGROUND DOODLES & SKETCHES ══════════ */}

          {/* Camera doodles */}
          <CameraDoodle left="78%" top="4%" size={65} />
          <CameraDoodle2 left="86%" top="10%" />

          {/* Lightbulb doodle */}
          <LightbulbDoodle left="13%" top="14%" />

          {/* Layout wireframe doodle */}
          <LayoutDoodle left="86%" top="32%" />

          {/* Sketch arrows */}
          <SketchArrow x1="38%" y1="12%" x2="45%" y2="18%" delay={2.4} />
          <SketchArrow x1="60%" y1="55%" x2="55%" y2="65%" delay={2.7} />
          <SketchArrow x1="12%" y1="42%" x2="18%" y2="38%" delay={2.9} />

          {/* Scribbled hand-drawn circles around ideas */}
          <motion.svg className="absolute pointer-events-none" style={{ left: "72%", top: "7%", zIndex: 2 }}
            width="60" height="40" viewBox="0 0 60 40"
            initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ delay: 2.5, duration: 0.5 }}>
            <motion.ellipse cx="30" cy="20" rx="26" ry="16" className="sketch-line" strokeWidth="1"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.5, duration: 0.7 }} />
          </motion.svg>

          {/* Small star doodle */}
          <motion.div className="absolute pointer-events-none" style={{ left: "83%", top: "55%", zIndex: 2 }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ delay: 3.0, duration: 0.4 }}>
            <svg width="20" height="20" viewBox="0 0 20 20">
              <motion.path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z"
                className="sketch-line" strokeWidth="0.8"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.0, duration: 0.5 }} />
            </svg>
          </motion.div>

          {/* Faint bracket/wireframe lines around margins */}
          <motion.svg className="absolute pointer-events-none" style={{ left: "92%", top: "18%", zIndex: 1 }}
            width="30" height="120" viewBox="0 0 30 120"
            initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ delay: 2.8, duration: 0.5 }}>
            <motion.line x1="5" y1="0" x2="5" y2="120" className="sketch-line" strokeWidth="0.7"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.8, duration: 0.6 }} />
            <motion.line x1="5" y1="0" x2="15" y2="0" className="sketch-line" strokeWidth="0.7"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.0, duration: 0.2 }} />
            <motion.line x1="5" y1="120" x2="15" y2="120" className="sketch-line" strokeWidth="0.7"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.1, duration: 0.2 }} />
          </motion.svg>

          {/* ══════════ DESK OBJECTS ══════════ */}

          {/* Pencil */}
          <PencilOnDesk />

          {/* Crumpled paper ball (top right, like reference) */}
          <CrumpledPaper left="88%" top="2%" />

          {/* Paper clips */}
          <PaperClip left="84%" top="42%" rotate={-15} color="#8aaac0" />
          <PaperClip left="80%" top="45%" rotate={10} color="#8aaac0" />
          <PaperClip left="15%" top="70%" rotate={25} color="#a0a0a0" />

          {/* Color palette swatches */}
          <ColorPalette left="82%" top="72%" />

          {/* Coffee stain */}
          <motion.div
            className="coffee-stain absolute pointer-events-none"
            style={{ left: "72%", top: "58%", width: 60, height: 55, zIndex: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: assembled ? 1 : 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          />

          {/* ══════════ STICKY NOTES ══════════ */}
          {stickyNotes.map((note, i) => (
            <motion.div
              key={i}
              className="sticky-note absolute select-none z-20"
              style={{
                left: note.left,
                top: note.top,
                backgroundColor: note.color,
                width: note.width,
              }}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30, rotate: 0 }}
              animate={{
                opacity: assembled ? 1 : 0,
                x: assembled ? 0 : (i === 0 ? -30 : 30),
                rotate: note.rotate,
              }}
              transition={{
                delay: 1.4 + i * 0.15,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.06, rotate: note.rotate * 0.5, transition: { duration: 0.2 } }}
            >
              {note.lines.map((line, li) => (
                <div
                  key={li}
                  className={`text-[13px] leading-snug text-[#4a4a40] ${li === 0 ? "font-bold text-[15px]" : ""} ${line === "" ? "h-1" : ""}`}
                >
                  {line}
                </div>
              ))}
            </motion.div>
          ))}

          {/* ══════════ HANDWRITTEN SCRIBBLES ══════════ */}
          {scribbles.map((s, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none handwritten select-none"
              style={{
                left: s.left,
                top: s.top,
                fontSize: s.size,
                color: "#7a7060",
                transform: `rotate(${s.rotate}deg)`,
                zIndex: 2,
                whiteSpace: "pre-line",
                lineHeight: 1.3,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: assembled ? 0.4 : 0 }}
              transition={{ delay: 1.8 + i * 0.08, duration: 0.5 }}
            >
              {s.text}
            </motion.div>
          ))}

          {/* Small red square (design accent like reference) */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ left: "6%", top: "8%", width: 10, height: 10, backgroundColor: "#d44", zIndex: 3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: assembled ? 0.7 : 0 }}
            transition={{ delay: 2.0, duration: 0.3 }}
          />

          {/* ══════════ PHOTOS — DENSE CENTRAL CLUSTER ══════════ */}
          {books.map((book, i) => {
            const cfg = photoConfigs[i];
            const isHovered = hoveredIndex === i;
            const isRipping = rippingSlug === book.slug;

            return (
              <motion.div
                key={book.slug}
                className="absolute cursor-pointer"
                style={{
                  left: cfg.left,
                  top: cfg.top,
                  width: cfg.width,
                  zIndex: isHovered ? 50 : cfg.z,
                }}
                initial={{ opacity: 0, y: -50, rotate: 0, scale: 0.92 }}
                animate={{
                  opacity: assembled ? (isRipping ? 0 : 1) : 0,
                  y: assembled ? 0 : -50,
                  rotate: isHovered ? cfg.rotate * 0.2 : cfg.rotate,
                  scale: isHovered ? 1.06 : 1,
                }}
                transition={{
                  opacity: { duration: 0.4 },
                  y: { duration: 0.6, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
                  rotate: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handlePhotoClick(book.slug)}
              >
                <motion.div
                  className="polaroid relative"
                  style={{ padding: "8px 8px 38px 8px" }}
                  animate={{
                    boxShadow: isHovered
                      ? "0 10px 30px rgba(0,0,0,0.18), 0 20px 50px rgba(0,0,0,0.10)"
                      : "0 2px 6px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.08)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <TapeStrip position={cfg.tape} />

                  {/* Photo image */}
                  <div className="overflow-hidden bg-neutral-200 relative" style={{ aspectRatio: cfg.aspect }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={book.images[0]}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out"
                      style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
                      loading="lazy"
                      draggable={false}
                    />
                    {/* Subtitle overlay on photo */}
                    <div className="absolute bottom-0 left-0 right-0 p-2" style={{
                      background: "linear-gradient(transparent, rgba(0,0,0,0.35))",
                    }}>
                      <p className="scribble text-[9px] text-white/70 uppercase tracking-wider">
                        {cfg.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Category name label */}
                  <div className="mt-1.5 px-0.5">
                    <span className="handwritten text-base text-[#2a2420]">
                      {book.title}
                    </span>
                  </div>
                </motion.div>

                {/* Hover scribble */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute -bottom-5 left-3 handwritten text-xs text-[#8a7a6a] whitespace-nowrap pointer-events-none"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 0.7, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      → {hoverCaptions[i]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* ── Small tape scraps (not attached to photos) ── */}
          {[
            { left: "50%", top: "70%", rotate: -35, w: 40 },
            { left: "70%", top: "35%", rotate: 15, w: 35 },
          ].map((t, i) => (
            <motion.div
              key={`tape-${i}`}
              className="tape absolute pointer-events-none"
              style={{
                left: t.left, top: t.top,
                width: t.w, height: 14,
                transform: `rotate(${t.rotate}deg)`,
                zIndex: 4,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: assembled ? 1 : 0 }}
              transition={{ delay: 2.0 + i * 0.2, duration: 0.3 }}
            />
          ))}

          {/* ── Notebook corner (bottom-left) ── */}
          <motion.div
            className="absolute cursor-pointer select-none z-20"
            style={{ left: "2%", bottom: "3%" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: assembled ? 1 : 0, y: assembled ? 0 : 20 }}
            transition={{ delay: 2.0, duration: 0.5 }}
            onClick={() => setShowNotebook(true)}
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
          >
            <div className="p-3 rounded-sm" style={{
              width: 120,
              backgroundColor: "#3a3530",
              boxShadow: "2px 3px 10px rgba(0,0,0,0.2)",
              transform: "rotate(-5deg)",
            }}>
              <p className="handwritten text-[12px] text-amber-200/80">about me</p>
              <div className="w-6 h-[1px] bg-amber-200/20 mt-1 mb-1" />
              <p className="handwritten text-[10px] text-amber-200/40">click to read...</p>
            </div>
          </motion.div>

        </div>

        {/* ══════════ NOTEBOOK MODAL ══════════ */}
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
                }}
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 20, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Notebook lines */}
                <div className="absolute inset-0 opacity-[0.06]" style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, #6a7a8a 27px, #6a7a8a 28px)",
                  backgroundPosition: "0 36px",
                }} />
                <div className="absolute top-0 bottom-0 left-10 w-[1px] bg-red-300/20" />
                <div className="relative">
                  <h2 className="handwritten text-3xl text-[#2a2420] mb-4">About the photographer</h2>
                  <div className="handwritten text-lg text-[#5a5040] leading-relaxed space-y-3">
                    <p>I see the world through a viewfinder. Every frame is a story waiting to be told.</p>
                    <p>Based somewhere between airports and coffee shops. Always chasing the light.</p>
                    <p>This desk is where ideas become images. Feel free to explore — nothing here is finished, and that&apos;s the point.</p>
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
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Book from "./Book";
import LoadingScreen from "./LoadingScreen";
import type { BookData } from "@/lib/data";

interface BookShelfProps {
  books: BookData[];
}

// Deterministic pseudo-random
function sr(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Placement config for each standing book ──
// x, y offsets from center of scene (in scene-space pixels)
interface StandingPlacement {
  x: number;
  y: number;
  rotate: number;
  rotateY: number;
  scale: number;
  zIndex: number;
}

const standingPlacements: StandingPlacement[] = [
  // 0: Travel — large hero, left of center, slight lean left
  { x: -220, y: 10, rotate: -4, rotateY: -10, scale: 1.05, zIndex: 12 },
  // 1: Portraits — large hero, right of center
  { x: 110, y: 25, rotate: 5, rotateY: 7, scale: 1.0, zIndex: 11 },
  // 2: Cities — medium, far left, leaning more
  { x: -480, y: 50, rotate: -11, rotateY: -16, scale: 0.78, zIndex: 6 },
  // 3: Landscapes — medium, between heroes, behind
  { x: -50, y: -30, rotate: 2, rotateY: -4, scale: 0.82, zIndex: 4 },
  // 4: Night — smaller, far right, leaning
  { x: 420, y: 45, rotate: 9, rotateY: 13, scale: 0.74, zIndex: 7 },
  // 5: Documentary — medium, right of portraits
  { x: 320, y: -10, rotate: 7, rotateY: 9, scale: 0.8, zIndex: 5 },
];

// ── Flat books lying on the "table" surface ──
interface FlatPlacement {
  bookIndex: number;
  imageIndex: number;
  x: number;
  y: number;
  rotate: number;
  width: number;
  height: number;
  zIndex: number;
}

const flatPlacements: FlatPlacement[] = [
  { bookIndex: 3, imageIndex: 2, x: -350, y: 240, rotate: -20, width: 170, height: 230, zIndex: 3 },
  { bookIndex: 0, imageIndex: 3, x: -290, y: 260, rotate: -8, width: 160, height: 215, zIndex: 2 },
  { bookIndex: 4, imageIndex: 1, x: 280, y: 260, rotate: 14, width: 155, height: 210, zIndex: 3 },
];

// ── Scattered photo cards / prints ──
interface PhotoCardPlacement {
  bookIndex: number;
  imageIndex: number;
  x: number;
  y: number;
  rotate: number;
  width: number;
  height: number;
  label: string;
  zIndex: number;
}

const photoCardPlacements: PhotoCardPlacement[] = [
  { bookIndex: 0, imageIndex: 4, x: -520, y: 200, rotate: -28, width: 110, height: 80, label: "Dusk", zIndex: 2 },
  { bookIndex: 1, imageIndex: 3, x: 500, y: 180, rotate: 22, width: 100, height: 130, label: "Portrait IV", zIndex: 2 },
  { bookIndex: 2, imageIndex: 2, x: 60, y: 300, rotate: -6, width: 130, height: 90, label: "Urban", zIndex: 2 },
  { bookIndex: 5, imageIndex: 2, x: -140, y: 290, rotate: 11, width: 105, height: 140, label: "Stories", zIndex: 2 },
  { bookIndex: 4, imageIndex: 3, x: 460, y: 300, rotate: -15, width: 95, height: 70, label: "Midnight", zIndex: 1 },
];

export default function BookShelf({ books }: BookShelfProps) {
  const [showLoading, setShowLoading] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneScale, setSceneScale] = useState(1);

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
    setTimeout(() => setSceneReady(true), 200);
  }, []);

  // Responsive scaling — fit the 1200×700 scene to the viewport
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sx = vw / 1300;
      const sy = (vh - 80) / 800;
      setSceneScale(Math.min(sx, sy, 1.15));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <>
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div
        className="min-h-screen flex flex-col overflow-hidden relative"
        style={{ backgroundColor: "#f0e8da" }}
      >
        {/* ═══ WARM AMBIENT LIGHTING LAYERS ═══ */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Warm golden radial from upper-left — desk lamp feel */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 15%, rgba(255,220,160,0.18) 0%, transparent 55%)",
            }}
          />
          {/* Subtle warm center spot */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 45%, rgba(255,235,200,0.10) 0%, transparent 50%)",
            }}
          />
          {/* Soft vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(30,20,10,0.08) 100%)",
            }}
          />
          {/* Very subtle warm color wash */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, rgba(200,170,120,0.04) 0%, transparent 40%, rgba(180,150,100,0.03) 100%)",
            }}
          />
        </div>

        {/* ═══ HEADER ═══ */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-10 md:px-14 py-8 md:py-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: sceneReady ? 1 : 0, y: sceneReady ? 0 : -20 }}
          transition={{ duration: 1.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-[10px] tracking-[0.6em] uppercase text-neutral-500/70">
            Photography Collection
          </h1>
          <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-400/50">
            Select a Volume
          </span>
        </motion.header>

        {/* ═══ MAIN SCENE ═══ */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen relative z-[1]">
          {/* Title — floats above the chaos */}
          <motion.div
            className="text-center mb-8 md:mb-12 relative z-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: sceneReady ? 1 : 0,
              y: sceneReady ? 0 : 50,
            }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[8px] tracking-[0.8em] uppercase text-neutral-400/60 mb-4">
              The Library
            </p>
            <h2
              className="text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-none"
              style={{ color: "rgba(60, 45, 30, 0.75)" }}
            >
              Photography
            </h2>
            <div
              className="w-14 h-[1px] mx-auto mt-6"
              style={{ backgroundColor: "rgba(160, 140, 110, 0.25)" }}
            />
          </motion.div>

          {/* ═══ THE CHAOTIC LIBRARY SCENE ═══ */}
          <div
            className="relative"
            style={{
              width: 1200,
              height: 650,
              transform: `scale(${sceneScale})`,
              transformOrigin: "center center",
            }}
          >
            {/* Table surface shadow — implied surface */}
            <motion.div
              className="absolute"
              style={{
                left: -100,
                right: -100,
                bottom: -20,
                height: 380,
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(120,90,50,0.03) 30%, rgba(100,75,40,0.06) 70%, rgba(80,60,30,0.04) 100%)",
                borderRadius: "50% 50% 0 0 / 20% 20% 0 0",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: sceneReady ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />

            {/* ── FLAT BOOKS (lying on table) ── */}
            {sceneReady &&
              flatPlacements.map((fp, i) => (
                <motion.div
                  key={`flat-${i}`}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `calc(50% + ${fp.x}px)`,
                    top: `calc(50% + ${fp.y}px)`,
                    width: fp.width,
                    height: fp.height,
                    zIndex: fp.zIndex,
                    transform: `translate(-50%, -50%) rotate(${fp.rotate}deg)`,
                  }}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.8 + i * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    scale: 1.06,
                    y: -5,
                    transition: { duration: 0.4 },
                  }}
                >
                  {/* Book shadow */}
                  <div
                    className="absolute -bottom-2 left-1 right-1 h-4 rounded-full"
                    style={{
                      background: "rgba(60, 40, 20, 0.15)",
                      filter: "blur(6px)",
                    }}
                  />
                  {/* Cover */}
                  <div
                    className="relative w-full h-full rounded-[2px] overflow-hidden"
                    style={{
                      boxShadow:
                        "0 2px 8px rgba(40, 25, 10, 0.2), 0 1px 3px rgba(40, 25, 10, 0.15)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={books[fp.bookIndex].images[fp.imageIndex]}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                    {/* Title on cover */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white/70 text-[8px] tracking-[0.2em] uppercase">
                        {books[fp.bookIndex].title}
                      </p>
                    </div>
                    {/* Thickness edge — bottom */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[4px]"
                      style={{
                        background:
                          "linear-gradient(to bottom, #e8e2d8, #d8d0c4)",
                      }}
                    />
                    {/* Hover light */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500" />
                  </div>
                </motion.div>
              ))}

            {/* ── PHOTO CARDS (scattered prints) ── */}
            {sceneReady &&
              photoCardPlacements.map((pc, i) => (
                <motion.div
                  key={`card-${i}`}
                  className="absolute cursor-default group"
                  style={{
                    left: `calc(50% + ${pc.x}px)`,
                    top: `calc(50% + ${pc.y}px)`,
                    width: pc.width,
                    height: pc.height,
                    zIndex: pc.zIndex,
                    transform: `translate(-50%, -50%) rotate(${pc.rotate}deg)`,
                  }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 1.2 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    scale: 1.08,
                    rotate: pc.rotate * 0.5,
                    transition: { duration: 0.4 },
                  }}
                >
                  {/* Card shadow */}
                  <div
                    className="absolute -bottom-1 left-1 right-1 h-3 rounded-full"
                    style={{
                      background: "rgba(60, 40, 20, 0.10)",
                      filter: "blur(4px)",
                    }}
                  />
                  {/* Photo print */}
                  <div
                    className="relative w-full h-full overflow-hidden"
                    style={{
                      borderRadius: 1,
                      boxShadow:
                        "0 1px 4px rgba(40, 25, 10, 0.15), 0 0.5px 1px rgba(40, 25, 10, 0.1)",
                    }}
                  >
                    {/* White border — like a printed photo */}
                    <div className="absolute inset-0 bg-white p-[3px]">
                      <div className="w-full h-full overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={books[pc.bookIndex].images[pc.imageIndex]}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    {/* Semi-transparent label */}
                    <div
                      className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-[3px]"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.75)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <span className="text-[6px] tracking-[0.3em] uppercase text-neutral-500">
                        {pc.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

            {/* ── STANDING 3D BOOKS ── */}
            {sceneReady &&
              standingPlacements.map((pl, i) => (
                <div
                  key={books[i].slug}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${pl.x}px)`,
                    top: `calc(50% + ${pl.y}px)`,
                    transform: `translate(-50%, -100%) scale(${pl.scale}) rotate(${pl.rotate}deg)`,
                    zIndex: pl.zIndex,
                  }}
                >
                  <Book
                    book={books[i]}
                    index={i}
                    initialRotateY={pl.rotateY}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <motion.footer
          className="fixed bottom-0 left-0 right-0 flex items-center justify-center py-8 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: sceneReady ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <span
            className="text-[7px] tracking-[0.7em] uppercase"
            style={{ color: "rgba(120, 100, 70, 0.35)" }}
          >
            {books.length} Volumes &middot; A Collection
          </span>
        </motion.footer>
      </div>
    </>
  );
}

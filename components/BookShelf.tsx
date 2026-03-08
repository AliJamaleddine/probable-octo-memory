"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import LoadingScreen from "./LoadingScreen";
import type { BookData } from "@/lib/data";

interface BookShelfProps {
  books: BookData[];
}

// ── Per-print styling: aspect ratio, rotation, horizontal nudge ──
interface PrintConfig {
  bookIndex: number;
  aspect: string;
  rotate: number;
  offsetX: number;
}

// Three columns, two prints each. Pairing landscape + portrait per column
// creates natural height variation → organic masonry stagger.
const columnsLayout: PrintConfig[][] = [
  [
    { bookIndex: 0, aspect: "4/3", rotate: -2.1, offsetX: 5 }, // Travel
    { bookIndex: 3, aspect: "3/4", rotate: 1.9, offsetX: -6 }, // Landscapes
  ],
  [
    { bookIndex: 1, aspect: "3/4", rotate: 1.4, offsetX: -3 }, // Portraits
    { bookIndex: 4, aspect: "16/10", rotate: -2.6, offsetX: 4 }, // Night
  ],
  [
    { bookIndex: 2, aspect: "4/3", rotate: -0.7, offsetX: 0 }, // Cities
    { bookIndex: 5, aspect: "3/4", rotate: 0.5, offsetX: -5 }, // Documentary
  ],
];

// Responsive column-top padding (Tailwind classes, lg-only)
const columnPadClasses = [
  "", // col 1 — flush
  "lg:pt-10", // col 2 — 40px stagger
  "lg:pt-5", // col 3 — 20px stagger
];

export default function BookShelf({ books }: BookShelfProps) {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [openingSlug, setOpeningSlug] = useState<string | null>(null);

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
    setTimeout(() => setSceneReady(true), 200);
  }, []);

  const handlePrintClick = (slug: string) => {
    if (openingSlug) return;
    setOpeningSlug(slug);
    setTimeout(() => router.push(`/category/${slug}`), 700);
  };

  // Stagger index across all prints (counts 0-5 across all columns)
  let staggerIdx = 0;

  return (
    <>
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div
        className="min-h-screen relative"
        style={{ backgroundColor: "#f7f3ee" }}
      >
        {/* Warm ambient surface light */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 25% 18%, rgba(255,228,175,0.10) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 72% 78%, rgba(218,198,168,0.06) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-[1] max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-20">
          {/* ── Title ── */}
          <motion.div
            className="text-center mb-14 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: sceneReady ? 1 : 0,
              y: sceneReady ? 0 : 30,
            }}
            transition={{
              duration: 1,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="text-[9px] tracking-[0.7em] uppercase text-neutral-400/50 mb-4">
              A Collection
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-neutral-700 tracking-tight">
              Photography
            </h1>
            <div className="w-12 h-[1px] bg-neutral-300/30 mx-auto mt-6" />
          </motion.div>

          {/* ── Photo prints — 3-column masonry ── */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-7">
            {columnsLayout.map((column, colIdx) => (
              <div
                key={colIdx}
                className={`flex-1 flex flex-col gap-5 lg:gap-7 ${columnPadClasses[colIdx]}`}
              >
                {column.map((config) => {
                  const book = books[config.bookIndex];
                  const idx = staggerIdx++;
                  const isOpening = openingSlug === book.slug;

                  return (
                    <motion.div
                      key={book.slug}
                      className="relative group"
                      style={{
                        zIndex: isOpening ? 50 : 1,
                        marginLeft: config.offsetX,
                      }}
                      initial={{ opacity: 0, y: 40, rotate: 0 }}
                      animate={{
                        opacity: sceneReady ? 1 : 0,
                        y: sceneReady ? (isOpening ? -8 : 0) : 40,
                        rotate: isOpening
                          ? 0
                          : sceneReady
                            ? config.rotate
                            : 0,
                        scale: isOpening ? 1.03 : 1,
                      }}
                      transition={{
                        duration: 0.9,
                        delay: sceneReady ? 0.1 + idx * 0.09 : 0,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={
                        !openingSlug
                          ? {
                              y: -6,
                              rotate: config.rotate * 0.25,
                              scale: 1.015,
                              transition: {
                                duration: 0.45,
                                ease: [0.22, 1, 0.36, 1],
                              },
                            }
                          : undefined
                      }
                      onClick={() => handlePrintClick(book.slug)}
                    >
                      {/* The printed photograph */}
                      <div
                        className="bg-white p-3 md:p-4 cursor-pointer transition-shadow duration-500
                          shadow-[0_2px_14px_rgba(0,0,0,0.05),0_1px_4px_rgba(0,0,0,0.03)]
                          group-hover:shadow-[0_10px_32px_rgba(0,0,0,0.10),0_3px_10px_rgba(0,0,0,0.04)]"
                      >
                        {/* Photo area */}
                        <div
                          className="overflow-hidden bg-neutral-100"
                          style={{ aspectRatio: config.aspect }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={book.images[0]}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>

                        {/* Label underneath — like pencil notes on a print */}
                        <div className="mt-2.5 md:mt-3 px-[2px] flex items-baseline justify-between">
                          <span className="text-[12px] md:text-[13px] text-neutral-600 tracking-wide font-light">
                            {book.title}
                          </span>
                          <span className="text-[7px] md:text-[8px] text-neutral-300 tracking-[0.2em] uppercase">
                            {book.images.length} photos
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* ── Footer ── */}
          <motion.div
            className="text-center mt-16 md:mt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: sceneReady ? 1 : 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="w-6 h-[1px] bg-neutral-300/20 mx-auto mb-4" />
            <span className="text-[7px] tracking-[0.7em] uppercase text-neutral-400/30">
              {books.length} Collections
            </span>
          </motion.div>
        </div>

        {/* Click-to-navigate overlay */}
        <AnimatePresence>
          {openingSlug && (
            <motion.div
              className="fixed inset-0 z-40"
              style={{ backgroundColor: "#f7f3ee" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

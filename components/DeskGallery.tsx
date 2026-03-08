"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageViewer from "./ImageViewer";

interface DeskGalleryProps {
  images: string[];
  title: string;
}

// Deterministic pseudo-random
function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Thumbtack colors
const pinColors = [
  "radial-gradient(circle at 40% 35%, #ff6b6b 0%, #e53e3e 50%, #c53030 100%)",
  "radial-gradient(circle at 40% 35%, #48bb78 0%, #38a169 50%, #2f855a 100%)",
  "radial-gradient(circle at 40% 35%, #4299e1 0%, #3182ce 50%, #2b6cb0 100%)",
  "radial-gradient(circle at 40% 35%, #ed8936 0%, #dd6b20 50%, #c05621 100%)",
  "radial-gradient(circle at 40% 35%, #9f7aea 0%, #805ad5 50%, #6b46c1 100%)",
];

// Generate organic positions for photos on cork board
function generatePositions(count: number) {
  const positions: Array<{
    x: number;
    y: number;
    rotate: number;
    width: number;
    aspect: string;
    pinColor: string;
    pinOffset: { x: number; y: number };
  }> = [];

  // Use a grid-ish approach but with randomness
  const cols = 3;
  const cellWidth = 100 / cols;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const s = seeded(i * 7 + 13);
    const s2 = seeded(i * 11 + 37);
    const s3 = seeded(i * 19 + 53);

    positions.push({
      x: col * cellWidth + 2 + s * (cellWidth - 20),
      y: row * 320 + 20 + s2 * 40,
      rotate: (s3 - 0.5) * 8,
      width: 240 + s * 80,
      aspect: s > 0.5 ? "4/3" : "3/4",
      pinColor: pinColors[i % pinColors.length],
      pinOffset: {
        x: 30 + s2 * (s > 0.5 ? 180 : 120),
        y: -6,
      },
    });
  }

  return positions;
}

// Scribble notes on the back of photos
const backNotes = [
  "Shot at sunrise\nf/2.8 · 1/500s",
  "Lucky moment!\nKeep this one",
  "Needs more contrast\nin post",
  "My favorite from\nthe whole trip",
  "Experimental shot\nunexpected result",
  "Golden hour magic\nno filter needed",
  "Candid moment\npure emotion",
  "Second attempt\nmuch better!",
];

export default function DeskGallery({ images, title }: DeskGalleryProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const positions = useRef(generatePositions(images.length)).current;

  const openViewer = (index: number) => {
    if (flippedIndex === index) return;
    setCurrentIndex(index);
    setViewerOpen(true);
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleFlip = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  return (
    <>
      <div className="cork-board min-h-screen relative overflow-hidden">
        {/* Cork board frame shadow */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.2), inset 0 2px 4px rgba(0,0,0,0.1)",
        }} />

        {/* Cork texture overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='6' height='6' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Title area */}
        <motion.div
          className="relative z-20 text-center pt-8 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="handwritten text-4xl md:text-5xl text-[#f5f0e6] drop-shadow-lg">
            {title}
          </h1>
          <p className="handwritten text-lg text-[#d4c4a4] mt-1">
            {images.length} photographs pinned here
          </p>
        </motion.div>

        {/* Photos on cork board */}
        <div
          className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 pb-20"
          style={{ minHeight: `${Math.ceil(images.length / 3) * 340 + 100}px` }}
        >
          {images.map((image, i) => {
            const pos = positions[i];
            const isFlipped = flippedIndex === i;

            return (
              <motion.div
                key={i}
                className="absolute cursor-pointer"
                style={{
                  left: `${pos.x}%`,
                  top: pos.y,
                  width: pos.width,
                  maxWidth: "38vw",
                  zIndex: isFlipped ? 50 : 10,
                  perspective: "600px",
                }}
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: pos.rotate,
                }}
                transition={{
                  delay: 0.1 + i * 0.08,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  scale: 1.04,
                  rotate: pos.rotate * 0.3,
                  zIndex: 40,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Thumbtack */}
                <div
                  className="absolute z-30"
                  style={{
                    left: pos.pinOffset.x,
                    top: pos.pinOffset.y,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: pos.pinColor,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.3)",
                  }}
                />

                {/* Photo card (flippable) */}
                <motion.div
                  className="relative"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front: the photo */}
                  <div
                    className="polaroid relative"
                    style={{
                      padding: "8px 8px 36px 8px",
                      backfaceVisibility: "hidden",
                    }}
                    onClick={() => openViewer(i)}
                  >
                    <div className="overflow-hidden bg-neutral-200" style={{ aspectRatio: pos.aspect }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                    <div className="mt-1.5 px-1 flex justify-between items-baseline">
                      <span className="handwritten text-sm text-[#5a5040]">
                        #{String(i + 1).padStart(2, "0")}
                      </span>
                      <button
                        className="handwritten text-xs text-[#a09080] hover:text-[#5a5040] transition-colors"
                        onClick={(e) => handleFlip(e, i)}
                      >
                        flip →
                      </button>
                    </div>
                  </div>

                  {/* Back: notes */}
                  <div
                    className="absolute inset-0 rounded-sm p-5"
                    style={{
                      backgroundColor: "#f5f0e6",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    onClick={(e) => handleFlip(e, i)}
                  >
                    {/* Ruled lines */}
                    <div className="absolute inset-0 opacity-[0.06]" style={{
                      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, #7a8a9a 23px, #7a8a9a 24px)",
                      backgroundPosition: "0 16px",
                    }} />
                    <div className="relative">
                      <p className="handwritten text-xl text-[#2a2420] mb-3">
                        Notes
                      </p>
                      <p className="handwritten text-base text-[#5a5040] whitespace-pre-line leading-relaxed">
                        {backNotes[i % backNotes.length]}
                      </p>
                      <p className="handwritten text-xs text-[#a09080] mt-4">
                        ← flip back
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Sticky note on cork board */}
        <motion.div
          className="sticky-note fixed bottom-6 right-6 z-30 select-none"
          style={{
            backgroundColor: "#fef3c7",
            width: 130,
            transform: "rotate(5deg)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <span className="text-[14px] text-[#4a4a40]">
            click a photo to zoom, or flip it!
          </span>
        </motion.div>
      </div>

      <ImageViewer
        images={images}
        currentIndex={currentIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}

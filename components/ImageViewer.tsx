"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { imageViewerVariants } from "@/lib/animations";

interface ImageViewerProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ImageViewer({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: ImageViewerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "ArrowLeft":
          onPrev();
          break;
      }
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 z-10 text-white/40 hover:text-white/80 transition-colors duration-300"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-8 left-8 z-10">
            <span className="text-white/30 text-[11px] tracking-[0.3em] font-light">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </span>
          </div>

          {/* Previous button */}
          <button
            onClick={onPrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-4 text-white/20 hover:text-white/60 transition-colors duration-300"
          >
            <svg
              width="20"
              height="40"
              viewBox="0 0 20 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <polyline points="16,4 4,20 16,36" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={onNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-4 text-white/20 hover:text-white/60 transition-colors duration-300"
          >
            <svg
              width="20"
              height="40"
              viewBox="0 0 20 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <polyline points="4,4 16,20 4,36" />
            </svg>
          </button>

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="relative max-w-[85vw] max-h-[85vh]"
              variants={imageViewerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[currentIndex]}
                alt=""
                className="max-w-full max-h-[85vh] object-contain"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Esc hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <span className="text-white/15 text-[9px] tracking-[0.4em] uppercase">
              Press ESC to close
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

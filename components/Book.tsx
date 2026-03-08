"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { BookData } from "@/lib/data";

interface BookProps {
  book: BookData;
  index: number;
}

export default function Book({ book, index }: BookProps) {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
  };

  const spineWidth = 28;
  const bookWidth = 220;
  const bookHeight = 320;

  return (
    <>
      {/* Book on shelf */}
      <motion.div
        className="relative cursor-pointer flex-shrink-0"
        style={{
          perspective: 1200,
          width: bookWidth,
          height: bookHeight,
        }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: index * 0.12,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            y: isHovered ? -16 : 0,
            rotateY: isHovered ? -6 : 0,
            rotateX: isHovered ? 3 : 0,
            scale: isHovered ? 1.03 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Front cover */}
          <div
            className="absolute inset-0 rounded-r-sm overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
              transform: `translateZ(${spineWidth / 2}px)`,
            }}
          >
            {/* Cover background */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: book.coverColor }}
            />
            {/* Cover image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{
                backgroundImage: `url(${book.images[0]})`,
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Light reflection on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0"
              animate={{
                background: isHovered
                  ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 60%)",
              }}
              transition={{ duration: 0.5 }}
            />
            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white font-light tracking-[0.2em] uppercase text-xs">
                {book.subtitle}
              </h3>
              <h2 className="text-white font-light text-2xl mt-1 tracking-wide">
                {book.title}
              </h2>
            </div>
          </div>

          {/* Spine */}
          <div
            className="absolute top-0 left-0 h-full flex items-center justify-center"
            style={{
              width: spineWidth,
              backgroundColor: book.coverColor,
              transform: `rotateY(-90deg) translateZ(0px) translateX(-${spineWidth / 2}px)`,
              transformOrigin: "left",
              backfaceVisibility: "hidden",
            }}
          >
            <span
              className="text-white/70 text-[9px] tracking-[0.3em] uppercase whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
              }}
            >
              {book.title}
            </span>
          </div>

          {/* Bottom edge */}
          <div
            className="absolute bottom-0 left-0 w-full"
            style={{
              height: spineWidth,
              backgroundColor: "#f5f0eb",
              transform: `rotateX(90deg) translateZ(${spineWidth / 2}px) translateY(${spineWidth / 2}px)`,
              transformOrigin: "bottom",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Shadow */}
          <motion.div
            className="absolute -bottom-4 left-2 right-2 h-8 rounded-full"
            style={{ filter: "blur(12px)" }}
            animate={{
              backgroundColor: isHovered
                ? "rgba(0,0,0,0.3)"
                : "rgba(0,0,0,0.12)",
              scaleX: isHovered ? 1.1 : 1,
              y: isHovered ? 8 : 0,
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </motion.div>
      </motion.div>

      {/* Book opening overlay */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ backgroundColor: "rgba(255,255,255,0)" }}
            animate={{ backgroundColor: "rgba(255,255,255,1)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Opening book animation */}
            <motion.div
              className="relative"
              style={{
                perspective: 2000,
                width: 500,
                height: 680,
              }}
              initial={{ scale: 0.4, y: 0 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Back cover (visible after flip) */}
                <div
                  className="absolute inset-0 rounded-l-sm"
                  style={{
                    backgroundColor: book.coverColor,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                />

                {/* Inside page */}
                <motion.div
                  className="absolute inset-0 bg-[#faf8f5] flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="text-center">
                    <motion.p
                      className="text-[11px] tracking-[0.4em] uppercase text-neutral-400 mb-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                    >
                      {book.subtitle}
                    </motion.p>
                    <motion.h1
                      className="text-5xl font-light tracking-wide text-neutral-900"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.6 }}
                    >
                      {book.title}
                    </motion.h1>
                  </div>
                </motion.div>

                {/* Front cover (flips open) */}
                <motion.div
                  className="absolute inset-0 rounded-r-sm overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                  }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: -160 }}
                  transition={{
                    duration: 1.4,
                    delay: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  onAnimationComplete={() => {
                    router.push(`/category/${book.slug}`);
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: book.coverColor }}
                  />
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{
                      backgroundImage: `url(${book.images[0]})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-white/70 text-xs tracking-[0.3em] uppercase">
                      {book.subtitle}
                    </p>
                    <h2 className="text-white text-4xl font-light mt-2 tracking-wide">
                      {book.title}
                    </h2>
                  </div>
                  {/* Back of cover */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      backgroundColor: "#f0ebe5",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

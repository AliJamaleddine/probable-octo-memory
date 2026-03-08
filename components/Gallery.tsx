"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import ImageViewer from "./ImageViewer";

interface GalleryProps {
  images: string[];
  title: string;
}

// Editorial asymmetric layout patterns
const layoutPatterns = [
  // Pattern 1: Large left, small right
  [
    { colSpan: "col-span-7", aspectRatio: "aspect-[4/3]" },
    { colSpan: "col-span-5", aspectRatio: "aspect-[3/4]" },
  ],
  // Pattern 2: Small left, large right
  [
    { colSpan: "col-span-4", aspectRatio: "aspect-[3/4]" },
    { colSpan: "col-span-8", aspectRatio: "aspect-[16/9]" },
  ],
  // Pattern 3: Full width
  [{ colSpan: "col-span-12", aspectRatio: "aspect-[21/9]" }],
  // Pattern 4: Three columns
  [
    { colSpan: "col-span-4", aspectRatio: "aspect-[3/4]" },
    { colSpan: "col-span-4", aspectRatio: "aspect-square" },
    { colSpan: "col-span-4", aspectRatio: "aspect-[3/4]" },
  ],
];

export default function Gallery({ images, title }: GalleryProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setViewerOpen(true);
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Distribute images across layout patterns
  const layoutItems: { image: string; imageIndex: number; colSpan: string; aspectRatio: string }[] = [];
  let imageIdx = 0;
  let patternIdx = 0;

  while (imageIdx < images.length) {
    const pattern = layoutPatterns[patternIdx % layoutPatterns.length];
    for (const slot of pattern) {
      if (imageIdx >= images.length) break;
      layoutItems.push({
        image: images[imageIdx],
        imageIndex: imageIdx,
        colSpan: slot.colSpan,
        aspectRatio: slot.aspectRatio,
      });
      imageIdx++;
    }
    patternIdx++;
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6 px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
        {/* Section title */}
        <motion.div
          className="col-span-12 text-center py-12 md:py-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-[9px] tracking-[0.6em] uppercase text-neutral-300 mb-3">
            Volume
          </p>
          <h2 className="text-4xl md:text-5xl font-extralight text-neutral-800 tracking-wide">
            {title}
          </h2>
          <div className="w-8 h-[1px] bg-neutral-200 mx-auto mt-6" />
        </motion.div>

        {/* Images */}
        {layoutItems.map((item, i) => (
          <motion.div
            key={i}
            className={`${item.colSpan} cursor-pointer group`}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div
              className={`${item.aspectRatio} relative overflow-hidden bg-neutral-100`}
              onClick={() => openViewer(item.imageIndex)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </div>
          </motion.div>
        ))}

        {/* End marker */}
        <motion.div
          className="col-span-12 text-center py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="w-6 h-[1px] bg-neutral-200 mx-auto mb-4" />
          <p className="text-[9px] tracking-[0.5em] uppercase text-neutral-300">
            {images.length} Photographs
          </p>
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

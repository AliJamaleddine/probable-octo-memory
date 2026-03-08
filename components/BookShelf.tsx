"use client";

import { motion } from "framer-motion";
import Book from "./Book";
import type { BookData } from "@/lib/data";

interface BookShelfProps {
  books: BookData[];
}

export default function BookShelf({ books }: BookShelfProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] overflow-hidden">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-12 py-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-[10px] tracking-[0.6em] uppercase text-neutral-400">
          Photography Collection
        </h1>
        <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-300">
          Select a Volume
        </span>
      </motion.header>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Title */}
        <motion.div
          className="text-center mb-24 md:mb-32"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[9px] tracking-[0.7em] uppercase text-neutral-300 mb-5">
            The Library
          </p>
          <h2 className="text-7xl md:text-8xl lg:text-9xl font-extralight text-neutral-800 tracking-tight leading-none">
            Photography
          </h2>
          <div className="w-16 h-[1px] bg-neutral-200 mx-auto mt-8" />
        </motion.div>

        {/* Books display */}
        <div className="w-full max-w-[1600px] mx-auto relative">
          {/* Books row */}
          <div
            className="flex items-end justify-center gap-16 md:gap-20 lg:gap-28 px-8 pb-6 overflow-x-auto scrollbar-hide"
            style={{
              perspective: 1800,
              perspectiveOrigin: "50% 40%",
            }}
          >
            {books.map((book, index) => (
              <Book key={book.slug} book={book} index={index} />
            ))}
          </div>

          {/* Shelf — minimal gallery plinth style */}
          <motion.div
            className="relative mx-auto max-w-[1500px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {/* Top surface with subtle highlight */}
            <div
              className="h-[3px] mx-12"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(0,0,0,0.06), transparent)",
              }}
            />
            {/* Thin shelf line */}
            <div
              className="h-[1px] mx-10"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(0,0,0,0.08), transparent)",
              }}
            />
            {/* Shadow below shelf */}
            <div
              className="h-16 mx-16"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.03), transparent)",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 flex items-center justify-center py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span className="text-[8px] tracking-[0.6em] uppercase text-neutral-300">
          {books.length} Volumes
        </span>
      </motion.footer>
    </div>
  );
}

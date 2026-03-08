"use client";

import { motion } from "framer-motion";
import Book from "./Book";
import type { BookData } from "@/lib/data";

interface BookShelfProps {
  books: BookData[];
}

export default function BookShelf({ books }: BookShelfProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8f5] overflow-hidden">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-10 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div>
          <h1 className="text-[11px] tracking-[0.5em] uppercase text-neutral-400">
            Photography Collection
          </h1>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-300">
            Select a Volume
          </span>
        </div>
      </motion.header>

      {/* Main title */}
      <motion.div
        className="text-center mb-20 relative z-[1]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p className="text-[10px] tracking-[0.6em] uppercase text-neutral-300 mb-4">
          The Library
        </p>
        <h2 className="text-6xl md:text-7xl font-extralight text-neutral-800 tracking-tight">
          Photography
        </h2>
        <div className="w-12 h-[1px] bg-neutral-200 mx-auto mt-6" />
      </motion.div>

      {/* Bookshelf */}
      <div className="w-full relative">
        {/* Books container */}
        <div
          className="flex items-end justify-center gap-10 md:gap-14 px-10 pb-4 overflow-x-auto scrollbar-hide"
          style={{
            perspective: 1000,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {books.map((book, index) => (
            <Book key={book.slug} book={book} index={index} />
          ))}
        </div>

        {/* Shelf surface */}
        <motion.div
          className="relative mx-auto"
          style={{ maxWidth: 1400 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {/* Shelf top */}
          <div
            className="h-[6px] mx-8 rounded-sm"
            style={{
              background:
                "linear-gradient(to bottom, #d4c9bc, #c4b8aa)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
          {/* Shelf front face */}
          <div
            className="h-[18px] mx-6"
            style={{
              background:
                "linear-gradient(to bottom, #c4b8aa, #b8a99a)",
              borderRadius: "0 0 2px 2px",
            }}
          />
          {/* Shelf shadow */}
          <div
            className="h-6 mx-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.06), transparent)",
            }}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 flex items-center justify-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <span className="text-[9px] tracking-[0.5em] uppercase text-neutral-300">
          {books.length} Volumes
        </span>
      </motion.footer>
    </div>
  );
}

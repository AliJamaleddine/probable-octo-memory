"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Gallery from "@/components/Gallery";
import type { BookData } from "@/lib/data";

interface CategoryPageClientProps {
  book: BookData;
}

export default function CategoryPageClient({ book }: CategoryPageClientProps) {
  const router = useRouter();

  return (
    <motion.div
      className="min-h-screen bg-[#faf8f5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 bg-[#faf8f5]/80 backdrop-blur-sm">
        {/* Back to library */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3 group"
        >
          <svg
            width="20"
            height="12"
            viewBox="0 0 20 12"
            fill="none"
            className="text-neutral-300 group-hover:text-neutral-600 transition-colors duration-300"
          >
            <path
              d="M20 6H2M2 6L7 1M2 6L7 11"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </svg>
          <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-300 group-hover:text-neutral-600 transition-colors duration-300">
            Library
          </span>
        </button>

        {/* Category title */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-[11px] tracking-[0.5em] uppercase text-neutral-400">
            {book.title}
          </h1>
        </div>

        {/* Subtitle */}
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-300 hidden md:block">
          {book.subtitle}
        </span>
      </nav>

      {/* Gallery content */}
      <div className="pt-24">
        <Gallery images={book.images} title={book.title} />
      </div>
    </motion.div>
  );
}

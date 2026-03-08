"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DeskGallery from "@/components/DeskGallery";
import type { BookData } from "@/lib/data";

interface CategoryPageClientProps {
  book: BookData;
}

export default function CategoryPageClient({ book }: CategoryPageClientProps) {
  const router = useRouter();

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-8 py-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 group"
        >
          <div
            className="rounded-sm px-3 py-1.5"
            style={{
              backgroundColor: "rgba(245, 240, 230, 0.9)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            }}
          >
            <span className="handwritten text-base text-[#5a5040] group-hover:text-[#2a2420] transition-colors">
              ← back to desk
            </span>
          </div>
        </button>
      </nav>

      {/* Gallery content */}
      <div className="pt-14">
        <DeskGallery images={book.images} title={book.title} />
      </div>
    </motion.div>
  );
}

import { notFound } from "next/navigation";
import { books, getBookBySlug } from "@/lib/data";
import CategoryPageClient from "@/components/CategoryPageClient";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return <CategoryPageClient book={book} />;
}

import BookShelf from "@/components/BookShelf";
import { books } from "@/lib/data";

export default function HomePage() {
  return <BookShelf books={books} />;
}

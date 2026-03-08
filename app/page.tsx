import CreativeDesk from "@/components/CreativeDesk";
import { books } from "@/lib/data";

export default function HomePage() {
  return <CreativeDesk books={books} />;
}

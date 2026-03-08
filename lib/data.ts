export interface BookData {
  slug: string;
  title: string;
  subtitle: string;
  coverColor: string;
  images: string[];
}

export const books: BookData[] = [
  {
    slug: "travel",
    title: "Travel",
    subtitle: "Journeys Across Continents",
    coverColor: "#2c2c2c",
    images: [
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&q=80",
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80",
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80",
    ],
  },
  {
    slug: "portraits",
    title: "Portraits",
    subtitle: "The Human Condition",
    coverColor: "#1a1a2e",
    images: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=1200&q=80",
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=1200&q=80",
    ],
  },
  {
    slug: "cities",
    title: "Cities",
    subtitle: "Urban Architectures",
    coverColor: "#0f0f0f",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80",
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1200&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80",
      "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?w=1200&q=80",
    ],
  },
  {
    slug: "landscapes",
    title: "Landscapes",
    subtitle: "Silent Horizons",
    coverColor: "#1b2a1b",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80",
      "https://images.unsplash.com/photo-1465056836900-8f1e940f2114?w=1200&q=80",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80",
      "https://images.unsplash.com/photo-1518173946687-a1e5f3606ef0?w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    ],
  },
  {
    slug: "night",
    title: "Night",
    subtitle: "After Dark",
    coverColor: "#0a0a1a",
    images: [
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1200&q=80",
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200&q=80",
      "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=1200&q=80",
      "https://images.unsplash.com/photo-1532978379173-523e16f371f2?w=1200&q=80",
      "https://images.unsplash.com/photo-1513628253939-010e64ac66cd?w=1200&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
      "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=1200&q=80",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80",
    ],
  },
  {
    slug: "documentary",
    title: "Documentary",
    subtitle: "Stories Untold",
    coverColor: "#2a1f1f",
    images: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80",
      "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200&q=80",
      "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1200&q=80",
      "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&q=80",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&q=80",
      "https://images.unsplash.com/photo-1516655855035-d5215bcb5604?w=1200&q=80",
    ],
  },
];

export function getBookBySlug(slug: string): BookData | undefined {
  return books.find((b) => b.slug === slug);
}

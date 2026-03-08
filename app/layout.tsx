import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photography — A Collection",
  description:
    "A minimalist photography portfolio presented as a digital library of photographic monographs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photography — Creative Desk",
  description:
    "An interactive creative desk portfolio — explore the workspace of a photographer, full of sketches, notes, and photographic prints.",
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

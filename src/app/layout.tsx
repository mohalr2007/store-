import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "COD Store — Achetez en toute confiance",
  description: "Boutique en ligne COD ERP. Parcourez nos produits et commandez en quelques clics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

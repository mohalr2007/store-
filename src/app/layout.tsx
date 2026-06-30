import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Toaster } from "sonner";
import { KeyboardNavigation } from "@/components/keyboard-navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "AL CARTEL SHOP DZ — تسوق بثقة",
  description: "أفضل بوتيك في الجزائر. تشكيلات حصرية مع الدفع عند الاستلام في جميع الولايات.",
  icons: {
    icon: "/favicon.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <KeyboardNavigation />
        <CartProvider>{children}</CartProvider>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}

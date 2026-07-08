import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Toaster } from "sonner";
import { KeyboardNavigation } from "@/components/keyboard-navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MetaPixel } from "@/components/MetaPixel";

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
      <head />
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        {/* Inline theme script using next/script to avoid React script tag warning */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('ac-theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}",
          }}
        />
        <MetaPixel />
        <KeyboardNavigation />
        <ThemeProvider>
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}

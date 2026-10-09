import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CompareTray } from "@/components/CompareTray";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Threads & Tradition — Wear the moment. Return the memory.",
    template: "%s · Threads & Tradition",
  },
  description: "Rent Himachali traditional wear: Kullvi pattu and dhatu, Gaddi chola and luanchari, Kinnauri dohru and thepang, Kullu topis, shawls and Pahari silver for weddings, melas and nati.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CompareTray />
        <Toaster />
      </body>
    </html>
  );
}

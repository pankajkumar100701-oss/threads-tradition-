import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogueRoute } from "@/components/Catalogue";

export const metadata: Metadata = {
  title: "Outfits",
  description: "Rent Himachali traditional wear: pattu, chola, luanchari, koti, dohru, topi and silver. Filter by size, colour, occasion and date.",
};

export default function OutfitsPage() {
  return (
    <Suspense fallback={<div className="shell min-h-screen pt-40" />}>
      <CatalogueRoute />
    </Suspense>
  );
}

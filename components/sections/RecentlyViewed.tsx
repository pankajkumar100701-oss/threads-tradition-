"use client";

import { getProduct } from "@/lib/data";
import { useRente } from "@/lib/store";
import { ProductCard } from "../ProductCard";

export function RecentlyViewed({ exclude, title = "Recently Viewed" }: { exclude?: string; title?: string }) {
  const { recent } = useRente();
  const list = recent
    .filter((s) => s !== exclude)
    .map(getProduct)
    .filter((p) => p !== undefined)
    .slice(0, 4);
  if (!list.length) return null;
  return (
    <section className="shell py-16">
      <p className="eyebrow mb-8 text-gold">{title}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { inr } from "@/lib/rental";
import { rente, useRente } from "@/lib/store";
import { ProductVisual } from "./ui/ProductVisual";
import { StatusBadge, Tag } from "./ui/StatusBadge";
import { CompareIcon, EyeIcon, HeartIcon } from "./ui/Icons";
import { toast } from "./ui/Toaster";
import { QuickView } from "./QuickView";

export function ProductCard({ product, sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw", priority }: { product: Product; sizes?: string; priority?: boolean }) {
  const { wishlist, compare } = useRente();
  const [quick, setQuick] = useState(false);
  const saved = wishlist.includes(product.slug);
  const comparing = compare.includes(product.slug);

  return (
    <article className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <Link href={`/outfits/${product.slug}`} aria-label={product.name} className="absolute inset-0">
          <ProductVisual product={product} sizes={sizes} priority={priority} className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
            <ProductVisual product={product} view="Detail" sizes={sizes} />
          </div>
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.trending && <Tag dark>Trending</Tag>}
          {product.isNew && <Tag>New</Tag>}
          <StatusBadge status={product.status} />
        </div>

        <button
          onClick={() => {
            rente.toggleWishlist(product.slug);
            toast(saved ? "Removed from wishlist" : "Saved to wishlist", saved ? undefined : { href: "/wishlist", cta: "View" });
          }}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full backdrop-blur transition ${saved ? "bg-wine text-paper" : "bg-paper/80 text-ink hover:bg-paper"}`}
        >
          <HeartIcon size={18} filled={saved} />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-500 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button onClick={() => setQuick(true)} className="glass flex h-10 flex-1 items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
            <EyeIcon size={16} /> Quick View
          </button>
          <button
            onClick={() => {
              const ok = rente.toggleCompare(product.slug);
              if (!ok) toast("You can compare up to 3 outfits", { href: "/compare", cta: "Compare" });
            }}
            aria-label={comparing ? "Remove from compare" : "Add to compare"}
            aria-pressed={comparing}
            title="Compare"
            className={`grid h-10 w-10 place-items-center transition ${comparing ? "bg-ink text-paper" : "glass text-ink"}`}
          >
            <CompareIcon size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[1.35rem] leading-tight">
            <Link href={`/outfits/${product.slug}`} className="link-u">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
            {product.category} · {product.colour}
          </p>
        </div>
        <p className="shrink-0 text-right text-sm">
          <span className="font-semibold">{inr(product.price)}</span>
          <span className="block text-[11px] text-muted">/ 2 Days</span>
        </p>
      </div>

      {quick && <QuickView product={product} open onClose={() => setQuick(false)} />}
    </article>
  );
}

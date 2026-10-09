import type { Product } from "@/lib/data";
import type { Shot } from "@/lib/images";
import { LookFigure } from "../home/LookFigure";
import { Photo } from "./Photo";

export const VIEWS = ["Front", "Back", "Detail", "Close-up"] as const;
export type View = (typeof VIEWS)[number];

/** Detail and Close-up use extra photographs when we have them, otherwise closer crops of the main photo. */
export function viewShot(p: Product, view: View): Shot | null {
  const base = p.shot;
  switch (view) {
    case "Detail":
      return p.gallery?.[0] ?? (base ? { ...base, zoom: 2.2, fy: (base.fy ?? 0.4) + 0.05 } : null);
    case "Close-up":
      return p.gallery?.[1] ?? (base ? { ...base, zoom: 1.4, fy: (base.fy ?? 0.4) - 0.05 } : null);
    case "Back":
      return base ? { ...base, flip: true } : null;
    default:
      return base ?? null;
  }
}

/**
 * A product's picture. Garments we can't photograph on their own yet are drawn as an illustration in the
 * outfit's colours; their Detail and Close-up views still show real photographs of the cloth or silver.
 */
export function ProductVisual({
  product,
  view = "Front",
  ar = "3:4",
  sizes,
  priority,
  className = "",
}: {
  product: Product;
  view?: View;
  ar?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const shot = viewShot(product, view);
  if (shot && !(product.figure && (view === "Front" || view === "Back"))) {
    return <Photo shot={shot} alt={`${product.name}, ${view.toLowerCase()} view`} ar={ar} sizes={sizes} priority={priority} className={className} />;
  }
  const f = product.figure;
  if (!f) return <span className="absolute inset-0 bg-sand" />;
  return (
    <span className={`@container absolute inset-0 block overflow-hidden bg-gradient-to-b from-sand to-paper ${className}`}>
      <span className="absolute inset-x-0 bottom-0 h-1/3 opacity-60" style={{ background: `linear-gradient(to top, ${product.hex}26, transparent)` }} />
      <span className={`absolute inset-[6%] block ${view === "Back" ? "-scale-x-100" : ""}`}>
        <LookFigure type={f.type} colour={product.hex} accessories={f.accessories} />
      </span>
      <span className="absolute bottom-2 right-2 hidden text-[9px] @[160px]:block font-semibold uppercase tracking-[0.16em] text-muted/70">Illustration</span>
    </span>
  );
}

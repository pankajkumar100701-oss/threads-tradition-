import type { Product } from "@/lib/data";
import type { Shot } from "@/lib/images";
import { Photo } from "./Photo";

export const VIEWS = ["Front", "Back", "Detail", "Model"] as const;
export type View = (typeof VIEWS)[number];

/** Front and Back come from the main photo; Detail and Model use extra photographs when we have them, otherwise closer crops. */
export function viewShot(p: Product, view: View): Shot {
  const base = p.shot;
  switch (view) {
    case "Back":
      return { ...base, flip: true };
    case "Detail":
      return p.gallery?.[0] ?? { ...base, zoom: 2.2, fy: (base.fy ?? 0.4) + 0.05 };
    case "Model":
      return p.gallery?.[1] ?? { ...base, zoom: 1.3, fy: (base.fy ?? 0.4) - 0.05 };
    default:
      return base;
  }
}

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
  return <Photo shot={viewShot(product, view)} alt={`${product.name}, ${view.toLowerCase()} view`} ar={ar} sizes={sizes} priority={priority} className={className} />;
}

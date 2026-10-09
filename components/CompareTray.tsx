"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getProduct } from "@/lib/data";
import { rente, useRente } from "@/lib/store";
import { CloseIcon, CompareIcon } from "./ui/Icons";
import { ProductVisual } from "./ui/ProductVisual";

export function CompareTray() {
  const { compare } = useRente();
  const path = usePathname();
  if (!compare.length || path === "/compare") return null;
  const list = compare.map(getProduct).filter((p) => p !== undefined);

  return (
    <div className="glass animate-rise fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 p-2 pl-3">
      <div className="flex -space-x-3">
        {list.map((p) => (
          <div key={p.slug} className="relative h-12 w-10 overflow-hidden border-2 border-paper bg-sand">
            <ProductVisual product={p} sizes="40px" />
          </div>
        ))}
      </div>
      <Link href="/compare" className="btn-dark h-11 px-4 text-[11px]">
        <CompareIcon size={16} /> Compare {list.length}
      </Link>
      <button onClick={() => rente.clearCompare()} aria-label="Clear compare" className="grid h-11 w-9 place-items-center text-muted hover:text-ink">
        <CloseIcon size={16} />
      </button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { products } from "@/lib/data";
import { inr, searchProducts } from "@/lib/rental";
import { useRente } from "@/lib/store";
import { ArrowIcon, CloseIcon, SearchIcon } from "./ui/Icons";
import { ProductVisual } from "./ui/ProductVisual";

const SUGGESTIONS = ["kullu pattu", "gaddi chola", "pahari bride", "kinnauri", "topi", "nati troupe", "school function", "silver jewellery"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { recent } = useRente();

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const results = q.trim() ? searchProducts(q) : [];
  const recentProducts = recent.map((s) => products.find((p) => p.slug === s)).filter((p) => p !== undefined).slice(0, 4);

  const go = (query: string) => {
    onClose();
    router.push(`/outfits?q=${encodeURIComponent(query)}`);
  };

  return createPortal(
    <div className="fixed inset-0 z-[85] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Search">
      <div className="animate-fade fixed inset-0 bg-ivory/80 backdrop-blur-2xl" onClick={onClose} />
      <div className="shell animate-rise relative pb-16 pt-6">
        <div className="flex justify-end">
          <button onClick={onClose} aria-label="Close search" className="grid h-11 w-11 place-items-center border border-line bg-paper hover:bg-ink hover:text-paper">
            <CloseIcon />
          </button>
        </div>
        <form
          className="mx-auto mt-6 max-w-4xl"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) go(q.trim());
          }}
        >
          <label htmlFor="site-search" className="eyebrow text-muted">
            Search outfits, colours, occasions
          </label>
          <div className="mt-4 flex items-center gap-4 border-b border-ink pb-3">
            <SearchIcon size={28} />
            <input
              ref={input}
              id="site-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="kullu pattu"
              autoComplete="off"
              className="display min-w-0 flex-1 bg-transparent text-4xl outline-none placeholder:text-muted/40 sm:text-6xl"
            />
            {q && (
              <button type="submit" className="btn-dark hidden h-11 sm:inline-flex">
                Search
              </button>
            )}
          </div>
        </form>

        <div className="mx-auto mt-8 max-w-4xl">
          {!q.trim() ? (
            <>
              <p className="eyebrow mb-4 text-muted">Try</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => setQ(s)} className="chip bg-paper/70">
                    {s}
                  </button>
                ))}
              </div>
              {recentProducts.length > 0 && (
                <>
                  <p className="eyebrow mb-4 mt-10 text-muted">Recently viewed</p>
                  <ResultGrid list={recentProducts} onPick={onClose} />
                </>
              )}
            </>
          ) : results.length ? (
            <>
              <div className="mb-4 flex items-baseline justify-between">
                <p className="eyebrow text-muted">
                  {results.length} {results.length === 1 ? "result" : "results"}
                </p>
                <button onClick={() => go(q.trim())} className="link-u flex items-center gap-2 text-sm font-semibold">
                  See all with filters <ArrowIcon size={16} />
                </button>
              </div>
              <ResultGrid list={results.slice(0, 8)} onPick={onClose} />
            </>
          ) : (
            <p className="font-display text-2xl text-muted">Nothing matched “{q}”. Try a colour, a fabric or an occasion.</p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ResultGrid({ list, onPick }: { list: typeof products; onPick: () => void }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
      {list.map((p) => (
        <li key={p.slug}>
          <Link href={`/outfits/${p.slug}`} onClick={onPick} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-sand">
              <ProductVisual product={p} sizes="200px" className="transition duration-700 group-hover:scale-105" />
            </div>
            <p className="mt-2 font-display text-lg leading-tight">{p.name}</p>
            <p className="text-xs text-muted">{inr(p.price)} / 2 Days</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

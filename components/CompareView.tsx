"use client";

import Link from "next/link";
import { getAccessory, getOccasion, getProduct } from "@/lib/data";
import { usePlan } from "@/lib/plan";
import { PERIODS, fmt, inr, isRentable, rentalPrice, rentalWindow } from "@/lib/rental";
import { rente, useHydrated, useRente } from "@/lib/store";
import { ProductVisual } from "./ui/ProductVisual";
import { StatusBadge } from "./ui/StatusBadge";
import { CloseIcon } from "./ui/Icons";
import { Stars } from "./sections/Reviews";

export function CompareView() {
  const { compare } = useRente();
  const hydrated = useHydrated();
  const plan = usePlan();
  const list = compare.map(getProduct).filter((p) => p !== undefined);
  const w = rentalWindow(plan.start, plan.days);

  const rows: [string, (p: (typeof list)[number]) => React.ReactNode][] = [
    ["Price", (p) => PERIODS.map((d) => <div key={d}>{d} days · {inr(rentalPrice(p.price, d))}</div>)],
    ["Rating", (p) => <Stars n={p.rating} />],
    [`Free ${fmt(w.start)}–${fmt(w.end)}`, (p) => (isRentable(p, plan.start, plan.days, plan.today) ? <span className="text-ok">Yes</span> : <span className="text-bad">No</span>)],
    ["Status", (p) => <StatusBadge status={p.status} className="border border-line" />],
    ["Category", (p) => p.category],
    ["Colour", (p) => (
      <span className="flex items-center gap-2">
        <i className="h-4 w-4 rounded-full border border-line" style={{ background: p.hex }} /> {p.colour}
      </span>
    )],
    ["Fit", (p) => p.fit],
    ["Material", (p) => p.material],
    ["Sizes", (p) => p.sizes.join(" · ")],
    ["Style", (p) => p.style],
    ["Occasions", (p) => p.occasions.map((o) => getOccasion(o)?.name).join(", ")],
    ["Pairs with", (p) => p.pairs.map((a) => getAccessory(a)?.name).join(", ")],
  ];

  return (
    <div className="shell pb-24 pt-32 md:pt-40">
      <p className="eyebrow text-gold">Outfit Compare</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">Side by side.</h1>
      {!hydrated ? null : list.length < 2 ? (
        <div className="mt-12 border border-dashed border-line px-6 py-16 text-center">
          <p className="display text-3xl">Add {list.length ? "one more outfit" : "two or three outfits"} to compare.</p>
          <p className="mt-2 text-muted">Use the compare button on any outfit card.</p>
          <Link href="/outfits" className="btn-dark mt-8">
            Browse Outfits
          </Link>
        </div>
      ) : (
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="w-40" />
                {list.map((p) => (
                  <th key={p.slug} className="px-3 pb-6 align-top font-normal">
                    <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                      <ProductVisual product={p} sizes="300px" />
                      <button onClick={() => rente.toggleCompare(p.slug)} aria-label={`Remove ${p.name}`} className="glass absolute right-2 top-2 grid h-9 w-9 place-items-center">
                        <CloseIcon size={16} />
                      </button>
                    </div>
                    <Link href={`/outfits/${p.slug}`} className="mt-3 block font-display text-2xl leading-tight">
                      {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, cell]) => (
                <tr key={label} className="border-t border-line">
                  <th className="eyebrow py-4 pr-4 align-top font-semibold text-muted">{label}</th>
                  {list.map((p) => (
                    <td key={p.slug} className="px-3 py-4 align-top">
                      {cell(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

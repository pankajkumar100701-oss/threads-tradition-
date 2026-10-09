"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/data";
import { downloadReceipt } from "@/lib/receipt";
import { fmt, fmtLong, inr, rentalWindow } from "@/lib/rental";
import { useHydrated, useRente } from "@/lib/store";
import { ProductVisual } from "./ui/ProductVisual";
import { ArrowIcon, CheckIcon, DownloadIcon } from "./ui/Icons";

export function Confirmation() {
  const id = useSearchParams().get("id");
  const { rentals } = useRente();
  const hydrated = useHydrated();
  const r = rentals.find((x) => x.id === id);

  if (!hydrated) return <div className="min-h-screen" />;
  if (!r) {
    return (
      <section className="shell flex min-h-[70vh] flex-col justify-center pt-40">
        <h1 className="display text-5xl">We couldn&apos;t find that booking.</h1>
        <Link href="/account" className="btn-dark mt-8 self-start">
          My Rentals
        </Link>
      </section>
    );
  }

  const first = r.items[0];
  const w = rentalWindow(first.start, first.days);

  return (
    <section className="grain relative overflow-hidden bg-ink text-paper">
      <div className="shell grid min-h-screen items-center gap-14 pb-20 pt-32 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="animate-rise grid h-16 w-16 place-items-center rounded-full border border-gold-soft text-gold-soft">
            <CheckIcon size={28} />
          </span>
          <h1 className="display animate-rise mt-8 text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.92]" style={{ animationDelay: "120ms" }}>
            Your look is <em className="text-gold-soft">reserved.</em>
          </h1>
          <dl className="animate-rise mt-12 grid max-w-xl grid-cols-2 gap-px bg-paper/15" style={{ animationDelay: "240ms" }}>
            {[
              ["Booking ID", r.id],
              ["Rental", `${fmt(w.start)} — ${fmt(w.end)}`],
              [r.fulfilment === "delivery" ? "Delivery" : "Studio pickup", fmtLong(w.delivery)],
              ["Total", inr(r.totals.total)],
            ].map(([k, v]) => (
              <div key={k} className="bg-ink p-5">
                <dt className="eyebrow text-paper/50">{k}</dt>
                <dd className="mt-1 font-display text-3xl">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-paper/60">A confirmation has been sent to you. Your {inr(r.totals.deposit)} deposit is refunded within 48 hours of return.</p>
          <div className="animate-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "360ms" }}>
            <Link href="/account" className="btn-light">
              View Rental <ArrowIcon size={16} />
            </Link>
            <button onClick={() => downloadReceipt(r)} className="btn-line-light">
              <DownloadIcon size={16} /> Download Receipt
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-5">
          {r.items.slice(0, 4).map((it, i) => {
            const p = getProduct(it.slug);
            return p ? (
              <div key={it.key} className={`animate-rise relative aspect-[3/4] overflow-hidden bg-ink-soft ${r.items.length === 1 ? "col-span-2" : ""}`} style={{ animationDelay: `${300 + i * 120}ms` }}>
                <ProductVisual product={p} sizes="(max-width: 1024px) 50vw, 25vw" />
                <span className="glass-dark absolute inset-x-3 bottom-3 px-3 py-2 font-display text-lg">{p.name}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </section>
  );
}

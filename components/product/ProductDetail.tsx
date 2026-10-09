"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEPOSIT, getAccessory, type Product } from "@/lib/data";
import { usePlan } from "@/lib/plan";
import { addDays, availableAlternatives, checkPincode, fmt, fmtLong, heldDates, inr, rentalPrice, rentalWindow, reservedDates, type DeliveryCheck } from "@/lib/rental";
import { rente, useRente } from "@/lib/store";
import { AccessoryIcon } from "../ui/AccessoryIcon";
import { ArrowIcon, CalendarIcon, CheckIcon, ChevronDownIcon, CompareIcon, HeartIcon, PlusIcon, RulerIcon, ShieldIcon, TruckIcon } from "../ui/Icons";
import { ProductVisual, VIEWS, type View } from "../ui/ProductVisual";
import { StatusBadge, Tag } from "../ui/StatusBadge";
import { toast } from "../ui/Toaster";
import { PeriodPicker } from "./PeriodPicker";
import { RentalCalendar } from "./RentalCalendar";
import { SizeFinder } from "./SizeFinder";
import { SizePicker } from "./SizePicker";
import { Stars } from "../sections/Reviews";

export function ProductDetail({ product }: { product: Product }) {
  const plan = usePlan();
  const { wishlist, compare } = useRente();
  const [view, setView] = useState<View>("Front");
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [recommended, setRecommended] = useState<string>();
  const [finder, setFinder] = useState(false);
  const [calendar, setCalendar] = useState(false);
  const [extras, setExtras] = useState<string[]>([]);
  const [showSimilar, setShowSimilar] = useState(false);

  useEffect(() => {
    rente.viewed(product.slug);
  }, [product.slug]);

  const { today, start, days } = plan;
  const w = rentalWindow(start, days);
  const reserved = reservedDates(product, today);
  const held = heldDates(start, days);
  const clash = held.some((d) => reserved.has(d));
  const comingSoon = product.status === "coming-soon";
  const unavailable = clash || comingSoon;
  const price = rentalPrice(product.price, days);
  const accTotal = extras.reduce((s, a) => s + (getAccessory(a)?.price ?? 0), 0);
  const saved = wishlist.includes(product.slug);
  const comparing = compare.includes(product.slug);
  const alternatives = unavailable ? availableAlternatives(product, start, days, today) : [];

  const add = () => {
    rente.addToBag({ slug: product.slug, size, start, days, accessories: extras });
    toast(`${product.name} added to bag`, { href: "/bag", cta: "View bag" });
  };

  return (
    <div className="shell pt-24 md:pt-28">
      <nav aria-label="Breadcrumb" className="py-4 text-xs uppercase tracking-[0.14em] text-muted">
        <Link href="/outfits" className="link-u">
          Outfits
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/outfits?category=${encodeURIComponent(product.category)}`} className="link-u">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* gallery */}
        <div className="lg:col-span-7">
          <div className="flex flex-col-reverse gap-3 md:flex-row">
            <div className="no-scrollbar flex gap-2 overflow-x-auto md:flex-col" role="tablist" aria-label="Views">
              {VIEWS.map((v) => (
                <button
                  key={v}
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={`group shrink-0 text-left transition ${view === v ? "" : "opacity-55 hover:opacity-100"}`}
                >
                  <span className={`relative block aspect-[3/4] w-20 overflow-hidden bg-sand md:w-24 ${view === v ? "ring-1 ring-ink ring-offset-2 ring-offset-ivory" : ""}`}>
                    <ProductVisual product={product} view={v} sizes="96px" />
                  </span>
                  <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em]">{v}</span>
                </button>
              ))}
            </div>
            <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-sand">
              <div key={view} className="animate-fade absolute inset-0">
                <ProductVisual product={product} view={view} sizes="(max-width: 1024px) 100vw, 50vw" priority />
              </div>
              <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
                {product.trending && <Tag dark>Trending</Tag>}
                {product.isNew && <Tag>New</Tag>}
                <StatusBadge status={product.status} />
              </div>
            </div>
          </div>
        </div>

        {/* buy panel */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-gold">
              {product.region} · {product.category}
            </p>
            <h1 className="display mt-3 text-[clamp(2.6rem,4.5vw,3.8rem)] leading-[1]">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <Stars n={product.rating} />
              <span className="text-muted">{product.reviewCount ? `${product.rating.toFixed(1)} · ${product.reviewCount} reviews` : "New, no reviews yet"}</span>
            </div>
            <p className="mt-5 flex items-baseline gap-2">
              <span className="display text-4xl">{inr(price)}</span>
              <span className="text-muted">/ {days} Days</span>
            </p>
            <p className="mt-2 text-sm">
              <span className="text-muted">Retail value {inr(product.retail)} · </span>
              <span className="font-semibold text-ok">You save {Math.round((1 - price / product.retail) * 100)}% by renting</span>
            </p>
            <p className="mt-4 leading-relaxed text-muted">{product.note}</p>

            <div className="mt-8 space-y-7">
              <div>
                <p className="eyebrow mb-3 text-muted">Rental period</p>
                <PeriodPicker base={product.price} days={days} onChange={(d) => rente.setPlan({ days: d })} />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="eyebrow text-muted">Available sizes</p>
                  {product.sizes.length > 1 && (
                    <button onClick={() => setFinder(true)} className="link-u flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
                      <RulerIcon size={16} /> Find My Size
                    </button>
                  )}
                </div>
                <SizePicker sizes={product.sizes} value={size} onChange={setSize} recommended={recommended} />
                {recommended && <p className="mt-2 text-xs text-muted">● Recommended for you: {recommended}</p>}
              </div>

              <div>
                <p className="eyebrow mb-3 text-muted">Dates</p>
                <button onClick={() => setCalendar((v) => !v)} aria-expanded={calendar} className="flex h-14 w-full items-center gap-3 border border-line bg-paper px-4 text-left transition hover:border-ink">
                  <CalendarIcon size={18} />
                  <span className="flex-1 font-medium">
                    {fmt(w.start)} — {fmt(w.end)}
                  </span>
                  <span className="text-xs text-muted">Change</span>
                  <ChevronDownIcon size={16} className={`transition ${calendar ? "rotate-180" : ""}`} />
                </button>
                {calendar && (
                  <div className="animate-fade border border-t-0 border-line bg-paper p-5">
                    <RentalCalendar today={today} start={start} days={days} reserved={reserved} onPick={(d) => rente.setPlan({ start: d })} />
                  </div>
                )}

                <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {held.slice(0, 8).map((d) => {
                    const r = reserved.has(d);
                    return (
                      <li key={d} className={`border px-3 py-2 ${r ? "border-bad/40 bg-bad/5" : "border-line bg-paper"}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em]">{fmt(d)}</p>
                        <p className={`text-[11px] ${r ? "text-bad" : "text-ok"}`}>{r ? "Reserved" : "Available"}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {unavailable && (
                <div className="animate-fade border border-bad/30 bg-bad/5 p-5">
                  <p className="font-display text-2xl">{comingSoon ? "Arriving soon." : "This outfit isn't available for these dates."}</p>
                  <p className="mt-1 text-sm text-muted">{comingSoon ? "Save it to your wishlist and we'll let you know when it's ready." : "Pick different dates above, or try something similar."}</p>
                  <button onClick={() => setShowSimilar((v) => !v)} className="btn-line mt-4 h-10">
                    Find Similar Outfits
                  </button>
                  {showSimilar && (
                    <ul className="mt-4 space-y-2">
                      {alternatives.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/outfits/${p.slug}`} className="flex items-center gap-3 bg-paper p-2 transition hover:bg-sand">
                            <span className="relative h-16 w-12 shrink-0 overflow-hidden bg-sand">
                              <ProductVisual product={p} sizes="48px" />
                            </span>
                            <span className="flex-1">
                              <span className="block font-display text-lg leading-tight">{p.name}</span>
                              <span className="text-xs text-ok">Available {fmt(w.start)} — {fmt(w.end)}</span>
                            </span>
                            <span className="pr-2 text-sm">{inr(rentalPrice(p.price, days))}</span>
                          </Link>
                        </li>
                      ))}
                      {!alternatives.length && <li className="text-sm text-muted">Nothing similar is free on these dates. Try moving them by a day or two.</li>}
                    </ul>
                  )}
                </div>
              )}

              {product.pairs.length > 0 && (
                <div>
                  <p className="eyebrow mb-3 text-muted">Complete the look</p>
                  <div className="grid grid-cols-2 gap-2">
                    {product.pairs.map((slug) => {
                      const a = getAccessory(slug);
                      if (!a) return null;
                      const on = extras.includes(slug);
                      return (
                        <button
                          key={slug}
                          aria-pressed={on}
                          onClick={() => setExtras((x) => (on ? x.filter((y) => y !== slug) : [...x, slug]))}
                          className={`flex items-center gap-3 border p-3 text-left text-sm transition ${on ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink/60"}`}
                        >
                          <AccessoryIcon kind={a.icon} size={26} className={on ? "text-gold-soft" : "text-gold"} />
                          <span className="flex-1">
                            {a.name}
                            <span className={`block text-xs ${on ? "text-paper/60" : "text-muted"}`}>+{inr(a.price)}</span>
                          </span>
                          {on ? <CheckIcon size={14} /> : <PlusIcon size={14} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button className="btn-dark h-14 flex-1" disabled={!size || unavailable} onClick={add}>
                  {!size ? "Select a size" : unavailable ? "Unavailable for these dates" : `Add to Bag · ${inr(price + accTotal)}`}
                </button>
                <button
                  onClick={() => {
                    rente.toggleWishlist(product.slug);
                    toast(saved ? "Removed from wishlist" : "Saved to wishlist");
                  }}
                  aria-pressed={saved}
                  aria-label="Wishlist"
                  className={`grid h-14 w-14 place-items-center border transition ${saved ? "border-wine bg-wine text-paper" : "border-line hover:border-ink"}`}
                >
                  <HeartIcon filled={saved} />
                </button>
                <button
                  onClick={() => {
                    if (!rente.toggleCompare(product.slug)) toast("You can compare up to 3 outfits", { href: "/compare", cta: "Compare" });
                  }}
                  aria-pressed={comparing}
                  aria-label="Compare"
                  className={`grid h-14 w-14 place-items-center border transition ${comparing ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
                >
                  <CompareIcon />
                </button>
              </div>

              <dl className="grid grid-cols-2 gap-px border border-line bg-line text-sm">
                {[
                  ["Fit", product.fit],
                  ["Material", product.material],
                  ["Rental Period", `${days} Days`],
                  ["Colour", product.colour],
                ].map(([k, v]) => (
                  <div key={k} className="bg-paper p-4">
                    <dt className="eyebrow text-muted">{k}</dt>
                    <dd className="mt-1">{v}</dd>
                  </div>
                ))}
              </dl>

              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <TruckIcon size={18} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    Delivered <strong className="font-semibold">{fmtLong(w.delivery)}</strong>, picked up {fmtLong(w.pickup)}.
                  </span>
                </li>
                <li>
                  <PincodeCheck start={start} today={today} />
                </li>
                <li className="flex gap-3">
                  <ShieldIcon size={18} className="mt-0.5 shrink-0 text-gold" />
                  <span>{inr(DEPOSIT)} security deposit, fully refundable. Optional damage protection at checkout.</span>
                </li>
                <li className="flex gap-3">
                  <RulerIcon size={18} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    Want to try it first?{" "}
                    <Link href={`/studio?try=${product.slug}`} className="link-u font-semibold">
                      Book a free studio trial
                    </Link>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <SizeFinder
        open={finder}
        onClose={() => setFinder(false)}
        gender={product.gender === "her" ? "her" : "him"}
        available={product.sizes}
        onUse={(s) => {
          setSize(s);
          setRecommended(s);
        }}
      />
      <NextFree product={product} today={today} days={days} show={unavailable && !comingSoon} start={start} reserved={reserved} />
    </div>
  );
}

function NextFree({ product, today, start, days, show, reserved }: { product: Product; today: string; start: string; days: number; show: boolean; reserved: Set<string> }) {
  if (!show) return null;
  for (let i = 1; i < 60; i++) {
    const s = addDays(start, i);
    if (heldDates(s, days).every((d) => !reserved.has(d)) && s > today) {
      return (
        <div className="glass fixed bottom-4 right-4 z-30 hidden max-w-xs p-4 text-sm lg:block">
          <p className="eyebrow text-muted">Next free window</p>
          <p className="mt-1">
            {product.name} is free from <strong>{fmt(s)}</strong>.
          </p>
          <button onClick={() => rente.setPlan({ start: s })} className="link-u mt-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em]">
            Use these dates <ArrowIcon size={14} />
          </button>
        </div>
      );
    }
  }
  return null;
}

function PincodeCheck({ start, today }: { start: string; today: string }) {
  const [pin, setPin] = useState("");
  const [res, setRes] = useState<DeliveryCheck | null>(null);
  return (
    <div>
      <form
        className="flex border border-line bg-paper focus-within:border-ink"
        onSubmit={(e) => {
          e.preventDefault();
          setRes(checkPincode(pin.trim(), start, today));
        }}
      >
        <label htmlFor="pin" className="sr-only">
          Delivery PIN code
        </label>
        <TruckIcon size={18} className="m-3 shrink-0 text-gold" />
        <input id="pin" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="Check delivery to your PIN code" className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" />
        <button className="px-4 text-xs font-semibold uppercase tracking-[0.14em]">Check</button>
      </form>
      {res && (
        <p className={`mt-2 text-sm ${res.ok ? "text-ok" : "text-bad"}`}>
          {res.zone && <strong className="font-semibold">{res.zone}: </strong>}
          {res.message}
        </p>
      )}
    </div>
  );
}

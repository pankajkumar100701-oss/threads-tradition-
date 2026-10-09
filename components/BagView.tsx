"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DELIVERY_FEE, PROMO_CODES, PROTECTION_FEE, getAccessory, getProduct } from "@/lib/data";
import { PERIODS, addDays, fmt, fmtLong, inr, isRentable, rentalWindow } from "@/lib/rental";
import { computeTotals, itemPrice, rente, useHydrated, useRente, useToday, type BagItem, type Fulfilment } from "@/lib/store";
import { ProductVisual } from "./ui/ProductVisual";
import { ArrowIcon, CloseIcon, ShieldIcon, StoreIcon, TruckIcon } from "./ui/Icons";

export function BagView() {
  const { bag, addresses } = useRente();
  const [choice, setChoice] = useState<string>();
  const hydrated = useHydrated();
  const today = useToday();
  const router = useRouter();
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [address, setAddress] = useState({ name: "", line: "", city: "", pin: "", phone: "" });
  const [editingAddress, setEditingAddress] = useState(false);
  const [protection, setProtection] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<string>();
  const [promoError, setPromoError] = useState("");

  const totals = computeTotals(bag, { fulfilment, protection, promo });
  const blocked = bag.filter((b) => {
    const p = getProduct(b.slug);
    return !p || !isRentable(p, b.start, b.days, today);
  });
  const picked = choice ?? addresses[0] ?? "new";
  const newAddress = `${address.name.trim()}, ${address.line.trim()}, ${address.city.trim()} ${address.pin}`;
  const newAddressOk = !!(address.name.trim() && address.line.trim() && address.city.trim() && /^\d{6}$/.test(address.pin) && /^\d{10}$/.test(address.phone));
  const addressOk = fulfilment === "pickup" || picked !== "new" || newAddressOk;
  const earliest = bag.length ? bag.map((b) => b.start).sort()[0] : null;
  const latestEnd = bag.length ? bag.map((b) => rentalWindow(b.start, b.days).end).sort().at(-1)! : null;

  const checkout = () => {
    if (blocked.length || !addressOk) return;
    const id = rente.placeOrder({
      fulfilment,
      address: fulfilment === "delivery" ? (picked === "new" ? newAddress : picked) : undefined,
      protection,
      promo,
      today,
    });
    if (id) router.push(`/confirmation?id=${id}`);
  };

  if (!hydrated) return <div className="min-h-screen" />;

  if (!bag.length) {
    return (
      <section className="shell flex min-h-[70vh] flex-col items-start justify-center pb-20 pt-40">
        <p className="eyebrow text-gold">Your Rental</p>
        <h1 className="display mt-4 text-6xl sm:text-7xl">Your bag is empty.</h1>
        <p className="mt-4 max-w-md text-muted">Something unforgettable is waiting. Start with an occasion, or let the quiz decide.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/outfits" className="btn-dark">
            Browse Outfits
          </Link>
          <Link href="/quiz" className="btn-line">
            Take the Style Quiz
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="shell pb-24 pt-32 md:pt-40">
      <p className="eyebrow text-gold">Bag</p>
      <h1 className="display mt-3 text-6xl sm:text-7xl">Your Rental</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          <ul className="divide-y divide-line border-y border-line">
            {bag.map((item) => (
              <BagRow key={item.key} item={item} today={today} />
            ))}
          </ul>

          <section>
            <h2 className="display text-4xl">Delivery / Pickup</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Fulfilment">
              {(
                [
                  ["delivery", TruckIcon, "Home Delivery", `${inr(DELIVERY_FEE)} · delivered the day before`],
                  ["pickup", StoreIcon, "Studio Pickup", "Free · The Ridge, Shimla"],
                ] as const
              ).map(([v, Icon, t, d]) => (
                <button key={v} role="radio" aria-checked={fulfilment === v} onClick={() => setFulfilment(v)} className={`flex items-start gap-4 border p-5 text-left transition ${fulfilment === v ? "border-ink bg-paper" : "border-line hover:border-ink/50"}`}>
                  <Icon size={22} className="mt-0.5 text-gold" />
                  <span>
                    <span className="block font-display text-2xl">{t}</span>
                    <span className="text-sm text-muted">{d}</span>
                  </span>
                </button>
              ))}
            </div>

            {fulfilment === "delivery" && (
              <div className="mt-6 border border-line bg-paper p-6">
                <p className="eyebrow text-muted">Delivery address</p>
                <div className="mt-4 space-y-2">
                  {addresses.map((a) => (
                    <label key={a} className={`flex cursor-pointer items-center gap-3 border p-3 text-sm ${picked === a ? "border-ink" : "border-line"}`}>
                      <input type="radio" name="address" checked={picked === a} onChange={() => setChoice(a)} className="accent-[var(--ink)]" />
                      {a}
                    </label>
                  ))}
                  <label className={`flex cursor-pointer items-center gap-3 border p-3 text-sm ${picked === "new" ? "border-ink" : "border-line"}`}>
                    <input type="radio" name="address" checked={picked === "new"} onChange={() => setChoice("new")} className="accent-[var(--ink)]" />
                    Add Address
                  </label>
                </div>
                {picked !== "new" ? null : newAddressOk && !editingAddress ? (
                  <p className="mt-4">
                    {address.name}
                    <br />
                    {address.line}, {address.city} {address.pin}
                    <br />
                    <span className="text-muted">+91 {address.phone}</span>
                    <button onClick={() => setEditingAddress(true)} className="link-u ml-3 text-xs font-semibold uppercase tracking-[0.14em]">
                      Edit
                    </button>
                  </p>
                ) : (
                  <form
                    className="mt-4 grid gap-3 sm:grid-cols-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newAddressOk) setEditingAddress(false);
                    }}
                  >
                    {(
                      [
                        ["name", "Full name", "sm:col-span-2", "text"],
                        ["line", "House, street, area", "sm:col-span-2", "text"],
                        ["city", "City", "", "text"],
                        ["pin", "PIN code (6 digits)", "", "text"],
                        ["phone", "Mobile (10 digits)", "sm:col-span-2", "tel"],
                      ] as const
                    ).map(([k, label, span, type]) => (
                      <label key={k} className={span}>
                        <span className="sr-only">{label}</span>
                        <input
                          type={type}
                          inputMode={k === "pin" || k === "phone" ? "numeric" : undefined}
                          maxLength={k === "pin" ? 6 : k === "phone" ? 10 : undefined}
                          placeholder={label}
                          value={address[k]}
                          onChange={(e) => setAddress({ ...address, [k]: k === "pin" || k === "phone" ? e.target.value.replace(/\D/g, "") : e.target.value })}
                          className="field"
                          required
                        />
                      </label>
                    ))}
                    <button className="btn-line sm:col-span-2" disabled={!newAddressOk}>
                      Use This Address
                    </button>
                  </form>
                )}
              </div>
            )}

            {earliest && latestEnd && (
              <dl className="mt-6 grid grid-cols-2 gap-px border border-line bg-line">
                <div className="bg-paper p-5">
                  <dt className="eyebrow text-muted">{fulfilment === "delivery" ? "Delivery date" : "Pickup from studio"}</dt>
                  <dd className="mt-1 font-display text-2xl">{fmtLong(rentalWindow(earliest, 0).delivery)}</dd>
                </div>
                <div className="bg-paper p-5">
                  <dt className="eyebrow text-muted">Return date</dt>
                  <dd className="mt-1 font-display text-2xl">{fmtLong(rentalWindow(latestEnd, 0).pickup)}</dd>
                </div>
              </dl>
            )}
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="glass sticky top-28 p-6 sm:p-8">
            <h2 className="display text-4xl">Rental Summary</h2>
            <dl className="mt-6 space-y-3 text-[15px]">
              <Row k={bag.length > 1 ? `Outfits (${bag.length})` : "Outfit"} v={inr(totals.outfits)} />
              <Row k="Accessories" v={inr(totals.accessories)} />
              {totals.lookSavings > 0 && <Row k="Complete-look saving" v={`−${inr(totals.lookSavings)}`} accent />}
              {totals.discount > 0 && <Row k={`Promo ${promo}`} v={`−${inr(totals.discount)}`} accent />}
              <Row k="Delivery" v={totals.delivery ? inr(totals.delivery) : "Free"} />
              {protection && <Row k="Rental Protection" v={inr(totals.protection)} />}
              <Row k="Security Deposit" v={inr(totals.deposit)} />
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t border-ink pt-5">
              <span className="eyebrow">Total</span>
              <span className="display text-4xl">{inr(totals.total)}</span>
            </div>
            <p className="mt-3 flex items-center gap-2 bg-ok/10 px-3 py-2 text-sm text-ok">
              <ShieldIcon size={16} /> {inr(totals.deposit)} Security Deposit — Refundable
            </p>

            <label className="mt-6 flex cursor-pointer items-start gap-3 border border-line bg-paper/60 p-4 text-sm">
              <input type="checkbox" checked={protection} onChange={(e) => setProtection(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--ink)]" />
              <span>
                <span className="font-semibold">Add Rental Protection</span> · {inr(PROTECTION_FEE)} per outfit
                <span className="block text-muted">Covers accidental damage up to ₹5,000. Spills and tears won&apos;t touch your deposit.</span>
              </span>
            </label>

            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const code = promoInput.trim().toUpperCase();
                const min = PROMO_CODES[code]?.minItems ?? 1;
                if (PROMO_CODES[code] && bag.length < min) {
                  setPromoError(`${code} needs at least ${min} outfits in your bag.`);
                } else if (PROMO_CODES[code]) {
                  setPromo(code);
                  setPromoError("");
                } else {
                  setPromoError("That code isn't valid.");
                }
              }}
            >
              <label htmlFor="promo" className="sr-only">
                Promo code
              </label>
              <input id="promo" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Promo code (try FIRSTLOOK10)" className="field h-11 uppercase placeholder:normal-case" />
              <button className="btn-line h-11 px-4">Apply</button>
            </form>
            {promo && (
              <p className="mt-2 flex items-center justify-between text-sm text-ok">
                {PROMO_CODES[promo].label} applied.
                <button
                  type="button"
                  onClick={() => {
                    setPromo(undefined);
                    setPromoInput("");
                  }}
                  className="link-u text-xs font-semibold uppercase tracking-[0.14em] text-muted"
                >
                  Remove
                </button>
              </p>
            )}
            {promoError && <p className="mt-2 text-sm text-bad">{promoError}</p>}

            {blocked.length > 0 && <p className="mt-4 text-sm text-bad">Some outfits aren&apos;t available for the dates chosen. Change the dates or remove them to continue.</p>}
            <button className="btn-dark mt-6 h-14 w-full" disabled={!addressOk || blocked.length > 0} onClick={checkout}>
              {addressOk ? (
                <>
                  Reserve My Look <ArrowIcon size={16} />
                </>
              ) : (
                "Add a delivery address"
              )}
            </button>
            <p className="mt-3 text-center text-xs text-muted">Demo checkout. No payment is taken.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className={`flex justify-between ${accent ? "text-ok" : ""}`}>
      <dt className={accent ? "" : "text-muted"}>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function BagRow({ item, today }: { item: BagItem; today: string }) {
  const p = getProduct(item.slug);
  if (!p) return null;
  const w = rentalWindow(item.start, item.days);
  const price = itemPrice(item);
  const ok = isRentable(p, item.start, item.days, today);
  return (
    <li className="flex gap-5 py-6">
      <Link href={`/outfits/${p.slug}`} className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden bg-sand sm:w-36">
        <ProductVisual product={p} sizes="144px" priority />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {item.look && <p className="eyebrow mb-1 text-gold">{item.look}</p>}
            <Link href={`/outfits/${p.slug}`} className="font-display text-2xl leading-tight sm:text-3xl">
              {p.name}
            </Link>
            <p className="mt-1 text-sm text-muted">
              Size {item.size} · {fmt(w.start)} → {fmt(w.end)}
            </p>
          </div>
          <button onClick={() => rente.removeFromBag(item.key)} aria-label={`Remove ${p.name}`} className="grid h-9 w-9 shrink-0 place-items-center text-muted hover:text-ink">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <label htmlFor={`days-${item.key}`} className="sr-only">
            Rental period
          </label>
          <select id={`days-${item.key}`} value={item.days} onChange={(e) => rente.updateBagItem(item.key, { days: Number(e.target.value) })} className="h-9 border border-line bg-paper px-2 text-sm">
            {PERIODS.map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
          </select>
          <label htmlFor={`start-${item.key}`} className="sr-only">
            Start date
          </label>
          <input id={`start-${item.key}`} type="date" value={item.start} min={addDays(today, 1)} onChange={(e) => e.target.value && rente.updateBagItem(item.key, { start: e.target.value })} className="h-9 border border-line bg-paper px-2 text-sm" />
          {!ok && <span className="text-xs text-bad">Not available for these dates</span>}
        </div>

        {item.accessories.length > 0 && (
          <div className="mt-4">
            <p className="eyebrow text-muted">Accessories</p>
            <ul className="mt-1 text-sm">
              {item.accessories.map((a) => {
                const x = getAccessory(a);
                return x ? (
                  <li key={a} className="flex justify-between py-0.5">
                    <span>{x.name}</span>
                    <span>{inr(x.price)}</span>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}
        <p className="mt-auto flex justify-between pt-4 text-sm">
          <span className="text-muted">Outfit, {item.days} days</span>
          <span className="font-semibold">{inr(price.outfit)}</span>
        </p>
      </div>
    </li>
  );
}

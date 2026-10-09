"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getProduct, products } from "@/lib/data";
import { addDays, fmt, fmtLong, ymd } from "@/lib/rental";
import { rente, useHydrated, useRente, useToday } from "@/lib/store";
import { ProductVisual } from "./ui/ProductVisual";
import { ArrowIcon, CheckIcon, StoreIcon } from "./ui/Icons";

export const STUDIOS = [
  { key: "shimla", name: "Shimla", address: "The Ridge, Mall Road", hours: "Tue–Sun · 11am–8pm" },
  { key: "manali", name: "Manali", address: "Old Manali Road", hours: "Tue–Sun · 11am–7pm" },
  { key: "chandigarh", name: "Chandigarh", address: "SCO 21, Sector 17", hours: "Daily · 11am–8pm" },
];
const SLOTS = ["11:00", "12:30", "14:00", "15:30", "17:00", "18:30"];

/** Deterministic "already booked" slots so the grid looks lived-in. */
const taken = (studio: string, date: string, slot: string) => {
  let h = 0;
  for (const c of studio + date + slot) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 4 === 0;
};

export function StudioBooking() {
  const params = useSearchParams();
  const today = useToday();
  const hydrated = useHydrated();
  const { wishlist, profile } = useRente();
  const initial = params.get("try");
  const [studio, setStudio] = useState(STUDIOS[0].key);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [picked, setPicked] = useState<string[]>(initial && getProduct(initial) ? [initial] : []);
  const [name, setName] = useState(profile.name === "Guest" ? "" : profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [people, setPeople] = useState(2);
  const [done, setDone] = useState<string | null>(null);

  const days = Array.from({ length: 14 }, (_, k) => addDays(today, k + 1)).filter((d) => studio === "chandigarh" || new Date(d + "T00:00:00Z").getUTCDay() !== 1);
  const candidates = Array.from(new Set([...picked, ...wishlist, "pahari-dulha-set", "pahari-dulhan-set", "kinnauri-dohru-set", "kullvi-pattu-set", "gaddi-chola-dora-set"]))
    .map(getProduct)
    .filter((p): p is NonNullable<typeof p> => p !== undefined && p.status !== "coming-soon")
    .slice(0, 10);
  const valid = date && time && picked.length > 0 && name.trim().length > 1 && /^\d{10}$/.test(phone);
  const s = STUDIOS.find((x) => x.key === studio)!;

  if (done) {
    return (
      <section className="shell py-20">
        <div className="mx-auto max-w-2xl border border-ink bg-paper p-8 text-center sm:p-12">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink text-paper">
            <CheckIcon />
          </span>
          <h2 className="display mt-6 text-5xl">Your trial is booked.</h2>
          <p className="mt-3 text-muted">
            {s.name} studio · {fmtLong(date)} at {time} · {people} {people === 1 ? "person" : "people"}
          </p>
          <p className="mt-1 text-sm text-muted">Booking {done}. We&apos;ll keep {picked.length} {picked.length === 1 ? "outfit" : "outfits"} steamed and ready.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/account" className="btn-dark">
              View in My Rentals
            </Link>
            <Link href="/outfits" className="btn-line">
              Keep browsing
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="shell grid gap-12 py-20 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-8">
        <Step n={1} title="Choose a studio">
          <div className="grid gap-3 sm:grid-cols-3">
            {STUDIOS.map((x) => (
              <button key={x.key} onClick={() => setStudio(x.key)} aria-pressed={studio === x.key} className={`border p-5 text-left transition ${studio === x.key ? "border-ink bg-paper" : "border-line hover:border-ink/50"}`}>
                <StoreIcon size={20} className="text-gold" />
                <span className="mt-3 block font-display text-2xl">{x.name}</span>
                <span className="block text-sm text-muted">{x.address}</span>
                <span className="mt-1 block text-xs text-muted">{x.hours}</span>
              </button>
            ))}
          </div>
        </Step>

        <Step n={2} title="Pick a day and time">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {hydrated &&
              days.map((d) => {
                const { d: day } = ymd(d);
                const wk = new Date(d + "T00:00:00Z").toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" });
                return (
                  <button key={d} onClick={() => { setDate(d); setTime(""); }} aria-pressed={date === d} className={`flex h-20 w-16 shrink-0 flex-col items-center justify-center border transition ${date === d ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink/50"}`}>
                    <span className="text-[10px] uppercase tracking-[0.14em] opacity-70">{wk}</span>
                    <span className="font-display text-2xl">{day}</span>
                    <span className="text-[10px] opacity-70">{fmt(d).split(" ")[1]}</span>
                  </button>
                );
              })}
          </div>
          {date && (
            <div className="animate-fade mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {SLOTS.map((t) => {
                const off = taken(studio, date, t);
                return (
                  <button key={t} disabled={off} onClick={() => setTime(t)} aria-pressed={time === t} className={`h-11 border text-sm transition ${time === t ? "border-ink bg-ink text-paper" : off ? "border-line text-muted/40 line-through" : "border-line bg-paper hover:border-ink/50"}`}>
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </Step>

        <Step n={3} title="Outfits to try" hint={`${picked.length}/5 selected`}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {candidates.map((p) => {
              const on = picked.includes(p.slug);
              return (
                <button
                  key={p.slug}
                  aria-pressed={on}
                  onClick={() => setPicked((x) => (on ? x.filter((y) => y !== p.slug) : x.length < 5 ? [...x, p.slug] : x))}
                  className={`group text-left transition ${on ? "" : "opacity-70 hover:opacity-100"}`}
                >
                  <span className={`relative block aspect-[3/4] overflow-hidden bg-sand ${on ? "ring-2 ring-ink ring-offset-2 ring-offset-ivory" : ""}`}>
                    <ProductVisual product={p} sizes="160px" />
                    {on && (
                      <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-paper">
                        <CheckIcon size={12} />
                      </span>
                    )}
                  </span>
                  <span className="mt-2 block text-xs leading-tight">{p.name}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted">
            Showing your wishlist and our most-tried pieces. <Link href="/outfits" className="link-u">Browse all {products.length} outfits</Link> and save more to your wishlist.
          </p>
        </Step>

        <Step n={4} title="Your details">
          <div className="grid gap-3 sm:grid-cols-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" aria-label="Full name" className="field" />
            <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Mobile (10 digits)" aria-label="Mobile number" inputMode="numeric" className="field" />
            <label className="flex items-center gap-3 border border-line bg-paper px-4">
              <span className="text-sm text-muted">People</span>
              <select value={people} onChange={(e) => setPeople(Number(e.target.value))} className="h-11 flex-1 bg-transparent text-sm outline-none">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
        </Step>
      </div>

      <aside className="lg:col-span-4">
        <div className="glass sticky top-28 p-6 sm:p-8">
          <p className="eyebrow text-gold">Your trial</p>
          <dl className="mt-5 space-y-3 text-sm">
            {[
              ["Studio", `${s.name} · ${s.address}`],
              ["When", date ? `${fmtLong(date)}${time ? ` at ${time}` : ""}` : "Choose a day"],
              ["Outfits", picked.length ? picked.map((x) => getProduct(x)?.name).join(", ") : "Choose up to 5"],
              ["Guests", String(people)],
              ["Cost", "Free · 45 minutes"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <button
            className="btn-dark mt-6 w-full"
            disabled={!valid}
            onClick={() => setDone(rente.bookAppointment({ studio: s.name, date, time, outfits: picked, name: name.trim(), phone, people }))}
          >
            Book Free Trial <ArrowIcon size={16} />
          </button>
          {!valid && <p className="mt-3 text-center text-xs text-muted">Pick a time, at least one outfit, and add your name and mobile.</p>}
        </div>
      </aside>
    </section>
  );
}

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="flex items-baseline gap-4">
          <span className="display text-3xl text-gold">0{n}</span>
          <span className="font-display text-3xl">{title}</span>
        </h2>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

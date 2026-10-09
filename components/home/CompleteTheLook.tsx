"use client";

import Link from "next/link";
import { useState } from "react";
import { featuredLook, getAccessory, getProduct } from "@/lib/data";
import { usePlan } from "@/lib/plan";
import { fmt, inr, isRentable, rentalWindow, toNine } from "@/lib/rental";
import { rente } from "@/lib/store";
import { AccessoryIcon } from "../ui/AccessoryIcon";
import { ArrowIcon, CheckIcon, PlusIcon } from "../ui/Icons";
import { Photo } from "../ui/Photo";
import { SizePicker } from "../product/SizePicker";
import { toast } from "../ui/Toaster";

export function CompleteTheLook() {
  const look = featuredLook;
  const main = getProduct(look.main)!;
  const accs = look.accessories.map((a) => getAccessory(a)!);
  const [chosen, setChosen] = useState<string[]>(look.accessories);
  const [size, setSize] = useState(main.sizes.includes("L") ? "L" : main.sizes[0]);
  const plan = usePlan();
  const w = rentalWindow(plan.start, 2);
  const free = isRentable(main, plan.start, 2, plan.today);

  const separate = main.price + accs.filter((a) => chosen.includes(a.slug)).reduce((s, a) => s + a.price, 0);
  const bundled = toNine(separate * 0.94);

  const toggle = (slug: string) => setChosen((c) => (c.includes(slug) ? c.filter((x) => x !== slug) : [...c, slug]));

  const rent = () => {
    rente.addToBag({ slug: main.slug, size, start: plan.start, days: 2, accessories: chosen, look: look.name });
    toast(`${look.name} added to bag`, { href: "/bag", cta: "View bag" });
  };

  return (
    <section className="bg-ink text-paper">
      <div className="shell grid gap-10 py-24 md:py-32 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className="eyebrow text-gold-soft">Complete the Look</p>
          <h2 className="display mt-4 text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.98]">
            {look.name.replace(" Look", "")} <em className="text-gold-soft">Look</em>
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-paper/70">
            We style every outfit head to toe. Rent the full look in one tap and save 6% on the bundle. Untick anything you already own.
          </p>
          <div className="relative mt-10 aspect-[4/5] overflow-hidden">
            <Photo shot={look.image} ar="4:5" alt={main.name} sizes="(max-width: 1024px) 100vw, 40vw" />
            <span className="glass-dark absolute left-4 top-4 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]">Main outfit</span>
          </div>
          <Link href={`/outfits/${main.slug}`} className="mt-4 flex items-center justify-between border-b border-paper/20 pb-4">
            <span className="font-display text-2xl">{main.name}</span>
            <span className="text-sm text-paper/70">{inr(main.price)}</span>
          </Link>
        </div>

        <div className="flex flex-col lg:col-span-7">
          <p className="eyebrow text-paper/50 lg:mt-[9.5rem]">Recommended with it</p>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {accs.map((a) => {
              const on = chosen.includes(a.slug);
              return (
                <li key={a.slug}>
                  <button
                    onClick={() => toggle(a.slug)}
                    aria-pressed={on}
                    className={`group flex w-full items-center gap-4 border p-4 text-left transition sm:p-5 ${on ? "border-gold-soft bg-paper/[0.06]" : "border-paper/15 opacity-60 hover:opacity-100"}`}
                  >
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-paper/[0.07] text-gold-soft">
                      <AccessoryIcon kind={a.icon} size={36} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-xl">{a.name}</span>
                      <span className="text-sm text-paper/60">+{inr(a.price)}</span>
                    </span>
                    <span className={`grid h-7 w-7 place-items-center rounded-full border ${on ? "border-gold-soft bg-gold-soft text-ink" : "border-paper/30"}`}>
                      {on ? <CheckIcon size={14} /> : <PlusIcon size={14} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6">
            <p className="eyebrow mb-3 text-paper/50">Size</p>
            <div className="[&_button]:border-paper/20 [&_button[aria-checked=true]]:border-paper [&_button[aria-checked=true]]:bg-paper [&_button[aria-checked=true]]:text-ink">
              <SizePicker sizes={main.sizes} value={size} onChange={setSize} />
            </div>
          </div>

          <div className="glass-dark mt-8 flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8 lg:mt-auto">
            <div>
              <p className="eyebrow text-gold-soft">Complete Look</p>
              <p className="mt-3 flex items-baseline gap-3">
                <span className="display text-5xl">{inr(bundled)}</span>
                <span className="text-paper/60">/ 2 Days</span>
              </p>
              <p className="mt-1 text-sm text-paper/50">
                <s>{inr(separate)}</s> if rented separately · {fmt(w.start)} → {fmt(w.end)}
              </p>
            </div>
            {free ? (
              <button onClick={rent} className="btn-light">
                Rent Complete Look <ArrowIcon size={16} />
              </button>
            ) : (
              <Link href={`/outfits/${main.slug}`} className="btn-line-light">
                Booked on these dates · Pick others <ArrowIcon size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

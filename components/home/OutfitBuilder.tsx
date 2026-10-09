"use client";

import Link from "next/link";
import { useState } from "react";
import { getAccessory, products, type Category, type Gender } from "@/lib/data";
import { usePlan } from "@/lib/plan";
import { inr, isRentable } from "@/lib/rental";
import { rente } from "@/lib/store";
import { AccessoryIcon } from "../ui/AccessoryIcon";
import { ArrowIcon, CheckIcon } from "../ui/Icons";
import { SectionHead } from "../ui/SectionHead";
import { toast } from "../ui/Toaster";
import { LookFigure, type GarmentType } from "./LookFigure";

const TYPES: Record<GarmentType, { colours: [string, string][]; accessories: string[]; sizes: string[]; categories: Category[]; gender: Gender }> = {
  Chola: {
    colours: [["Undyed Ivory", "#efe8da"], ["Cream", "#ece0c6"], ["Natural Brown", "#8a6b4e"], ["Charcoal", "#3a3935"]],
    accessories: ["gaddi-topi", "kullu-topi-acc", "dora", "sehra", "kullu-muffler", "pula"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    categories: ["Chola", "Bridal Set"],
    gender: "him",
  },
  Koti: {
    colours: [["Charcoal", "#3a3935"], ["Black", "#1b1b1f"], ["Maroon", "#6d1a28"], ["Grey Tweed", "#8b8a86"], ["Bottle Green", "#1e4d3a"]],
    accessories: ["kullu-topi-acc", "kullu-muffler", "pula", "chamba-rumal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    categories: ["Koti"],
    gender: "him",
  },
  Pattu: {
    colours: [["Black", "#1f1c1b"], ["Ivory", "#ece6da"], ["Red", "#a3232c"], ["Maroon", "#5e1824"], ["Grey", "#6f6d69"]],
    accessories: ["dhatu", "silver-brooch", "chandrahaar-acc", "hansli", "nath", "pula"],
    sizes: ["Free"],
    categories: ["Pattu", "Bridal Set"],
    gender: "her",
  },
  Luanchari: {
    colours: [["Teal", "#2f7f79"], ["Red", "#c4283a"], ["Rani Pink", "#d4307a"], ["Green", "#2d6a45"], ["Royal Blue", "#2b4d8f"]],
    accessories: ["dora", "chak", "nath", "hansli", "silver-kangan", "kinnauri-earrings-acc"],
    sizes: ["XS", "S", "M", "L", "XL"],
    categories: ["Luanchari", "Robe"],
    gender: "her",
  },
};

const dist = (a: string, b: string) => {
  const x = parseInt(a.slice(1), 16),
    y = parseInt(b.slice(1), 16);
  return Math.hypot((x >> 16) - (y >> 16), ((x >> 8) & 255) - ((y >> 8) & 255), (x & 255) - (y & 255));
};

/** The closest-coloured outfit of this type that is free on the visitor's dates. */
function closestProduct(type: GarmentType, hex: string, start: string, today: string) {
  return products
    .filter((p) => TYPES[type].categories.includes(p.category) && p.gender === TYPES[type].gender && isRentable(p, start, 2, today))
    .sort((a, b) => dist(a.hex, hex) - dist(b.hex, hex))[0];
}

const STEPS = ["Choose Outfit", "Choose Colour", "Choose Accessories", "Choose Size"];

export function OutfitBuilder() {
  const [type, setType] = useState<GarmentType>("Chola");
  const [colour, setColour] = useState(TYPES.Chola.colours[0]);
  const [acc, setAcc] = useState<string[]>(["gaddi-topi", "dora"]);
  const [size, setSize] = useState("");
  const [step, setStep] = useState(0);
  const plan = usePlan();

  const cfg = TYPES[type];
  const match = closestProduct(type, colour[1], plan.start, plan.today);
  const accTotal = acc.reduce((s, a) => s + (getAccessory(a)?.price ?? 0), 0);
  const total = (match?.price ?? 0) + accTotal;
  const ready = !!size;

  const pickType = (t: GarmentType) => {
    setType(t);
    setColour(TYPES[t].colours[0]);
    setAcc([]);
    setSize(TYPES[t].sizes.length === 1 ? TYPES[t].sizes[0] : "");
    setStep(1);
  };

  const rent = () => {
    if (!match) return;
    const s = match.sizes.includes(size) ? size : match.sizes[0];
    rente.addToBag({ slug: match.slug, size: s, start: plan.start, days: 2, accessories: acc.filter((a) => getAccessory(a)) });
    toast("Your look is in the bag", { href: "/bag", cta: "View bag" });
  };

  return (
    <section id="builder" className="shell scroll-mt-24 py-24 md:py-32">
      <SectionHead eyebrow="Outfit Builder" title={<>Build <em>your</em> look.</>} lead="Choose a silhouette, a colour and the finishing pieces. The preview updates as you go, and we match it to the closest outfit in our wardrobe." />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="relative flex flex-col overflow-hidden bg-gradient-to-b from-sand to-paper lg:col-span-5 lg:min-h-[640px]">
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="display select-none text-[32vw] leading-none text-ink/[0.04] lg:text-[16rem]">{type[0]}</span>
          </div>
          <div className="relative mx-auto aspect-[1/2] h-[440px] max-w-full transition-all duration-500 sm:h-[520px]">
            <LookFigure type={type} colour={colour[1]} accessories={acc} />
          </div>
          <div className="glass relative m-4 mt-auto flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Live preview</p>
              <p className="truncate font-display text-xl">
                {colour[0]} {type}
                {acc.length > 0 && <span className="text-muted"> + {acc.length}</span>}
              </p>
            </div>
            <p className="shrink-0 text-right">
              <span className="block font-semibold">{inr(total)}</span>
              <span className="text-[11px] text-muted">/ 2 days</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ol className="divide-y divide-line border-y border-line">
            {STEPS.map((label, i) => {
              const open = step === i;
              const summary = [type, colour[0], acc.length ? acc.map((a) => getAccessory(a)?.name).join(", ") : "None yet", size || "Not chosen"][i];
              return (
                <li key={label}>
                  <button onClick={() => setStep(i)} aria-expanded={open} className="flex w-full items-center gap-5 py-5 text-left">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-semibold ${i < step || (i === 3 && ready) ? "border-ink bg-ink text-paper" : open ? "border-ink" : "border-line text-muted"}`}>
                      {i < step || (i === 3 && ready) ? <CheckIcon size={14} /> : i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="eyebrow block text-muted">Step {i + 1}</span>
                      <span className="font-display text-2xl">{label}</span>
                    </span>
                    {!open && <span className="hidden max-w-[45%] truncate text-sm text-muted sm:block">{summary}</span>}
                  </button>
                  {open && (
                    <div className="animate-fade pb-7 pl-14">
                      {i === 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(TYPES) as GarmentType[]).map((t) => (
                            <button key={t} onClick={() => pickType(t)} className={`chip h-12 px-5 text-base ${type === t ? "chip-on" : ""}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                      {i === 1 && (
                        <div>
                          <div className="flex flex-wrap gap-3">
                            {cfg.colours.map((c) => (
                              <button
                                key={c[0]}
                                onClick={() => setColour(c)}
                                aria-label={c[0]}
                                aria-pressed={colour[0] === c[0]}
                                className={`h-12 w-12 rounded-full border-2 transition ${colour[0] === c[0] ? "scale-110 border-ink ring-2 ring-paper ring-offset-2 ring-offset-ink" : "border-line hover:scale-105"}`}
                                style={{ background: c[1] }}
                              />
                            ))}
                          </div>
                          <button className="btn-line mt-6 h-10" onClick={() => setStep(2)}>
                            Next: Accessories
                          </button>
                        </div>
                      )}
                      {i === 2 && (
                        <div>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {cfg.accessories.map((a) => {
                              const x = getAccessory(a)!;
                              const on = acc.includes(a);
                              return (
                                <button
                                  key={a}
                                  aria-pressed={on}
                                  onClick={() => setAcc((v) => (on ? v.filter((y) => y !== a) : [...v, a]))}
                                  className={`flex items-center gap-3 border p-3 text-left transition ${on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink/60"}`}
                                >
                                  <AccessoryIcon kind={x.icon} size={28} className={on ? "text-gold-soft" : "text-gold"} />
                                  <span className="text-sm">
                                    {x.name}
                                    <span className={`block text-xs ${on ? "text-paper/60" : "text-muted"}`}>+{inr(x.price)}</span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          <button className="btn-line mt-6 h-10" onClick={() => setStep(3)}>
                            Next: Size
                          </button>
                        </div>
                      )}
                      {i === 3 && (
                        <div className="flex flex-wrap items-center gap-2">
                          {cfg.sizes.map((s) => (
                            <button key={s} onClick={() => setSize(s)} className={`chip h-12 min-w-14 justify-center ${size === s ? "chip-on" : ""}`}>
                              {s === "Free" ? "Free size" : s}
                            </button>
                          ))}
                          <Link href="/how-it-works#size-guide" className="link-u ml-3 text-sm text-muted">
                            Not sure? Size guide
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          <div className={`mt-8 border p-6 transition sm:p-8 ${ready ? "border-ink bg-paper" : "border-dashed border-line"}`}>
            {ready && match ? (
              <div className="animate-fade flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow text-gold">Final</p>
                  <p className="display mt-2 text-4xl">Your Look is Ready.</p>
                  <p className="mt-2 text-sm text-muted">
                    Closest match:{" "}
                    <Link href={`/outfits/${match.slug}`} className="link-u font-medium text-ink">
                      {match.name}
                    </Link>{" "}
                    · size {match.sizes.includes(size) ? size : match.sizes[0]} · {inr(total)} / 2 days
                  </p>
                </div>
                <button className="btn-dark shrink-0" onClick={rent}>
                  Rent This Look <ArrowIcon size={16} />
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted">{ready ? "Nothing in this style is free on your dates. Try another silhouette or change your dates on any outfit page." : "Finish all four steps and your look will be ready to rent."}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

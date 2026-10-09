"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { local, type Shot } from "@/lib/images";
import { Photo } from "../ui/Photo";
import { ArrowIcon } from "../ui/Icons";

const SLIDES: { shot: Shot; alt: string; caption: string; href: string }[] = [
  { shot: { ...local("pattu-women", 0.5, 0.5), slot: "home-hero" }, alt: "Women of a Kullu mahila mandal in black, red and ivory pattus with dhatu headscarves", caption: "Kullvi Pattu & Dhatu", href: "/outfits/kullvi-pattu-set" },
  { shot: local("gaddi-chola-dance", 0.28), alt: "A Gaddi man dancing in an ivory chola tied with black dora and a plumed topi", caption: "Gaddi Chola & Dora", href: "/outfits/gaddi-chola-dora-set" },
  { shot: local("kinnauri-attire", 0.3, 0.5), alt: "A woman in a Kinnauri shawl and green thepang against the mountains", caption: "Kinnauri Dohru & Thepang", href: "/outfits/kinnauri-dohru-set" },
  { shot: local("gaddi-couple", 0.35), alt: "A Gaddi couple in ceremonial dress with silver jewellery", caption: "Valley Vows · Couple Look", href: "/collections/couple-looks" },
];

const STRIP = [
  { label: "Pahari Byah", href: "/collections/pahari-byah" },
  { label: "Kullu Valley", href: "/collections/kullu-valley" },
  { label: "Gaddi & Chamba", href: "/collections/gaddi-chamba" },
  { label: "Kinnaur & Lahaul", href: "/collections/kinnaur-lahaul" },
  { label: "Nati Troupe", href: "/collections/nati-troupe" },
];

const INTERVAL = 6500;

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((x) => (x + 1) % SLIDES.length), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused]);

  const slide = SLIDES[i];

  return (
    <section className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {SLIDES.map((s, k) => (
        <div key={k} aria-hidden={k !== i} className={`absolute inset-0 -z-10 transition-opacity duration-[1400ms] ease-out ${k === i ? "opacity-100" : "opacity-0"}`}>
          <div className={k === i ? "animate-slow-zoom absolute inset-0" : "absolute inset-0"}>
            <Photo shot={s.shot} ar="16:10" alt={s.alt} sizes="100vw" priority={k === 0} />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />

      <div className="shell flex flex-1 flex-col justify-center pb-28 pt-32 sm:pb-36">
        <p className="eyebrow animate-rise text-gold-soft" style={{ animationDelay: "150ms" }}>
          Himachali Traditional Wear · On Rent
        </p>
        <h1 className="display animate-rise mt-6 max-w-4xl text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.92]" style={{ animationDelay: "300ms" }}>
          Wear your <em className="font-normal text-gold-soft">roots.</em>
        </h1>
        <p className="animate-rise mt-7 max-w-md text-base leading-relaxed text-paper/80 sm:text-lg" style={{ animationDelay: "450ms" }}>
          Pattu, chola, luanchari, topi and silver from Kullu, Chamba, Kinnaur and Lahaul. Rented for your byah, mela or stage, returned for the next.
        </p>
        <div className="animate-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "600ms" }}>
          <Link href="/collections" className="btn-light">
            Explore Collection <ArrowIcon size={16} />
          </Link>
          <Link href="/quiz" className="btn-line-light">
            Find My Outfit
          </Link>
        </div>
      </div>

      {/* slide caption + controls */}
      <div className="absolute bottom-20 right-4 flex items-center gap-4 sm:right-6 md:bottom-24 lg:right-10">
        <Link key={i} href={slide.href} className="glass-dark animate-fade hidden items-center gap-3 px-4 py-2.5 text-sm sm:flex">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-soft">Now showing</span>
          {slide.caption}
          <ArrowIcon size={14} />
        </Link>
        <div className="flex gap-1.5" role="tablist" aria-label="Hero slides">
          {SLIDES.map((s, k) => (
            <button key={k} role="tab" aria-selected={k === i} aria-label={s.caption} onClick={() => setI(k)} className="group grid h-8 place-items-center">
              <span className={`block h-0.5 overflow-hidden bg-paper/30 transition-all ${k === i ? "w-10" : "w-5 group-hover:bg-paper/60"}`}>
                {k === i && <span key={`${i}-${paused}`} className="block h-full bg-paper" style={{ animation: paused ? "none" : `progress ${INTERVAL}ms linear both`, width: paused ? "100%" : undefined }} />}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 hidden border-t border-paper/15 md:block">
        <ul className="shell flex h-16 items-center justify-between text-[12px] uppercase tracking-[0.3em] text-paper/70">
          {STRIP.map((s, k) => (
            <li key={s.label} className="flex items-center gap-6">
              {k > 0 && <span className="h-1 w-1 rounded-full bg-gold-soft" />}
              <Link href={s.href} className="link-u hover:text-paper">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

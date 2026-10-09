"use client";

import Link from "next/link";
import { useState } from "react";
import { MOODS, STYLES, products, type MoodSlug, type Style } from "@/lib/data";
import { ProductCard } from "../ProductCard";
import { Photo } from "../ui/Photo";
import { local } from "@/lib/images";
import { ArrowIcon, ArrowLeftIcon } from "../ui/Icons";

const BUDGETS = [
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000–₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000+", min: 2000, max: Infinity },
];
const STYLE_LABEL: Record<Style, string> = { Bridal: "Bridal & ceremonial", Festive: "Bright & festive", Heritage: "Simple heritage" };

function recommend(mood: MoodSlug, style: Style, budget: (typeof BUDGETS)[number]) {
  const m = MOODS.find((x) => x.slug === mood)!;
  return products
    .filter((p) => p.status !== "coming-soon")
    .map((p) => {
      let score = 0;
      if (m.match(p)) score += 4;
      if (p.style === style) score += 2;
      // a look plus a couple of accessories should land in budget
      const est = p.price;
      if (est >= budget.min && est < budget.max) score += 2;
      else if (est < budget.min) score += 1;
      if (p.trending) score += 0.5;
      return { p, score };
    })
    .filter((s) => s.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((s) => s.p);
}

export function OccasionQuiz() {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<MoodSlug | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number] | null>(null);
  const [show, setShow] = useState(false);

  const results = mood && style && budget ? recommend(mood, style, budget) : [];
  const reset = () => {
    setStep(0);
    setMood(null);
    setStyle(null);
    setBudget(null);
    setShow(false);
  };

  const Q = [
    { q: "What's the occasion?", options: MOODS.map((m) => ({ label: m.label, on: mood === m.slug, pick: () => setMood(m.slug) })) },
    { q: "What's your style?", options: STYLES.map((s) => ({ label: STYLE_LABEL[s], on: style === s, pick: () => setStyle(s) })) },
    { q: "Your budget?", options: BUDGETS.map((b) => ({ label: b.label, on: budget === b, pick: () => setBudget(b) })) },
  ];

  return (
    <section id="quiz" className="scroll-mt-20 bg-sand">
      <div className="shell py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-gold">Occasion Quiz</p>
            <h2 className="display mt-4 text-[clamp(2.6rem,5vw,4.5rem)] leading-[1]">
              Not sure <em>what to wear?</em>
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-muted">Three questions, thirty seconds. We&apos;ll pull the looks that fit.</p>
            <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden lg:block">
              <Photo shot={{ ...local("pattu-loom-teal", 0.5), slot: "style-quiz" }} ar="4:3" alt="A teal Kullu pattu on the loom" sizes="30vw" />
            </div>
            <div className="mt-8 flex gap-2" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`h-1 flex-1 transition-colors ${i <= step ? "bg-ink" : "bg-ink/15"}`} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {step < 3 ? (
              <div key={step} className="animate-rise">
                <p className="eyebrow text-muted">Question {step + 1} of 3</p>
                <p className="display mt-3 text-4xl sm:text-5xl">{Q[step].q}</p>
                <div className="mt-8 grid gap-2 sm:grid-cols-2">
                  {Q[step].options.map((o) => (
                    <button
                      key={o.label}
                      onClick={() => {
                        o.pick();
                        setStep(step + 1);
                      }}
                      className={`group flex items-center justify-between border bg-paper px-6 py-5 text-left text-lg transition ${o.on ? "border-ink" : "border-transparent hover:border-ink/40"}`}
                    >
                      {o.label}
                      <ArrowIcon size={18} className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className="mt-6 flex items-center gap-2 text-sm text-muted hover:text-ink">
                    <ArrowLeftIcon size={16} /> Back
                  </button>
                )}
              </div>
            ) : (
              <div className="animate-rise">
                <p className="eyebrow text-muted">
                  {MOODS.find((m) => m.slug === mood)?.label} · {style} · {budget?.label}
                </p>
                <p className="display mt-3 text-5xl sm:text-6xl">
                  We&apos;ve found {results.length} {results.length === 1 ? "look" : "looks"} for you.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {!show && (
                    <button className="btn-dark" onClick={() => setShow(true)}>
                      View Recommendations <ArrowIcon size={16} />
                    </button>
                  )}
                  <Link href={`/outfits?mood=${mood}&style=${style}`} className="btn-line">
                    Browse all matches
                  </Link>
                  <button onClick={reset} className="btn text-muted hover:text-ink">
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {show && (
          <div className="animate-rise mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-6">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} sizes="(max-width: 768px) 50vw, 16vw" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

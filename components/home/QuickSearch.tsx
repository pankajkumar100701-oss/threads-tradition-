"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MOODS, type MoodSlug } from "@/lib/data";
import { usePlan } from "@/lib/plan";
import { PERIODS, fmt, rentalWindow } from "@/lib/rental";
import { rente } from "@/lib/store";
import { RentalCalendar } from "../product/RentalCalendar";
import { ArrowIcon, CalendarIcon, ChevronDownIcon } from "../ui/Icons";

const EMPTY = new Set<string>();

export function QuickSearch() {
  const router = useRouter();
  const plan = usePlan();
  const [mood, setMood] = useState<MoodSlug>("byah");
  const [picking, setPicking] = useState(false);
  const w = rentalWindow(plan.start, plan.days);

  const find = () => {
    rente.setPlan({ start: plan.start, days: plan.days, occasion: mood });
    router.push(`/outfits?mood=${mood}&start=${plan.start}&days=${plan.days}&avail=1`);
  };

  return (
    <section aria-label="Find your look" className="shell relative z-10 pt-8 md:pt-10">
      <div className="grid gap-6 border border-line bg-paper p-5 shadow-[0_24px_60px_-30px_rgb(23_21_19/0.25)] sm:p-8 lg:grid-cols-[1.6fr_1fr_auto] lg:items-end lg:gap-10">
        <div>
          <p className="display text-2xl sm:text-3xl">What are you dressing for?</p>
          <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Occasion">
            {MOODS.map((m) => (
              <button key={m.slug} role="radio" aria-checked={mood === m.slug} onClick={() => setMood(m.slug)} className={`chip ${mood === m.slug ? "chip-on" : "bg-paper/50"}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="eyebrow mb-3 text-muted">Choose date</p>
          <button onClick={() => setPicking((v) => !v)} aria-expanded={picking} className="flex h-12 w-full items-center gap-3 border border-ink/20 bg-paper/70 px-4 text-left transition hover:border-ink">
            <CalendarIcon size={18} />
            <span className="flex-1 font-medium">
              {fmt(w.start)} → {fmt(w.end)}
            </span>
            <span className="text-xs text-muted">{plan.days} days</span>
            <ChevronDownIcon size={16} className={`transition ${picking ? "rotate-180" : ""}`} />
          </button>
          {picking && (
            <div className="animate-rise absolute left-0 right-0 top-full z-20 mt-2 min-w-[300px] bg-paper p-5 shadow-2xl lg:-left-10">
              <RentalCalendar today={plan.today} start={plan.start} days={plan.days} reserved={EMPTY} onPick={(d) => rente.setPlan({ start: d })} />
              <p className="eyebrow mb-2 mt-5 text-muted">Rental period</p>
              <div className="grid grid-cols-4 gap-2">
                {PERIODS.map((d) => (
                  <button key={d} onClick={() => rente.setPlan({ days: d })} className={`chip justify-center px-0 ${plan.days === d ? "chip-on" : ""}`}>
                    {d} days
                  </button>
                ))}
              </div>
              <button className="btn-dark mt-5 w-full" onClick={() => setPicking(false)}>
                Done
              </button>
            </div>
          )}
        </div>

        <button onClick={find} className="btn-dark h-12 px-8">
          Find Outfits <ArrowIcon size={16} />
        </button>
      </div>
    </section>
  );
}

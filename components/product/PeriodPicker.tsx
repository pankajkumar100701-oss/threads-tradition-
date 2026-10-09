"use client";

import { PERIODS, inr, rentalPrice } from "@/lib/rental";

export function PeriodPicker({ base, days, onChange, compact }: { base: number; days: number; onChange: (d: number) => void; compact?: boolean }) {
  return (
    <div role="radiogroup" aria-label="Rental period" className="grid grid-cols-4 gap-2">
      {PERIODS.map((d) => {
        const on = d === days;
        return (
          <button
            key={d}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(d)}
            className={`flex flex-col items-center justify-center border transition ${compact ? "py-2" : "py-3"} ${on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink/60"}`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">{d} Days</span>
            <span className={`mt-0.5 text-sm ${on ? "text-gold-soft" : "text-muted"}`}>{inr(rentalPrice(base, d))}</span>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { addDays, fmt, heldDates, monthGrid, monthLabel, ymd } from "@/lib/rental";
import { ArrowLeftIcon, ArrowIcon } from "../ui/Icons";

export function RentalCalendar({
  today,
  start,
  days,
  reserved,
  onPick,
}: {
  today: string;
  start: string;
  days: number;
  reserved: Set<string>;
  onPick: (iso: string) => void;
}) {
  const s = ymd(start);
  const [cursor, setCursor] = useState({ y: s.y, m: s.m });
  const t = ymd(today);
  const canPrev = cursor.y * 12 + cursor.m > t.y * 12 + t.m;
  const held = new Set(heldDates(start, days));
  const min = addDays(today, 1);
  const cells = monthGrid(cursor.y, cursor.m);

  const shift = (n: number) =>
    setCursor((c) => {
      const m = c.m + n;
      return { y: c.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month" className="grid h-9 w-9 place-items-center border border-line transition hover:border-ink disabled:opacity-30">
          <ArrowLeftIcon size={16} />
        </button>
        <p className="font-display text-xl">{monthLabel(cursor.y, cursor.m)}</p>
        <button onClick={() => shift(1)} aria-label="Next month" className="grid h-9 w-9 place-items-center border border-line transition hover:border-ink">
          <ArrowIcon size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-line p-px">
        {cells.map((iso, i) => {
          if (!iso) return <div key={i} className="aspect-square bg-paper" />;
          const isReserved = reserved.has(iso);
          const tooSoon = iso < min;
          const inRange = held.has(iso);
          const clash = inRange && isReserved;
          const disabled = tooSoon || isReserved;
          const edge = iso === start || iso === addDays(start, days);
          return (
            <button
              key={iso}
              disabled={disabled}
              onClick={() => onPick(iso)}
              aria-label={`${fmt(iso)}${isReserved ? ", reserved" : tooSoon ? ", unavailable" : ", available"}${inRange ? ", in your rental" : ""}`}
              aria-pressed={inRange}
              className={[
                "relative aspect-square text-sm transition",
                clash
                  ? "bg-bad text-paper"
                  : inRange
                    ? edge
                      ? "bg-ink text-paper"
                      : "bg-ink/85 text-paper"
                    : isReserved
                      ? "bg-[repeating-linear-gradient(135deg,transparent_0_5px,rgb(23_21_19/0.07)_5px_6px)] bg-paper text-muted/60 line-through"
                      : tooSoon
                        ? "bg-paper text-muted/35"
                        : "bg-paper hover:bg-sand",
              ].join(" ")}
            >
              {ymd(iso).d}
              {iso === today && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <i className="h-3 w-3 border border-line bg-paper" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-3 w-3 bg-ink" /> Your dates
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-3 w-3 bg-[repeating-linear-gradient(135deg,transparent_0_2px,rgb(23_21_19/0.25)_2px_3px)] border border-line" /> Reserved
        </span>
      </div>
    </div>
  );
}

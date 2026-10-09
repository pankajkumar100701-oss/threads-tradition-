"use client";

export function SizePicker({ sizes, value, onChange, recommended }: { sizes: string[]; value: string; onChange: (s: string) => void; recommended?: string }) {
  return (
    <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const on = s === value;
        return (
          <button
            key={s}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(s)}
            className={`relative h-11 min-w-12 border px-3 text-sm font-medium transition ${on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink/60"}`}
          >
            {s}
            {recommended === s && <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-paper bg-gold" title="Recommended for you" />}
          </button>
        );
      })}
    </div>
  );
}

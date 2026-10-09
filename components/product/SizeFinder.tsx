"use client";

import { useState } from "react";
import { recommendSize, type SizeInput } from "@/lib/rental";
import { Modal } from "../ui/Modal";
import { RulerIcon } from "../ui/Icons";

export function SizeFinder({
  open,
  onClose,
  gender,
  available,
  onUse,
}: {
  open: boolean;
  onClose: () => void;
  gender: SizeInput["gender"];
  available: string[];
  onUse: (size: string) => void;
}) {
  const [g, setG] = useState(gender);
  const [v, setV] = useState({ height: "", weight: "", chest: "", waist: "" });
  const [result, setResult] = useState<{ size: string; why: string } | null>(null);

  const fields: [keyof typeof v, string, string, number, number][] = [
    ["height", "Height", "cm", 140, 210],
    ["weight", "Weight", "kg", 35, 160],
    ["chest", g === "him" ? "Chest" : "Bust", "in", 26, 56],
    ["waist", "Waist", "in", 22, 50],
  ];
  const valid = fields.every(([k, , , min, max]) => {
    const n = Number(v[k]);
    return v[k] !== "" && n >= min && n <= max;
  });

  return (
    <Modal open={open} onClose={onClose} label="Find my size">
      <div className="p-6 sm:p-10">
        <RulerIcon size={28} className="text-gold" />
        <h2 className="display mt-4 text-4xl">Find My Size</h2>
        <p className="mt-2 text-sm text-muted">Four measurements. Use a soft tape over a light shirt.</p>

        <div className="mt-6 flex gap-2">
          {(["him", "her"] as const).map((x) => (
            <button
              key={x}
              onClick={() => {
                setG(x);
                setResult(null);
              }}
              className={`chip ${g === x ? "chip-on" : ""}`}
            >
              {x === "him" ? "Menswear" : "Womenswear"}
            </button>
          ))}
        </div>

        <form
          className="mt-6 grid grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) setResult(recommendSize({ gender: g, height: +v.height, weight: +v.weight, chest: +v.chest, waist: +v.waist }));
          }}
        >
          {fields.map(([k, label, unit, min, max]) => (
            <label key={k} className="block">
              <span className="eyebrow text-muted">
                {label} <span className="normal-case tracking-normal">({unit})</span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={min}
                max={max}
                step="0.5"
                required
                value={v[k]}
                onChange={(e) => {
                  setV({ ...v, [k]: e.target.value });
                  setResult(null);
                }}
                placeholder={String(Math.round((min + max) / 2))}
                className="field mt-2"
              />
            </label>
          ))}
          <button className="btn-dark col-span-2 mt-2" disabled={!valid}>
            Recommend a size
          </button>
        </form>

        {result && (
          <div className="animate-rise mt-8 border border-ink p-6">
            <p className="eyebrow text-muted">Recommended Size</p>
            <p className="display mt-1 text-6xl">{result.size}</p>
            <p className="mt-2 text-sm text-muted">{result.why}</p>
            {available.includes(result.size) ? (
              <button
                className="btn-dark mt-5 w-full"
                onClick={() => {
                  onUse(result.size);
                  onClose();
                }}
              >
                Use size {result.size}
              </button>
            ) : (
              <p className="mt-4 text-sm text-bad">This outfit isn&apos;t stocked in {result.size}. Try a similar outfit, or ask us about alterations.</p>
            )}
          </div>
        )}
        <p className="mt-6 text-xs leading-relaxed text-muted">
          This is a recommendation, not a guarantee. Fits vary by cut and fabric. If it doesn&apos;t fit, tell us within 3 hours of delivery and we&apos;ll swap the size for free where stock allows.
        </p>
      </div>
    </Modal>
  );
}

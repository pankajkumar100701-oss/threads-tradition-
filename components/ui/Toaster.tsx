"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckIcon } from "./Icons";

type Toast = { id: number; text: string; href?: string; cta?: string };

let toasts: Toast[] = [];
let seq = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((s) => s());

export function toast(text: string, link?: { href: string; cta: string }) {
  const t = { id: ++seq, text, href: link?.href, cta: link?.cta };
  toasts = [...toasts, t].slice(-3);
  emit();
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== t.id);
    emit();
  }, 3600);
}

const EMPTY: Toast[] = [];

export function Toaster() {
  const list = useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => toasts,
    () => EMPTY,
  );
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4">
      {list.map((t) => (
        <div key={t.id} className="animate-rise pointer-events-auto flex items-center gap-3 bg-ink px-5 py-3.5 text-sm text-paper shadow-2xl">
          <CheckIcon size={16} className="text-gold-soft" />
          <span>{t.text}</span>
          {t.href && (
            <Link href={t.href} className="ml-2 border-b border-gold-soft text-xs font-semibold uppercase tracking-[0.14em] text-gold-soft">
              {t.cta}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

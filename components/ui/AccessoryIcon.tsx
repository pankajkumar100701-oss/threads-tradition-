import type { AccessoryIcon as Kind } from "@/lib/data";

const PATHS: Record<Kind, React.ReactNode> = {
  mojari: (
    <>
      <path d="M6 32c4-1 8-6 12-6h14c5 0 10 2 10 6s-4 4-8 4H10c-3 0-5-1.5-4-4Z" />
      <path d="M18 26c0-3 2-5 5-5 4 0 6 3 9 5" />
      <path d="M6 32c-1-3-1-6 1-8" />
      <path d="M24 30h2M29 30h2M34 30h2" />
    </>
  ),
  watch: (
    <>
      <circle cx="24" cy="24" r="9" />
      <path d="M24 19v5l3 2" />
      <path d="M19 16l1.5-9h7L29 16M19 32l1.5 9h7L29 32" />
    </>
  ),
  brooch: (
    <>
      <circle cx="24" cy="22" r="7" />
      <circle cx="24" cy="22" r="2.5" />
      <path d="M24 8v4M24 32v4M10 22h4M34 22h4M14 12l3 3M34 12l-3 3M14 32l3-3M34 32l-3-3" />
      <path d="M22 36l2 6 2-6" />
    </>
  ),
  stole: (
    <>
      <path d="M16 6c0 10-2 22-4 34h8c1-10 2-20 4-28 2 8 3 18 4 28h8c-2-12-4-24-4-34" />
      <path d="M12 40l-1 3M15 40v3M18 40l1 3M30 40l-1 3M33 40v3M36 40l1 3" />
    </>
  ),
  turban: (
    <>
      <path d="M10 30c0-10 6-18 14-18s14 8 14 18c-4 2-10 3-14 3s-10-1-14-3Z" />
      <path d="M12 24c6-2 12 6 24 0M11 28c8-3 14 5 26-1" />
      <path d="M26 12c2-3 5-4 6-2s-2 4-4 4" />
    </>
  ),
  pocket: (
    <>
      <path d="M10 22h28v18H10Z" />
      <path d="M14 22l4-12 6 8 5-10 5 14" />
    </>
  ),
  cufflinks: (
    <>
      <rect x="7" y="16" width="12" height="12" rx="2" />
      <rect x="29" y="16" width="12" height="12" rx="2" />
      <path d="M13 28v6M35 28v6M10 34h6M32 34h6" />
    </>
  ),
  oxfords: (
    <>
      <path d="M5 32c3 0 7-6 10-8 2 2 6 2 9 0 4 2 8 3 13 4s6 3 6 5-2 3-5 3H7c-2 0-3-2-2-4Z" />
      <path d="M17 26l3 3M20 25l3 3M23 24l3 3" />
    </>
  ),
  jhumka: (
    <>
      <circle cx="24" cy="10" r="3" />
      <path d="M24 13v4" />
      <path d="M14 30c0-7 4-13 10-13s10 6 10 13Z" />
      <path d="M14 30h20M16 34v2M20 34v3M24 34v3M28 34v3M32 34v2" />
    </>
  ),
  tikka: (
    <>
      <path d="M24 6v18" />
      <path d="M24 24c-5 0-8 4-8 8a8 8 0 0 0 16 0c0-4-3-8-8-8Z" />
      <circle cx="24" cy="32" r="3" />
      <path d="M20 41l-1 3M24 41v3M28 41l1 3" />
    </>
  ),
  bangles: (
    <>
      <ellipse cx="20" cy="24" rx="11" ry="14" />
      <ellipse cx="28" cy="24" rx="11" ry="14" />
    </>
  ),
  necklace: (
    <>
      <path d="M10 8c0 16 6 24 14 24s14-8 14-24" />
      <path d="M14 8c0 12 4 19 10 19s10-7 10-19" />
      <path d="M24 32l-4 6 4 4 4-4Z" />
    </>
  ),
  potli: (
    <>
      <path d="M18 14c-6 6-10 12-10 18 0 6 6 10 16 10s16-4 16-10c0-6-4-12-10-18" />
      <path d="M16 14h16M20 14c-2-4-6-6-8-6M28 14c2-4 6-6 8-6" />
      <path d="M14 30h20" />
    </>
  ),
  clutch: (
    <>
      <rect x="6" y="16" width="36" height="20" rx="2" />
      <path d="M6 22l18 8 18-8" />
      <circle cx="24" cy="26" r="1.5" />
    </>
  ),
  heels: (
    <>
      <path d="M8 18c6 0 10 10 18 14h12c2 0 4 2 4 4H14c-2 0-4-2-6-6v-12Z" />
      <path d="M8 18v22M38 32l2-6" />
    </>
  ),
  earrings: (
    <>
      <circle cx="16" cy="8" r="2" />
      <circle cx="32" cy="8" r="2" />
      <path d="M16 10v8M32 10v8" />
      <path d="M16 18l-5 12 5 10 5-10Z" />
      <path d="M32 18l-5 12 5 10 5-10Z" />
    </>
  ),
  cap: (
    <>
      <path d="M8 28c0-9 7-14 16-14s16 5 16 14Z" />
      <path d="M8 28h32v6H8Z" />
      <path d="M18 28h12l-1 8h-10Z" />
    </>
  ),
};

export function AccessoryIcon({ kind, size = 40, className = "" }: { kind: Kind; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[kind]}
    </svg>
  );
}

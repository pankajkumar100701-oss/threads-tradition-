import type { Status } from "@/lib/data";

const MAP: Record<Status, { label: string; dot: string }> = {
  available: { label: "Available", dot: "bg-ok" },
  "few-left": { label: "Few Left", dot: "bg-warn" },
  booked: { label: "Booked", dot: "bg-bad" },
  "coming-soon": { label: "Coming Soon", dot: "bg-gold" },
};

export function StatusBadge({ status, className = "" }: { status: Status; className?: string }) {
  const s = MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 bg-paper/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function Tag({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${dark ? "bg-ink text-paper" : "bg-gold-soft text-ink"}`}>
      {children}
    </span>
  );
}

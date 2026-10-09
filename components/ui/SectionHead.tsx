import Link from "next/link";
import { ArrowIcon } from "./Icons";

export function SectionHead({
  eyebrow,
  title,
  lead,
  action,
  light,
  center,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  action?: { href: string; label: string };
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 flex flex-col gap-6 md:mb-16 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={center ? "max-w-2xl" : "max-w-3xl"}>
        <p className={`eyebrow ${light ? "text-gold-soft" : "text-gold"}`}>{eyebrow}</p>
        <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[1]">{title}</h2>
        {lead && <p className={`mt-5 max-w-xl text-base leading-relaxed ${center ? "mx-auto" : ""} ${light ? "text-paper/70" : "text-muted"}`}>{lead}</p>}
      </div>
      {action && (
        <Link href={action.href} className="link-u flex shrink-0 items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em]">
          {action.label} <ArrowIcon size={16} />
        </Link>
      )}
    </div>
  );
}

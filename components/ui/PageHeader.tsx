import type { Shot } from "@/lib/images";
import { Photo } from "./Photo";

export function PageHeader({ eyebrow, title, lead, image }: { eyebrow: string; title: React.ReactNode; lead?: string; image?: Shot }) {
  if (image) {
    return (
      <header className="grain relative isolate flex min-h-[70svh] items-end overflow-hidden bg-ink text-paper">
        <div className="animate-slow-zoom absolute inset-0 -z-10">
          <Photo shot={image} ar="16:9" alt="" sizes="100vw" priority />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/20" />
        <div className="shell pb-16 pt-40">
          <p className="eyebrow animate-rise text-gold-soft">{eyebrow}</p>
          <h1 className="display animate-rise mt-4 max-w-4xl text-[clamp(3rem,8vw,7rem)] leading-[0.95]" style={{ animationDelay: "120ms" }}>
            {title}
          </h1>
          {lead && (
            <p className="animate-rise mt-6 max-w-xl text-lg text-paper/80" style={{ animationDelay: "240ms" }}>
              {lead}
            </p>
          )}
        </div>
      </header>
    );
  }
  return (
    <header className="shell pb-12 pt-32 md:pb-16 md:pt-44">
      <p className="eyebrow animate-rise text-gold">{eyebrow}</p>
      <h1 className="display animate-rise mt-4 max-w-5xl text-[clamp(3rem,8vw,7rem)] leading-[0.95]" style={{ animationDelay: "120ms" }}>
        {title}
      </h1>
      {lead && (
        <p className="animate-rise mt-6 max-w-xl text-lg text-muted" style={{ animationDelay: "240ms" }}>
          {lead}
        </p>
      )}
    </header>
  );
}

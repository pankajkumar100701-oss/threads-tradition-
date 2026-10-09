import Link from "next/link";
import { getProduct, reviews, type Review } from "@/lib/data";
import { StarIcon } from "../ui/Icons";
import { SectionHead } from "../ui/SectionHead";
import { Reveal } from "../ui/Reveal";

const AXES = ["fit", "quality", "packaging", "overall"] as const;

export function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="flex text-gold" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} size={size} filled={i <= Math.round(n)} />
      ))}
    </span>
  );
}

export function ReviewSummary({ list }: { list: Review[] }) {
  const avg = (k: (typeof AXES)[number]) => list.reduce((s, r) => s + r[k], 0) / list.length;
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
      {AXES.map((k) => (
        <div key={k}>
          <dt className="eyebrow text-muted">{k}</dt>
          <dd className="mt-2 flex items-center gap-3">
            <span className="display text-4xl">{avg(k).toFixed(1)}</span>
            <span className="h-1 flex-1 bg-ink/10">
              <span className="block h-full bg-gold" style={{ width: `${(avg(k) / 5) * 100}%` }} />
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ReviewCard({ r }: { r: Review }) {
  const p = getProduct(r.outfit);
  return (
    <figure className="flex h-full flex-col border border-line bg-paper p-7 sm:p-8">
      <Stars n={r.overall} />
      <blockquote className="mt-5 flex-1 font-display text-2xl leading-snug">“{r.quote}”</blockquote>
      <figcaption className="mt-6 border-t border-line pt-4 text-sm">
        <span className="font-semibold">{r.name}</span> <span className="text-muted">· {r.city}</span>
        {p && (
          <Link href={`/outfits/${p.slug}`} className="link-u mt-1 block text-xs uppercase tracking-[0.14em] text-muted">
            Rented: {p.name}
          </Link>
        )}
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  return (
    <section className="shell py-24 md:py-32">
      <SectionHead eyebrow="Reviews" title={<>Four thousand looks, <em>returned with stories.</em></>} />
      <div className="mb-14 border-y border-line py-8">
        <ReviewSummary list={reviews} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={(i % 3) * 80}>
            <ReviewCard r={r} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

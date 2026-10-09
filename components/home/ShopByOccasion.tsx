import Link from "next/link";
import { occasions, products } from "@/lib/data";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";

export function ShopByOccasion({ heading = true }: { heading?: boolean }) {
  return (
    <section className={heading ? "bg-paper py-24 md:py-32" : ""}>
      <div className="shell">
        {heading && <SectionHead eyebrow="Shop by Occasion" title={<>Dress for <em>the day</em>, not the year.</>} action={{ href: "/occasions", label: "All occasions" }} />}
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {occasions.map((o, i) => {
            const count = products.filter((p) => p.occasions.includes(o.slug)).length;
            return (
              <Reveal as="li" key={o.slug} delay={(i % 3) * 70}>
                <Link href={`/outfits?occasion=${o.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                    <Photo shot={o.image} ar="4:5" alt={o.name} sizes="(max-width: 1024px) 50vw, 33vw" className="transition duration-[1.4s] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/15" />
                    <span className="glass absolute bottom-3 left-3 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]">{count} looks</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl leading-tight sm:text-[1.7rem]">{o.name}</h3>
                  <p className="mt-1 text-sm text-muted">{o.line}</p>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

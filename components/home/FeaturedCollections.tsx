import Link from "next/link";
import { collections } from "@/lib/data";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";
import { ArrowIcon } from "../ui/Icons";

const LAYOUT = ["lg:col-span-7 lg:row-span-2 aspect-[4/5] lg:aspect-auto", "lg:col-span-5 aspect-[4/3]", "lg:col-span-5 aspect-[4/3]", "lg:col-span-12 aspect-[4/5] sm:aspect-[21/9]"];

export function FeaturedCollections() {
  const main = collections.filter((c) => !c.special);
  return (
    <section className="shell py-24 md:py-32">
      <SectionHead eyebrow="Featured Collections" title={<>Four edits, <em>one wardrobe.</em></>} action={{ href: "/collections", label: "All collections" }} />
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-12">
        {main.map((c, i) => (
          <Reveal key={c.slug} delay={i * 80} className={`group relative overflow-hidden bg-ink ${LAYOUT[i]}`}>
            <Link href={`/collections/${c.slug}`} className="absolute inset-0 text-paper">
              <Photo shot={c.image} ar={i === 3 ? "21:9" : i === 0 ? "4:5" : "4:3"} alt={`${c.title}: ${c.line}`} sizes={i === 3 ? "100vw" : "(max-width: 1024px) 100vw, 60vw"} className="transition duration-[1.6s] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-10">
                <div>
                  <p className="eyebrow text-gold-soft">{c.kicker}</p>
                  <h3 className="display mt-3 text-[clamp(2.2rem,5vw,4.5rem)] uppercase leading-none tracking-[0.04em]">{c.title}</h3>
                  <p className="mt-3 text-paper/80">{c.line}</p>
                </div>
                <span className={`glass-dark hidden shrink-0 items-center gap-2 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition group-hover:bg-paper group-hover:text-ink ${i === 1 || i === 2 ? "" : "sm:flex"}`}>
                  Explore Collection <ArrowIcon size={16} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { collections, products } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Icons";

export const metadata: Metadata = { title: "Collections", description: "Kullu Valley, Gaddi & Chamba, Kinnaur & Lahaul and Pahari Byah, plus special edits for couples, families, nati troupes and silver." };

export default function CollectionsPage() {
  const main = collections.filter((c) => !c.special);
  const special = collections.filter((c) => c.special);
  return (
    <>
      <PageHeader eyebrow="Collections" title={<>Edited <em>valley by valley.</em></>} lead="Four valleys, plus special collections for couples, families, nati troupes and heirloom silver." />
      <section className="shell space-y-5 pb-24">
        {main.map((c, i) => {
          const count = products.filter((p) => p.collections.includes(c.slug)).length;
          return (
            <Reveal key={c.slug}>
              <Link href={`/collections/${c.slug}`} className={`group grid overflow-hidden bg-paper md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[520px]">
                  <Photo shot={c.image} ar="4:3" alt={c.title} sizes="(max-width: 768px) 100vw, 50vw" className="transition duration-[1.6s] group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-14">
                  <p className="eyebrow text-gold">{c.kicker}</p>
                  <h2 className="display mt-4 text-[clamp(2.6rem,5vw,5rem)] uppercase leading-none tracking-[0.03em]">{c.title}</h2>
                  <p className="mt-4 text-lg">{c.line}</p>
                  <p className="mt-3 max-w-md leading-relaxed text-muted">{c.story}</p>
                  <p className="mt-10 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em]">
                    Explore Collection · {count} looks <ArrowIcon size={16} className="transition group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </section>
      <section className="bg-ink py-24 text-paper">
        <div className="shell">
          <p className="eyebrow text-gold-soft">Special Collections</p>
          <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4.5rem)]">For two, for the family, for the stage.</h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {special.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <Link href={`/collections/${c.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Photo shot={c.image} ar="3:4" alt={c.title} sizes="(max-width: 640px) 100vw, 25vw" className="transition duration-[1.4s] group-hover:scale-105" />
                  </div>
                  <p className="eyebrow mt-5 text-gold-soft">{c.kicker}</p>
                  <h3 className="mt-2 font-display text-3xl">{c.title}</h3>
                  <p className="mt-1 text-sm text-paper/60">{c.line}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

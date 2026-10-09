import type { Metadata } from "next";
import Link from "next/link";
import { accessories, products } from "@/lib/data";
import { local } from "@/lib/images";
import { inr } from "@/lib/rental";
import { PageHeader } from "@/components/ui/PageHeader";
import { AccessoryIcon } from "@/components/ui/AccessoryIcon";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Accessories", description: "Topis, dora, pula slippers, dhatu and Himachali silver, rented alongside your outfit." };

const GROUPS = [
  { key: "him", title: "For Him" },
  { key: "her", title: "For Her" },
  { key: "unisex", title: "For Everyone" },
] as const;

export default function AccessoriesPage() {
  return (
    <>
      <PageHeader eyebrow="Outfits · Accessories" title={<>The finishing <em>pieces.</em></>} lead="Every accessory is rented with an outfit. Add them on any outfit page or in Complete the Look." image={{ ...local("kinnauri-silver", 0.5), slot: "outfits-accessories" }} />
      <div className="shell space-y-20 py-20">
        {GROUPS.map((g) => (
          <section key={g.key}>
            <h2 className="display mb-8 text-5xl">{g.title}</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {accessories
                .filter((a) => a.for === g.key)
                .map((a, i) => {
                  const pairs = products.filter((p) => p.pairs.includes(a.slug)).slice(0, 3);
                  return (
                    <Reveal as="li" key={a.slug} delay={(i % 4) * 60} className="flex flex-col border border-line bg-paper p-6">
                      <span className="grid h-20 w-20 place-items-center rounded-full bg-sand text-gold">
                        <AccessoryIcon kind={a.icon} size={44} />
                      </span>
                      <p className="mt-6 font-display text-3xl">{a.name}</p>
                      <p className="text-sm text-muted">{inr(a.price)} with any rental</p>
                      {pairs.length > 0 && (
                        <div className="mt-auto pt-6">
                          <p className="eyebrow mb-2 text-muted">Pairs with</p>
                          <div className="flex gap-2">
                            {pairs.map((p) => (
                              <Link key={p.slug} href={`/outfits/${p.slug}`} title={p.name} className="relative aspect-[3/4] w-12 overflow-hidden bg-sand transition hover:opacity-80">
                                <ProductVisual product={p} sizes="48px" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </Reveal>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

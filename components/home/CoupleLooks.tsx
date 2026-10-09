import Link from "next/link";
import { coupleLooks, getProduct } from "@/lib/data";
import { inr } from "@/lib/rental";
import { ProductVisual } from "../ui/ProductVisual";
import { SectionHead } from "../ui/SectionHead";
import { Reveal } from "../ui/Reveal";

export function CoupleLooks() {
  return (
    <section className="shell py-24 md:py-32">
      <SectionHead eyebrow="Couple Looks · His + Hers" title={<>Styled <em>to stand together.</em></>} action={{ href: "/collections/couple-looks", label: "All couple looks" }} />
      <div className="grid gap-10 md:grid-cols-3 md:gap-6">
        {coupleLooks.map((c, i) => {
          const his = getProduct(c.his)!;
          const hers = getProduct(c.hers)!;
          return (
            <Reveal key={c.name} delay={i * 90}>
              <div className="grid grid-cols-2 gap-1.5">
                {[his, hers].map((p) => (
                  <Link key={p.slug} href={`/outfits/${p.slug}`} className="group relative aspect-[3/4] overflow-hidden bg-sand">
                    <ProductVisual product={p} sizes="(max-width: 768px) 50vw, 17vw" className="transition duration-1000 group-hover:scale-105" />
                    <span className="glass absolute inset-x-2 bottom-2 truncate px-2 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em]">{p === his ? "His" : "Hers"} · {p.category}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-3xl">{c.name}</h3>
                <p className="shrink-0 text-sm">{inr(his.price + hers.price)}</p>
              </div>
              <p className="mt-1 text-sm text-muted">{c.line}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

import { products } from "@/lib/data";
import { ProductCard } from "../ProductCard";
import { SectionHead } from "../ui/SectionHead";

export function TrendingOutfits() {
  const list = products.filter((p) => p.trending).slice(0, 8);
  return (
    <section className="shell py-24 md:py-32">
      <SectionHead eyebrow="Trending Outfits" title={<>What everyone&apos;s <em>wearing</em> this season.</>} action={{ href: "/outfits?sort=popular", label: "View all outfits" }} />
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-x-5 sm:gap-y-12 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {list.map((p) => (
          <div key={p.slug} className="w-[72vw] shrink-0 snap-start sm:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

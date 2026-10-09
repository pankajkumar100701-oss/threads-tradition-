import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products, reviews } from "@/lib/data";
import { similarProducts } from "@/lib/rental";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard, ReviewSummary } from "@/components/sections/Reviews";
import { RecentlyViewed } from "@/components/sections/RecentlyViewed";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/outfits/[slug]">): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: p.note } : {};
}

export default async function ProductPage({ params }: PageProps<"/outfits/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const own = reviews.filter((r) => r.outfit === product.slug);
  const shown = own.length ? [...own, ...reviews.filter((r) => r.outfit !== product.slug)].slice(0, 3) : reviews.slice(0, 3);
  const similar = similarProducts(product, 4);

  return (
    <>
      <ProductDetail product={product} />

      <section className="shell mt-24 border-t border-line pt-20">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-gold">Reviews</p>
            <h2 className="display mt-3 text-5xl">What renters say</h2>
          </div>
          <div className="md:w-1/2">
            <ReviewSummary list={own.length ? own : reviews} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {shown.map((r) => (
            <ReviewCard key={r.name} r={r} />
          ))}
        </div>
      </section>

      <section className="shell py-24">
        <p className="eyebrow text-gold">Similar Looks</p>
        <h2 className="display mb-10 mt-3 text-5xl">You may also like</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          {similar.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <RecentlyViewed exclude={product.slug} />
    </>
  );
}

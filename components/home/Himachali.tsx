import Link from "next/link";
import { products } from "@/lib/data";
import { IMG } from "@/lib/images";
import { ProductCard } from "../ProductCard";
import { Photo } from "../ui/Photo";
import { ArrowIcon, MountainIcon } from "../ui/Icons";
import { Reveal } from "../ui/Reveal";

const ITEMS = [
  ["Kullu pattu, koti & topi", "/collections/kullu-valley"],
  ["Gaddi chola & luanchari", "/collections/gaddi-chamba"],
  ["Kinnauri dohru & thepang", "/collections/kinnaur-lahaul"],
  ["Lahauli velvet robe", "/outfits/lahauli-robe"],
  ["Silver heirlooms", "/collections/silver-heirlooms"],
  ["Pahari byah looks", "/collections/pahari-byah"],
];

export function Himachali() {
  const list = products.filter((p) => p.style === "Bridal" && p.status !== "coming-soon").slice(0, 4);
  return (
    <section id="himachal">
      <div className="grain relative isolate overflow-hidden bg-[#1c2a24] text-paper">
        <div className="absolute inset-0 -z-10 opacity-70">
          <Photo shot={{ id: IMG.mountainsTown, fy: 0.45 }} ar="16:9" alt="Snow-capped Himalayan peaks above a valley town" sizes="100vw" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#14201b] via-[#14201b]/80 to-[#14201b]/20" />
        <div className="shell grid gap-14 py-24 md:py-36 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow flex items-center gap-3 text-gold-soft">
              <MountainIcon size={18} /> Valley by Valley
            </p>
            <h2 className="display mt-5 text-[clamp(3rem,7vw,6.5rem)] leading-[0.95]">
              Rooted in the <em className="text-gold-soft">Mountains</em>
            </h2>
            <p className="mt-8 max-w-md font-display text-2xl italic leading-snug text-paper/85">Every valley dresses differently. We carry them all.</p>
            <p className="mt-5 max-w-md leading-relaxed text-paper/65">
              Our pieces come from weaving cooperatives in Kullu, Mandi and Chamba: hand-loomed wool, borders passed down through families, and silver made by local smiths. Each rental sends a share back to the weavers.
            </p>
            <Link href="/collections/pahari-byah" className="btn-light mt-10">
              Explore Pahari Byah <ArrowIcon size={16} />
            </Link>
          </div>
          <ul className="self-end lg:col-span-5 lg:col-start-8">
            {ITEMS.map(([label, href], i) => (
              <Reveal as="li" key={label} delay={i * 60}>
                <Link href={href} className="group flex items-center justify-between border-b border-paper/15 py-5 transition hover:border-gold-soft">
                  <span className="flex items-baseline gap-5">
                    <span className="text-xs text-paper/40">0{i + 1}</span>
                    <span className="font-display text-3xl transition group-hover:translate-x-2 group-hover:text-gold-soft">{label}</span>
                  </span>
                  <ArrowIcon size={18} className="opacity-40 transition group-hover:opacity-100" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-paper">
        <div className="shell grid grid-cols-2 gap-x-4 gap-y-10 py-16 sm:gap-x-5 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

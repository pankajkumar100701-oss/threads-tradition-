import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { collections, getCollection } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { CatalogueRoute } from "@/components/Catalogue";
import { CoupleLooks } from "@/components/home/CoupleLooks";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const c = getCollection((await params).slug);
  return c ? { title: c.title, description: c.story } : {};
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const c = getCollection((await params).slug);
  if (!c) notFound();
  return (
    <>
      <PageHeader eyebrow={c.kicker} title={c.title} lead={c.story} image={c.image} />
      <nav aria-label="Other collections" className="shell no-scrollbar flex gap-2 overflow-x-auto py-8">
        {collections.map((x) => (
          <Link key={x.slug} href={`/collections/${x.slug}`} className={`chip shrink-0 ${x.slug === c.slug ? "chip-on" : "bg-paper"}`}>
            {x.title}
          </Link>
        ))}
      </nav>
      {c.slug === "couple-looks" && <CoupleLooks />}
      <Suspense fallback={<div className="min-h-screen" />}>
        <CatalogueRoute fixed={{ collection: c.slug }} />
      </Suspense>
    </>
  );
}

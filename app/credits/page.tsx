import type { Metadata } from "next";
import Image from "next/image";
import { credits } from "@/lib/credits";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Photo Credits", description: "Photographers whose openly licensed work appears on Threads & Tradition." };

export default function CreditsPage() {
  return (
    <>
      <PageHeader eyebrow="Credits" title={<>With thanks to <em>the photographers.</em></>} lead="Product and culture photographs from Wikimedia Commons, used under their open licences. Other imagery is from Unsplash." />
      <section className="shell pb-24">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {credits.map((c) => (
            <li key={c.file} className="flex gap-4 border border-line bg-paper p-3">
              <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-sand">
                <Image src={`/images/commons/${c.file}.jpg`} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span className="min-w-0 text-sm">
                <a href={c.source} target="_blank" rel="noopener noreferrer" className="link-u block truncate font-medium">
                  {c.title}
                </a>
                <span className="block text-muted">by {c.artist}</span>
                <span className="text-xs uppercase tracking-[0.12em] text-gold">{c.license}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

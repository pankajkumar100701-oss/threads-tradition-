import type { Metadata } from "next";
import { posts } from "@/lib/data";
import { local } from "@/lib/images";
import { PageHeader } from "@/components/ui/PageHeader";
import { PostCard } from "@/components/sections/JournalPreview";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Journal", description: "Styling guides, Himachali culture and photoshoot notes from Threads & Tradition." };

export default function JournalPage() {
  const [first, ...rest] = posts;
  return (
    <>
      <PageHeader eyebrow="The Journal" title={<>Notes on <em>dressing well.</em></>} lead="Guides, culture and styling from our studio in the hills." image={{ ...local("pattu-loom-teal", 0.5), slot: "journal-editorial" }} />
      <section className="shell grid gap-x-6 gap-y-14 pb-28 lg:grid-cols-2">
        <Reveal className="lg:row-span-2">
          <PostCard post={first} big />
        </Reveal>
        {rest.map((p, i) => (
          <Reveal key={p.slug} delay={i * 60}>
            <PostCard post={p} />
          </Reveal>
        ))}
      </section>
    </>
  );
}

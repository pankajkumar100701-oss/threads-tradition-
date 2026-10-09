import Link from "next/link";
import { posts } from "@/lib/data";
import { Photo } from "../ui/Photo";
import { SectionHead } from "../ui/SectionHead";
import { Reveal } from "../ui/Reveal";

export function PostCard({ post, big }: { post: (typeof posts)[number]; big?: boolean }) {
  return (
    <Link href={`/journal/${post.slug}`} className="group block">
      <div className={`relative overflow-hidden bg-sand ${big ? "aspect-[4/5] lg:aspect-[5/6]" : "aspect-[4/3]"}`}>
        <Photo shot={post.image} ar={big ? "5:6" : "4:3"} alt={post.title} sizes={big ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"} className="transition duration-[1.4s] group-hover:scale-105" />
      </div>
      <p className="eyebrow mt-5 text-gold">
        {post.category} · {post.minutes} min read
      </p>
      <h3 className={`mt-2 font-display leading-tight transition group-hover:text-wine ${big ? "text-4xl" : "text-2xl"}`}>{post.title}</h3>
      {big && <p className="mt-3 max-w-lg text-muted">{post.dek}</p>}
    </Link>
  );
}

export function JournalPreview() {
  const [first, ...rest] = posts;
  return (
    <section className="shell py-24 md:py-32">
      <SectionHead eyebrow="The Journal" title={<>Notes on <em>dressing well.</em></>} action={{ href: "/journal", label: "Read the journal" }} />
      <div className="grid gap-x-6 gap-y-12 lg:grid-cols-2">
        <Reveal>
          <PostCard post={first} big />
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

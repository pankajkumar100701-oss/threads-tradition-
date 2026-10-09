import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { PostCard } from "@/components/sections/JournalPreview";
import { ArrowIcon } from "@/components/ui/Icons";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const p = getPost((await params).slug);
  return p ? { title: p.title, description: p.dek } : {};
}

export default async function PostPage({ params }: PageProps<"/journal/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  return (
    <article>
      <PageHeader eyebrow={`${post.category} · ${post.minutes} min read`} title={post.title} lead={post.dek} image={post.image} />
      <div className="shell max-w-3xl py-20">
        {post.body.map((para, i) => (
          <p key={i} className={`mb-7 leading-[1.85] text-ink-soft ${i === 0 ? "font-display text-2xl leading-snug first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-wine" : "text-lg"}`}>
            {para}
          </p>
        ))}
        <Link href="/outfits" className="btn-dark mt-6">
          Shop the looks <ArrowIcon size={16} />
        </Link>
      </div>
      <section className="shell border-t border-line py-20">
        <p className="eyebrow mb-8 text-gold">Keep reading</p>
        <div className="grid gap-8 sm:grid-cols-2">
          {more.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </article>
  );
}

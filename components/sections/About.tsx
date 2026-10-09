import Link from "next/link";
import { local } from "@/lib/images";
import { Photo } from "../ui/Photo";
import { ArrowIcon } from "../ui/Icons";

export function AboutTeaser({ full }: { full?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-sand">
      <div className="shell grid items-center gap-12 py-24 md:py-36 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-gold">About</p>
          <h2 className="display mt-6 text-[clamp(3rem,7.5vw,7rem)] leading-[0.92]">
            Fashion shouldn&apos;t live <em className="text-wine">in your wardrobe.</em>
          </h2>
          <div className="mt-10 grid max-w-2xl gap-6 leading-relaxed text-muted sm:grid-cols-2">
            <p>A real pattu or chola takes weeks on the loom, and most families now only bring theirs out once a year. We think the dress of the hills should be worn, and worn again, by the people who need it on the day they need it.</p>
            <p>So we buy fewer, better pieces: handloom pattus and shawls, Gaddi cholas and luancharis, and silver from local smiths. We care for them properly and pass them from one byah, mela and stage to the next.</p>
          </div>
          {!full && (
            <Link href="/about" className="btn-line mt-10">
              Our Philosophy <ArrowIcon size={16} />
            </Link>
          )}
        </div>
        <div className="relative lg:col-span-5">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Photo shot={local("loom-2", 0.5)} ar="3:4" alt="A Kullvi pattu taking shape on a handloom" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
          <div className="glass absolute -bottom-6 -left-4 p-6 sm:-left-10">
            <p className="display text-5xl">1 → 12</p>
            <p className="mt-1 max-w-[12rem] text-xs uppercase tracking-[0.14em] text-muted">Celebrations, on average, each outfit is worn for</p>
          </div>
        </div>
      </div>
    </section>
  );
}

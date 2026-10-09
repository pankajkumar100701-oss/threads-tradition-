import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80vh] flex-col items-start justify-center pb-20 pt-40">
      <p className="eyebrow text-gold">404 · Not found</p>
      <h1 className="display mt-4 text-[clamp(3rem,8vw,7rem)] leading-[0.95]">
        This look has <em className="text-wine">left the wardrobe.</em>
      </h1>
      <p className="mt-6 max-w-md text-muted">The page you&apos;re after doesn&apos;t exist, or the outfit has been retired. Plenty more where it came from.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/outfits" className="btn-dark">
          Browse Outfits
        </Link>
        <Link href="/" className="btn-line">
          Back Home
        </Link>
      </div>
    </section>
  );
}

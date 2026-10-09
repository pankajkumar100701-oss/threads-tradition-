const ITEMS = [
  "Handloom wool cleaned by hand, included",
  "₹1,000 deposit, fully refundable",
  "Delivered steamed, a day early",
  "Free size swap within 3 hours",
  "Free fittings in Shimla, Manali and Chandigarh",
  "Matching nati sets for troupes of up to 20",
  "4.9★ from 4,200+ renters",
];

/** A slow scrolling strip of rental promises. */
export function TrustMarquee() {
  const row = (
    <ul className="flex shrink-0 items-center gap-10 pr-10">
      {ITEMS.map((t) => (
        <li key={t} className="flex items-center gap-10 whitespace-nowrap">
          <span>{t}</span>
          <span className="text-gold" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mt-10 overflow-hidden border-y border-line bg-paper py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink/75" aria-label="Why rent with us">
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
        {row}
        <div aria-hidden="true">{row}</div>
      </div>
    </div>
  );
}

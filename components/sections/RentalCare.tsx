import { local } from "@/lib/images";
import { BoxIcon, LoupeIcon, SparkIcon, SteamIcon } from "../ui/Icons";
import { Photo } from "../ui/Photo";

const CARE = [
  [SparkIcon, "Professional Cleaning", "Dry-cleaned or hand-washed according to the fabric, never one-size-fits-all."],
  [LoupeIcon, "Quality Inspection", "Every seam, border and silver hook checked under daylight lamps before it goes out."],
  [SteamIcon, "Steam Pressing", "Steamed rather than ironed, so handloom wool, velvet and borders keep their finish."],
  [BoxIcon, "Secure Packaging", "Sealed in a breathable garment bag with tissue, delivered on a hanger."],
] as const;

export function RentalCare() {
  return (
    <section className="grid bg-ink text-paper lg:grid-cols-2">
      <div className="relative min-h-[420px]">
        <Photo shot={local("pattu-weave-1", 0.5)} ar="1:1" alt="Close-up of a Kullu handloom border in pink, green and gold wool" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      <div className="px-4 py-20 sm:px-10 lg:px-16 lg:py-28">
        <p className="eyebrow text-gold-soft">Rental Care</p>
        <h2 className="display mt-4 text-[clamp(2.6rem,5vw,4.5rem)] leading-[1]">
          We take care <em className="text-gold-soft">of the outfit.</em>
        </h2>
        <p className="mt-5 max-w-md text-paper/65">You wear it. Cleaning, repairs and pressing are on us, and they&apos;re included in every rental.</p>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2">
          {CARE.map(([Icon, t, d]) => (
            <li key={t}>
              <Icon size={28} className="text-gold-soft" />
              <p className="mt-4 font-display text-2xl">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { DEPOSIT, DELIVERY_FEE, PROTECTION_FEE } from "@/lib/data";
import { inr } from "@/lib/rental";
import { local } from "@/lib/images";
import { PageHeader } from "@/components/ui/PageHeader";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { RentalCare } from "@/components/sections/RentalCare";
import { Faq } from "@/components/sections/Faq";

export const metadata: Metadata = { title: "How It Works", description: "Choose, reserve, wear, return. Sizing, rental policy, returns and FAQ." };

const MEN = [
  ["S", "36–37", "29–30", "165–172"],
  ["M", "38–39", "31–32", "170–177"],
  ["L", "40–42", "33–35", "174–182"],
  ["XL", "43–45", "36–38", "176–186"],
  ["XXL", "46–48", "39–42", "178–190"],
];
const WOMEN = [
  ["XS", "31–32", "24–26", "150–158"],
  ["S", "33–34", "26–28", "155–163"],
  ["M", "35–36", "28–30", "158–167"],
  ["L", "37–39", "30–33", "160–170"],
  ["XL", "40–42", "33–36", "162–174"],
];

function SizeTable({ title, rows, chest }: { title: string; rows: string[][]; chest: string }) {
  return (
    <div>
      <p className="eyebrow mb-4 text-muted">{title}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink">
              {["Size", `${chest} (in)`, "Waist (in)", "Height (cm)"].map((h) => (
                <th key={h} className="py-3 pr-4 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-line">
                {r.map((c, i) => (
                  <td key={i} className={`py-3 pr-4 ${i === 0 ? "font-display text-xl" : "text-muted"}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader eyebrow="How It Works" title={<>Rent it. Wear it. <em>Return it.</em></>} lead="Everything you need to know, from booking to giving it back." image={{ ...local("loom-1", 0.55), slot: "how-it-works" }} />
      <HowItWorks heading={false} />

      <section id="size-guide" className="shell scroll-mt-24 py-24">
        <p className="eyebrow text-gold">Size Guide</p>
        <h2 className="display mt-4 text-5xl">Measure once, wear well.</h2>
        <p className="mt-4 max-w-xl text-muted">Every outfit page has a Find My Size tool. These charts are what it&apos;s based on. Pattus and shawls are free size, luancharis have adjustable waists, and Kids sizes fit ages 8–12 (125–150 cm).</p>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <SizeTable title="Menswear" rows={MEN} chest="Chest" />
          <SizeTable title="Womenswear" rows={WOMEN} chest="Bust" />
        </div>
      </section>

      <section id="policy" className="scroll-mt-24 bg-paper py-24">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-gold">Rental Policy</p>
            <h2 className="display mt-4 text-5xl">The fine print, made plain.</h2>
          </div>
          <div className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-8">
            {[
              ["Rental periods", "2, 3, 5 or 7 days. Your rental starts on the first day you choose; we deliver the day before."],
              ["Pricing", "The price shown includes cleaning. Longer rentals cost less per day."],
              ["Security deposit", `${inr(DEPOSIT)} per order, fully refundable within 48 hours of return once the outfit passes inspection.`],
              ["Delivery", `${inr(DELIVERY_FEE)} home delivery, or free pickup from our Shimla studio.`],
              ["Rental Protection", `Optional, ${inr(PROTECTION_FEE)} per outfit. Covers accidental damage up to ₹5,000, so tears, spills and lost buttons come out of our pocket, not your deposit.`],
              ["Extensions", "Extend from My Rentals at any time before your return date, subject to availability."],
            ].map(([t, d]) => (
              <div key={t} className="bg-paper p-8">
                <p className="font-display text-2xl">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="returns" className="shell scroll-mt-24 py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-gold">Returns</p>
            <h2 className="display mt-4 text-5xl">Giving it back.</h2>
          </div>
          <ol className="space-y-6 lg:col-span-8">
            {[
              "Don't wash, iron or steam the outfit. We handle that.",
              "Fold it into the garment bag it came in, with any accessories in the pouch.",
              "We collect it the day after your rental ends. Or drop it at the studio.",
              "We inspect it and refund your deposit within 48 hours.",
            ].map((s, i) => (
              <li key={s} className="flex gap-6 border-b border-line pb-6">
                <span className="display text-4xl text-gold">0{i + 1}</span>
                <span className="pt-2 text-lg">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <RentalCare />
      <Faq />
      <section className="shell pb-24 text-center">
        <Link href="/outfits" className="btn-dark">
          Start browsing
        </Link>
      </section>
    </>
  );
}

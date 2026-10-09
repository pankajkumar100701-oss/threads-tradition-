import type { Metadata } from "next";
import { IMG } from "@/lib/images";
import { PageHeader } from "@/components/ui/PageHeader";
import { AboutTeaser } from "@/components/sections/About";
import { RentalCare } from "@/components/sections/RentalCare";

export const metadata: Metadata = { title: "About", description: "Why Threads & Tradition rents instead of sells: fewer, better outfits, worn by more people." };

const NUMBERS = [
  ["4,200+", "Looks rented"],
  ["12×", "Average wears per outfit"],
  ["38", "Weavers in our Kullu cooperative"],
  ["48 hrs", "Deposit refund time"],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About Threads & Tradition" title={<>Wear the moment. <em>Return the memory.</em></>} image={{ id: IMG.peaksCloud, fy: 0.5 }} />
      <AboutTeaser full />
      <section className="shell grid gap-px bg-line py-px sm:grid-cols-2 lg:grid-cols-4">
        {NUMBERS.map(([n, l]) => (
          <div key={l} className="bg-ivory p-10">
            <p className="display text-6xl">{n}</p>
            <p className="eyebrow mt-3 text-muted">{l}</p>
          </div>
        ))}
      </section>
      <RentalCare />
      <section id="contact" className="shell grid scroll-mt-24 gap-12 py-24 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-gold">Contact</p>
          <h2 className="display mt-4 text-5xl">Come say hello.</h2>
          <p className="mt-4 max-w-md text-muted">Fittings by appointment at our Shimla studio. Bridal and family bookings get a dedicated stylist.</p>
        </div>
        <dl className="grid gap-8 sm:grid-cols-2">
          {[
            ["Studio", "The Ridge, Mall Road\nShimla 171001"],
            ["Hours", "Tue–Sun, 11am–8pm\nMondays by appointment"],
            ["Email", "hello@threadsandtradition.in"],
            ["Phone", "+91 98160 00000"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow text-muted">{k}</dt>
              <dd className="mt-2 whitespace-pre-line font-display text-2xl">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

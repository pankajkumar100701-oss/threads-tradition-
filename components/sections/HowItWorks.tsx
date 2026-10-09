import { SectionHead } from "../ui/SectionHead";
import { Reveal } from "../ui/Reveal";

const STEPS = [
  ["Choose", "Find your outfit.", "Browse by occasion, take the quiz, or build a look from scratch."],
  ["Reserve", "Select your dates and size.", "Live availability, a size finder, and a refundable deposit."],
  ["Wear", "Receive your outfit.", "Delivered steamed and ready the day before your event."],
  ["Return", "Return it after your event.", "Pack it in the garment bag and we pick it up. No washing needed."],
];

export function HowItWorks({ heading = true }: { heading?: boolean }) {
  return (
    <section id="how" className="scroll-mt-20 bg-paper py-24 md:py-32">
      <div className="shell">
        {heading && <SectionHead eyebrow="How It Works" title={<>Four steps. <em>No wardrobe required.</em></>} center />}
        <ol className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, line, more], i) => (
            <Reveal as="li" key={t} delay={i * 90} className="bg-paper p-8 sm:p-10">
              <p className="display text-7xl text-gold/70">0{i + 1}</p>
              <p className="eyebrow mt-8">{t}</p>
              <p className="mt-3 font-display text-2xl">{line}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{more}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { faqs } from "@/lib/data";
import { PlusIcon } from "../ui/Icons";

export function Faq({ heading = true }: { heading?: boolean }) {
  return (
    <section id="faq" className="shell scroll-mt-24 py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12">
        {heading && (
          <div className="lg:col-span-4">
            <p className="eyebrow text-gold">FAQ</p>
            <h2 className="display mt-4 text-[clamp(2.6rem,5vw,4.5rem)] leading-[1]">
              Questions, <em>answered.</em>
            </h2>
            <p className="mt-5 text-muted">
              Still unsure? Write to <a className="link-u text-ink" href="mailto:hello@threadsandtradition.in">hello@threadsandtradition.in</a>
            </p>
          </div>
        )}
        <div className={heading ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-12"}>
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-line [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-2xl">
                {f.q}
                <PlusIcon size={20} className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-2xl pb-7 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

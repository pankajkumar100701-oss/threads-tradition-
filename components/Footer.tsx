"use client";

import Link from "next/link";
import { useState } from "react";
import { Wordmark } from "./ui/Wordmark";
import { ArrowIcon, CheckIcon } from "./ui/Icons";

const COLS = [
  {
    title: "Explore",
    links: [
      ["/collections", "Collections"],
      ["/outfits", "Outfits"],
      ["/occasions", "Occasions"],
      ["/outfits?sort=new", "New Arrivals"],
      ["/quiz", "Style Quiz"],
    ],
  },
  {
    title: "Help",
    links: [
      ["/how-it-works", "How It Works"],
      ["/studio", "Studio Trial"],
      ["/how-it-works#size-guide", "Size Guide"],
      ["/how-it-works#policy", "Rental Policy"],
      ["/how-it-works#returns", "Returns"],
      ["/how-it-works#faq", "FAQ"],
    ],
  },
  {
    title: "Company",
    links: [
      ["/about", "About"],
      ["/journal", "Journal"],
      ["/about#contact", "Contact"],
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="grain relative mt-auto overflow-hidden bg-ink text-paper">
      <div className="shell relative grid gap-14 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Wordmark className="text-4xl sm:text-5xl [&_em]:text-gold-soft" />
          <p className="mt-4 font-display text-2xl italic text-gold-soft">Wear the moment. Return the memory.</p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-4">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="eyebrow mb-5 text-gold-soft">{c.title}</p>
              <ul className="space-y-3 text-sm text-paper/75">
                {c.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="link-u hover:text-paper">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <p className="eyebrow mb-5 text-gold-soft">Newsletter</p>
          <p className="display text-3xl">Get the latest looks.</p>
          <p className="mt-2 text-sm text-paper/60">New arrivals, styling notes and early access to the wedding season. No spam.</p>
          {done ? (
            <p className="mt-6 flex items-center gap-2 text-sm text-gold-soft">
              <CheckIcon size={18} /> You&apos;re on the list. Watch your inbox.
            </p>
          ) : (
            <form
              className="mt-6 flex border-b border-paper/40 focus-within:border-paper"
              onSubmit={(e) => {
                e.preventDefault();
                if (/\S+@\S+\.\S+/.test(email)) setDone(true);
              }}
            >
              <label htmlFor="newsletter" className="sr-only">
                Your email
              </label>
              <input
                id="newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="h-12 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-paper/40"
              />
              <button aria-label="Subscribe" className="grid h-12 w-12 place-items-center transition hover:text-gold-soft">
                <ArrowIcon />
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="shell relative flex flex-col justify-between gap-3 border-t border-paper/10 py-6 text-xs text-paper/45 sm:flex-row">
        <p>© 2026 Threads &amp; Tradition Studio · Shimla · Kullu · Chandigarh</p>
        <p>
          Photography via Unsplash and{" "}
          <Link href="/credits" className="underline underline-offset-2 hover:text-paper">
            Wikimedia Commons contributors
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}

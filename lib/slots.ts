/**
 * Named image slots for the brand's own campaign photography.
 * Put a file named after the slot in public/images (e.g. public/images/home-hero.jpg) and restart the dev server;
 * until then each slot falls back to its stock photo.
 */
export const SLOTS = [
  "home-hero",
  "collection-kullu",
  "collection-gaddi",
  "collection-kinnaur",
  "collection-byah",
  "outfits-men",
  "outfits-women",
  "outfits-accessories",
  "occasion-wedding",
  "occasion-party",
  "occasion-festival",
  "occasion-photoshoot",
  "outfit-builder",
  "style-quiz",
  "how-it-works",
  "journal-editorial",
  "journal-culture",
] as const;

export type Slot = (typeof SLOTS)[number];

const files = (process.env.NEXT_PUBLIC_LOCAL_IMAGES ?? "").split(",").filter(Boolean);

export function localImage(slot: string): string | null {
  const f = files.find((x) => x.replace(/\.[^.]+$/, "") === slot);
  return f ? `/images/${f}` : null;
}

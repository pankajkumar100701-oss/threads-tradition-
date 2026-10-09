export type Shot = {
  /** Unsplash photo id */
  id?: string;
  /** local file under /public, used instead of `id` */
  src?: string;
  /** focal point, 0–1 */
  fx?: number;
  fy?: number;
  /** zoom factor around the focal point */
  zoom?: number;
  flip?: boolean;
  /** brand image slot that overrides this photo when present (see lib/slots.ts) */
  slot?: import("./slots").Slot;
};

const BASE = "https://images.unsplash.com/photo-";

/** An openly licensed photo from Wikimedia Commons, stored in /public/images/commons (credits in lib/credits.ts). */
export const local = (name: string, fy = 0.4, fx = 0.5): Shot => ({ src: `/images/commons/${name}.jpg`, fx, fy });

/**
 * Unsplash (imgix) URL without a width; the image loader adds `w` for each srcset entry.
 * `ar` is an aspect ratio like "3:4".
 */
export function photo(shot: Shot | string, ar?: string): string {
  const s: Shot = typeof shot === "string" ? { id: shot } : shot;
  if (s.src) return s.src;
  const params = new URLSearchParams({ auto: "format", fit: "crop" });
  if (ar) params.set("ar", ar);
  if (s.zoom || s.fx !== undefined || s.fy !== undefined) {
    params.set("crop", "focalpoint");
    params.set("fp-x", String(s.fx ?? 0.5));
    params.set("fp-y", String(s.fy ?? 0.5));
    if (s.zoom) params.set("fp-z", String(s.zoom));
  }
  if (s.flip) params.set("flip", "h");
  return `${BASE}${s.id}?${params.toString()}`;
}

/** Editorial imagery used outside the product catalogue. */
export const IMG = {
  mountainsTown: "1597167231350-d057a45dc868",
  peaksCloud: "1506905925346-21bda4d32df4",
} as const;

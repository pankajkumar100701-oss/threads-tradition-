"use client";

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://images.unsplash.com/")) return `${src}&w=${width}&q=${quality || 72}`;
  return `${src}?w=${width}`;
}

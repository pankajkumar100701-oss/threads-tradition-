import Image from "next/image";
import { photo, type Shot } from "@/lib/images";
import { localImage } from "@/lib/slots";

/** A cropped Unsplash photo that fills its (relatively positioned) parent. */
export function Photo({
  shot,
  alt,
  ar = "3:4",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
  className = "",
}: {
  shot: Shot | string;
  alt: string;
  ar?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const local = typeof shot !== "string" && shot.slot ? localImage(shot.slot) : null;
  if (local) return <Image src={local} alt={alt} fill sizes={sizes} preload={priority} loading={priority ? "eager" : undefined} className={`object-cover ${className}`} />;
  if (typeof shot !== "string" && shot.src) {
    // Local files can't be cropped by a CDN, so focal point, zoom and flip are applied with CSS.
    const pos = `${(shot.fx ?? 0.5) * 100}% ${(shot.fy ?? 0.5) * 100}%`;
    const transform = [shot.zoom ? `scale(${shot.zoom})` : "", shot.flip ? "scaleX(-1)" : ""].join(" ").trim();
    return (
      <span className="absolute inset-0 overflow-hidden">
        <Image
          src={shot.src}
          alt={alt}
          fill
          sizes={sizes}
          preload={priority}
          loading={priority ? "eager" : undefined}
          className={`object-cover ${className}`}
          style={{ objectPosition: pos, transform: transform || undefined, transformOrigin: pos }}
        />
      </span>
    );
  }
  return <Image src={photo(shot, ar)} alt={alt} fill sizes={sizes} preload={priority} loading={priority ? "eager" : undefined} className={`object-cover ${className}`} />;
}

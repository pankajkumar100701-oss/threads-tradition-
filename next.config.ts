import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Generated campaign images dropped into public/images/<slot>.jpg replace the stock fallbacks (see lib/slots.ts).
const dir = path.join(process.cwd(), "public", "images");
const localImages = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)) : [];

const nextConfig: NextConfig = {
  // A stray lockfile in the parent folder would otherwise be picked as the workspace root.
  turbopack: { root: process.cwd() },
  env: {
    NEXT_PUBLIC_LOCAL_IMAGES: localImages.join(","),
  },
  images: {
    // Unsplash serves resized crops directly from its CDN, so the loader just sets the width.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
};

export default nextConfig;

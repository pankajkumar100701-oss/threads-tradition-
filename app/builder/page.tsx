import type { Metadata } from "next";
import { local } from "@/lib/images";
import { PageHeader } from "@/components/ui/PageHeader";
import { OutfitBuilder } from "@/components/home/OutfitBuilder";
import { CompleteTheLook } from "@/components/home/CompleteTheLook";

export const metadata: Metadata = { title: "Outfit Builder", description: "Build your look step by step: outfit, colour, accessories and size, with a live preview." };

export default function BuilderPage() {
  return (
    <>
      <PageHeader eyebrow="Outfit Builder" title={<>Style it <em>your way.</em></>} lead="Pick the silhouette, the colour and the finishing pieces. We'll match it to our wardrobe." image={{ ...local("loom-2", 0.55), slot: "outfit-builder" }} />
      <OutfitBuilder />
      <CompleteTheLook />
    </>
  );
}

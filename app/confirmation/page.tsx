import type { Metadata } from "next";
import { Suspense } from "react";
import { Confirmation } from "@/components/Confirmation";

export const metadata: Metadata = { title: "Reserved" };

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Confirmation />
    </Suspense>
  );
}

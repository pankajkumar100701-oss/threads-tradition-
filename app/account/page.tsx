import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountView } from "@/components/AccountView";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AccountView />
    </Suspense>
  );
}

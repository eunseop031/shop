import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutFail } from "@/components/CheckoutResult";

export const metadata: Metadata = { title: "결제 실패", robots: { index: false } };

export default function CheckoutFailPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Suspense fallback={null}>
        <CheckoutFail />
      </Suspense>
    </div>
  );
}

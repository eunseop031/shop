import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutSuccess } from "@/components/CheckoutResult";

export const metadata: Metadata = { title: "결제 완료", robots: { index: false } };

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Suspense fallback={<p className="py-24 text-center text-muted">결제를 확인하는 중입니다…</p>}>
        <CheckoutSuccess />
      </Suspense>
    </div>
  );
}

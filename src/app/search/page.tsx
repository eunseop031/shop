import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductBrowser } from "@/components/ProductBrowser";

export const metadata: Metadata = {
  title: "검색 결과",
  robots: { index: false },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-24 text-center text-muted sm:px-6">검색 중…</div>}>
      <ProductBrowser mode="search" />
    </Suspense>
  );
}

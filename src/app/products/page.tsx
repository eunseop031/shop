import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductBrowser } from "@/components/ProductBrowser";

export const metadata: Metadata = {
  title: "전체 상품",
  description: "상의, 하의, 아우터, 액세서리까지 NOIR & CO.의 모든 상품을 둘러보세요.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-24 text-center text-muted sm:px-6">상품을 불러오는 중…</div>}>
      <ProductBrowser mode="list" />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ProductBrowser } from "@/components/ProductBrowser";
import { StaticCatalog } from "@/components/StaticCatalog";
import { PRODUCTS } from "@/lib/products";
import { breadcrumbLd, itemListLd } from "@/lib/seo";

const DESCRIPTION =
  "상의, 하의, 아우터, 액세서리까지 NOIR & CO.의 모든 상품을 둘러보세요. 가격대·사이즈·색상 필터와 정렬을 지원합니다.";

export const metadata: Metadata = {
  title: "전체 상품",
  description: DESCRIPTION,
  // ?category=, ?sort= 등 쿼리 변형은 모두 이 주소로 정규화합니다.
  alternates: { canonical: "/products" },
  openGraph: { title: "전체 상품", description: DESCRIPTION, url: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "홈", path: "/" }, { name: "전체 상품", path: "/products" }])} />
      <JsonLd data={itemListLd("전체 상품", PRODUCTS)} />
      <Suspense fallback={<StaticCatalog title="전체 상품" description={DESCRIPTION} products={PRODUCTS} />}>
        <ProductBrowser mode="list" />
      </Suspense>
    </>
  );
}

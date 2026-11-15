import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductCard";

/**
 * 서버에서 렌더링되는 상품 목록. 클라이언트 필터 UI(ProductBrowser)가 로드되기 전/크롤러에게
 * 제목·설명·전체 상품 링크가 담긴 HTML을 제공하기 위한 Suspense fallback입니다.
 */
export function StaticCatalog({
  title,
  description,
  products,
}: {
  title: string;
  description: string;
  products: Product[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="border-b border-line pb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        <p className="mt-1 text-sm text-muted">{products.length}개의 상품</p>
      </div>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

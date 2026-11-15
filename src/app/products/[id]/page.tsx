import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductCard";
import { ProductPurchase } from "@/components/PurchasePanel";
import { effectivePrice, getProduct, PRODUCTS, relatedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";

// 모든 상품은 generateStaticParams로 미리 생성됩니다. 알 수 없는 ID만 요청 시 렌더링해 404를 반환하므로
// 이 라우트는 블로킹을 허용합니다. (스트리밍하면 존재하지 않는 상품도 200으로 응답하게 됨)
export const instant = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "상품을 찾을 수 없습니다" };
  return {
    title: product.name,
    description: `${product.name} ${formatPrice(effectivePrice(product))} — ${product.description}`,
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const related = relatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <ProductPurchase product={product} />
      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-6 text-xl font-bold">함께 보면 좋은 상품</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}

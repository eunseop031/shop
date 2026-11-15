import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/ProductCard";
import { ProductPurchase } from "@/components/PurchasePanel";
import { CATEGORY_LABEL } from "@/lib/brand";
import { formatPrice } from "@/lib/format";
import { effectivePrice, getProduct, PRODUCTS, relatedProducts } from "@/lib/products";
import { breadcrumbLd, productLd } from "@/lib/seo";

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

  const description = `${product.name} ${formatPrice(effectivePrice(product))}. ${product.description}`;
  const image = product.images[0];
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: product.name,
      description,
      url: `/products/${product.id}`,
      type: "website",
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
    twitter: { card: "summary_large_image", title: product.name, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const related = relatedProducts(product);
  const categoryLabel = CATEGORY_LABEL[product.category];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <JsonLd data={productLd(product)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: categoryLabel, path: `/category/${product.category}` },
          { name: product.name, path: `/products/${product.id}` },
        ])}
      />
      <nav aria-label="현재 위치" className="mb-6 text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:underline">홈</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/category/${product.category}`} className="hover:underline">{categoryLabel}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">{product.name}</li>
        </ol>
      </nav>
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

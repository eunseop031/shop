import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ProductBrowser } from "@/components/ProductBrowser";
import { StaticCatalog } from "@/components/StaticCatalog";
import { CATEGORIES } from "@/lib/brand";
import { PRODUCTS } from "@/lib/products";
import { breadcrumbLd, CATEGORY_COPY, itemListLd } from "@/lib/seo";

// 알 수 없는 slug만 요청 시 렌더링해 404를 반환합니다.
export const instant = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const copy = CATEGORY_COPY[slug];
  if (!copy) return { title: "카테고리를 찾을 수 없습니다" };
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title: copy.title, description: copy.description, url: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const copy = CATEGORY_COPY[slug];
  if (!copy) notFound();
  const products = PRODUCTS.filter((p) => p.category === slug);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: copy.title, path: `/category/${slug}` },
        ])}
      />
      <JsonLd data={itemListLd(copy.title, products)} />
      <Suspense fallback={<StaticCatalog title={copy.title} description={copy.description} products={products} />}>
        <ProductBrowser mode="list" fixedCategory={slug} description={copy.description} />
      </Suspense>
    </>
  );
}

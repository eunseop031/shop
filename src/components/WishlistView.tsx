"use client";

import Link from "next/link";
import { getProduct } from "@/lib/products";
import { useWishlistIds } from "@/lib/store";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductCard";

export function WishlistView() {
  const ids = useWishlistIds();
  const products = ids.map(getProduct).filter((p): p is Product => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-medium">위시리스트가 비어 있습니다.</p>
        <p className="mt-2 text-sm text-muted">마음에 드는 상품의 ♡를 눌러 담아 보세요.</p>
        <Link href="/products" className="mt-6 inline-block border border-ink px-8 py-3 text-sm font-medium hover:bg-ink hover:text-paper">
          상품 둘러보기
        </Link>
      </div>
    );
  }
  return <ProductGrid products={products} />;
}

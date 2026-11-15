import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CATEGORIES } from "@/lib/brand";
import { PRODUCTS } from "@/lib/products";

// SEO: Cache Components에서는 dynamicParams = false를 쓸 수 없어서, 알 수 없는 상품/카테고리 URL이
// "첫 요청에 200(소프트 404)"으로 응답하는 문제를 막기 위해 요청 단계에서 정확한 404로 돌려보냅니다.
const PRODUCT_IDS = new Set(PRODUCTS.map((p) => p.id));
const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));

export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  const known = section === "products" ? PRODUCT_IDS.has(slug) : CATEGORY_IDS.has(slug);
  if (known) return NextResponse.next();
  // 존재하지 않는 경로로 rewrite하면 not-found 페이지가 404 상태로 렌더링됩니다.
  return NextResponse.rewrite(new URL("/_not-found-404", request.url));
}

export const config = {
  matcher: ["/products/:slug", "/category/:slug"],
};

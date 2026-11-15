import { BRAND, CATEGORIES } from "@/lib/brand";
import { CATEGORY_COPY, FAQ } from "@/lib/seo";
import { effectivePrice, PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { absUrl } from "@/lib/site";

// llms.txt: 생성형 AI가 사이트를 이해하기 쉽도록 요약과 핵심 링크를 제공하는 파일 (https://llmstxt.org)
export function GET() {
  const lines: string[] = [
    `# ${BRAND.name}`,
    "",
    `> ${BRAND.description} 20~30대 남녀 공용 캐주얼 의류 ${PRODUCTS.length}종을 상의·하의·아우터·액세서리로 나눠 소개합니다. 포트폴리오/학습용 데모 사이트이며 실제 판매·배송은 이루어지지 않고, 결제는 테스트 환경으로만 동작합니다. 상품 정보와 사진은 가상의 샘플입니다.`,
    "",
    "## 주요 페이지",
    `- [홈](${absUrl("/")}): 신상품과 베스트 상품, 자주 묻는 질문`,
    `- [전체 상품](${absUrl("/products")}): 필터(가격·사이즈·색상)와 정렬을 지원하는 전체 상품 목록`,
    "",
    "## 카테고리",
    ...CATEGORIES.map((c) => `- [${c.label}](${absUrl(`/category/${c.id}`)}): ${CATEGORY_COPY[c.id].description}`),
    "",
    "## 상품",
    ...PRODUCTS.map(
      (p) =>
        `- [${p.name}](${absUrl(`/products/${p.id}`)}): ${p.subcategory}, ${formatPrice(effectivePrice(p))}, 색상 ${p.colors
          .map((c) => c.name)
          .join("/")}, 사이즈 ${p.sizes.join("/")}`,
    ),
    "",
    "## 자주 묻는 질문",
    ...FAQ.flatMap((f) => [`### ${f.q}`, f.a, ""]),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

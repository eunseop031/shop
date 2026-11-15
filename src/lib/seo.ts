import { BRAND, CATEGORIES, CATEGORY_LABEL } from "./brand";
import { effectivePrice } from "./products";
import { absUrl, SITE_URL } from "./site";
import type { Product } from "./types";

export const CATEGORY_COPY: Record<string, { title: string; description: string }> = {
  top: {
    title: "상의",
    description:
      "티셔츠, 셔츠, 니트, 후디까지 매일 입는 미니멀 베이직 상의를 모았습니다. 소재와 핏 정보, 사이즈 표를 상품마다 확인할 수 있습니다.",
  },
  bottom: {
    title: "하의",
    description:
      "슬랙스·치노·카고 팬츠, 데님, 쇼츠 등 어떤 상의와도 잘 어울리는 하의 컬렉션입니다. 허리 단면과 총장 사이즈 표를 제공합니다.",
  },
  outer: {
    title: "아우터",
    description:
      "코치 재킷, 트렌치 코트, 울 블렌드 코트, 숏 패딩, 데님 재킷 등 계절별 기본 아우터를 소개합니다.",
  },
  accessory: {
    title: "액세서리",
    description: "볼캡, 비니, 버킷햇과 토트백, 크로스백, 백팩 등 데일리 코디를 완성하는 액세서리입니다.",
  },
};

export const FAQ: { q: string; a: string }[] = [
  {
    q: `${BRAND.name}는 어떤 쇼핑몰인가요?`,
    a: `${BRAND.name}는 "${BRAND.tagline}"을 컨셉으로 한 20~30대 남녀 공용 캐주얼 의류 쇼핑몰 데모입니다. 상의, 하의, 아우터, 액세서리 4개 카테고리의 상품 35종을 둘러볼 수 있습니다.`,
  },
  {
    q: "실제로 구매하고 배송받을 수 있나요?",
    a: "아니요. 이 사이트는 포트폴리오/학습용 데모라서 실제 판매와 배송은 이루어지지 않습니다. 결제는 토스페이먼츠 테스트 환경으로만 동작하며 실제 청구가 발생하지 않습니다. 상품 정보와 사진은 모두 가상의 샘플입니다.",
  },
  {
    q: "사이즈는 어떻게 고르면 되나요?",
    a: "모든 상품 상세 페이지에 cm 단위 사이즈 표(총장, 가슴단면, 허리단면 등)가 있습니다. 측정 방법에 따라 1~3cm 오차가 있을 수 있으니 평소 입는 옷과 비교해 보세요.",
  },
  {
    q: "색상이나 사이즈로 상품을 찾을 수 있나요?",
    a: "상품 목록에서 카테고리, 가격대, 사이즈, 색상으로 필터링하고 신상품순·낮은 가격순·높은 가격순·인기순으로 정렬할 수 있습니다. 상단 검색창에서 상품명으로 검색할 수도 있습니다.",
  },
];

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: BRAND.name,
    url: SITE_URL,
    description: BRAND.description,
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: BRAND.name,
    url: SITE_URL,
    inLanguage: "ko-KR",
    description: BRAND.description,
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function itemListLd(name: string, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absUrl(`/products/${p.id}`),
      name: p.name,
    })),
  };
}

export function productLd(p: Product) {
  const inStock = p.colors.some((c) => p.sizes.some((s) => !p.soldOut.some((o) => o.color === c.name && o.size === s)));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absUrl(`/products/${p.id}`)}#product`,
    name: p.name,
    sku: p.id,
    description: `${p.description} 소재: ${p.material}`,
    ...(p.images.length ? { image: p.images } : {}),
    brand: { "@type": "Brand", name: BRAND.name },
    category: `${CATEGORY_LABEL[p.category]} > ${p.subcategory}`,
    color: p.colors.map((c) => c.name).join(", "),
    offers: {
      "@type": "Offer",
      url: absUrl(`/products/${p.id}`),
      priceCurrency: "KRW",
      price: effectivePrice(p),
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@id": organizationId },
    },
  };
}

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

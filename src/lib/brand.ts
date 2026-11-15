// PRD 1.3 후보 중 NOIR & CO.를 기본값으로 사용 (최종 선택은 PRD 미결 사항)
export const BRAND = {
  name: "NOIR & CO.",
  tagline: "매일 입는 미니멀 베이직",
  description:
    "NOIR & CO.는 매일 입는 미니멀 베이직 의류를 소개하는 데모 쇼핑몰입니다.",
};

export const CATEGORIES = [
  { id: "top", label: "상의", subs: ["티셔츠", "셔츠", "니트", "후디"] },
  { id: "bottom", label: "하의", subs: ["팬츠", "데님", "쇼츠"] },
  { id: "outer", label: "아우터", subs: ["아우터"] },
  { id: "accessory", label: "액세서리", subs: ["모자", "가방"] },
] as const;

export const CATEGORY_LABEL: Record<string, string> = {
  top: "상의",
  bottom: "하의",
  outer: "아우터",
  accessory: "액세서리",
};

export const PRICE_RANGES = [
  { id: "0-30000", label: "3만원 미만", min: 0, max: 30000 },
  { id: "30000-60000", label: "3만원 ~ 6만원", min: 30000, max: 60000 },
  { id: "60000-100000", label: "6만원 ~ 10만원", min: 60000, max: 100000 },
  { id: "100000-", label: "10만원 이상", min: 100000, max: Infinity },
] as const;

export const SORTS = [
  { id: "new", label: "신상품순" },
  { id: "price-asc", label: "낮은 가격순" },
  { id: "price-desc", label: "높은 가격순" },
  { id: "popular", label: "인기순" },
] as const;

export const PAGE_SIZE = 12;
export const MAX_QUANTITY = 10;

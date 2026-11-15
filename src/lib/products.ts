import { PRODUCT_IMAGES } from "./product-images";
import type { Category, Product, ProductColor, SizeGuide } from "./types";

const COLORS: Record<string, ProductColor> = {
  블랙: { name: "블랙", hex: "#1a1a1a" },
  화이트: { name: "화이트", hex: "#f3f3f1" },
  그레이: { name: "그레이", hex: "#9b9b98" },
  네이비: { name: "네이비", hex: "#1f2a44" },
  베이지: { name: "베이지", hex: "#d6c8b0" },
  카키: { name: "카키", hex: "#767a55" },
  인디고: { name: "인디고", hex: "#3b4f73" },
};

export const COLOR_NAMES = Object.keys(COLORS);
export const ALL_SIZES = ["S", "M", "L", "XL", "28", "30", "32", "34", "FREE"];

const LETTER = ["S", "M", "L", "XL"];
const WAIST = ["28", "30", "32", "34"];

type Opts = {
  sale?: number;
  sizes?: string[];
  sold?: [string, string][];
  isNew?: boolean;
  pop: number;
  date: string;
  mat: string;
};

const DESC: Record<string, string> = {
  티셔츠: "매일 손이 가는 기본 실루엣의 티셔츠입니다. 부드러운 촉감과 적당한 두께감으로 단독으로도, 레이어드해도 좋습니다.",
  셔츠: "깔끔한 핏과 구김이 적은 소재로 데일리와 오피스 룩 모두에 어울리는 셔츠입니다.",
  니트: "도톰하지만 가벼운 니트로 체온을 지켜 주면서도 실루엣이 둔탁하지 않습니다.",
  후디: "넉넉한 핏과 안감 기모로 계절 내내 편하게 입을 수 있는 후디입니다.",
  팬츠: "허리부터 밑단까지 군더더기 없는 라인의 팬츠로, 어떤 상의와도 무난하게 매치됩니다.",
  데님: "세탁 후에도 형태가 유지되는 탄탄한 데님입니다. 입을수록 자연스러운 색 빠짐이 생깁니다.",
  쇼츠: "가볍고 시원한 소재의 쇼츠로 여름 데일리와 휴가 룩에 잘 어울립니다.",
  아우터: "기본 아이템 위에 툭 걸치기만 해도 완성되는 미니멀 아우터입니다.",
  모자: "어떤 룩에도 포인트가 되는 심플한 디자인의 모자입니다. 사이즈 조절이 가능합니다.",
  가방: "가볍고 수납력이 좋은 데일리 가방입니다. 심플한 디자인으로 코디를 가리지 않습니다.",
};

function guide(category: Category, sizes: string[]): SizeGuide {
  if (category === "accessory") {
    return { columns: ["크기(cm)"], rows: sizes.map((s) => ({ size: s, values: [58] })) };
  }
  if (sizes[0] === "28") {
    return {
      columns: ["허리단면", "총장"],
      rows: sizes.map((s, i) => ({ size: s, values: [37 + i * 2, 100 + i] })),
    };
  }
  if (category === "outer") {
    return {
      columns: ["총장", "가슴단면", "소매길이"],
      rows: sizes.map((_, i) => ({
        size: sizes[i],
        values: [72 + i * 2, 58 + i * 2, 62 + i],
      })),
    };
  }
  return {
    columns: ["총장", "가슴단면"],
    rows: sizes.map((s, i) => ({ size: s, values: [67 + i * 2, 54 + i * 2] })),
  };
}

function make(
  id: string,
  name: string,
  category: Category,
  subcategory: string,
  price: number,
  colorNames: string[],
  o: Opts,
): Product {
  const sizes =
    o.sizes ??
    (category === "accessory" ? ["FREE"] : subcategory === "쇼츠" || subcategory === "팬츠" || subcategory === "데님" ? WAIST : LETTER);
  return {
    id,
    name,
    category,
    subcategory,
    price,
    salePrice: o.sale,
    colors: colorNames.map((c) => COLORS[c]),
    sizes,
    soldOut: (o.sold ?? []).map(([color, size]) => ({ color, size })),
    images: PRODUCT_IMAGES[id] ?? [],
    description: DESC[subcategory],
    material: o.mat,
    sizeGuide: guide(category, sizes),
    isNew: o.isNew ?? false,
    popularity: o.pop,
    createdAt: o.date,
  };
}

const COTTON = "면 100% / 찬물 단독 세탁, 건조기 사용 금지";
const COTTON_BLEND = "면 80% 폴리에스터 20% / 30℃ 이하 손세탁 권장";
const WOOL = "울 40% 아크릴 60% / 드라이클리닝 권장";
const DENIM = "면 98% 폴리우레탄 2% / 뒤집어서 찬물 세탁";
const POLY = "폴리에스터 100% / 중성세제 단독 세탁";

export const PRODUCTS: Product[] = [
  // 티셔츠
  make("oversized-cotton-tee", "오버핏 코튼 티셔츠", "top", "티셔츠", 29000, ["화이트", "블랙", "그레이"], { pop: 98, date: "2026-10-28", isNew: true, mat: COTTON, sold: [["블랙", "XL"]] }),
  make("slub-henley-tee", "슬럽 헨리넥 티셔츠", "top", "티셔츠", 35000, ["베이지", "네이비"], { pop: 71, date: "2026-10-12", mat: COTTON_BLEND }),
  make("stripe-long-sleeve", "스트라이프 롱슬리브", "top", "티셔츠", 39000, ["네이비", "화이트"], { sale: 31200, pop: 64, date: "2026-09-02", mat: COTTON }),
  make("pocket-tee", "포켓 헤비 티셔츠", "top", "티셔츠", 32000, ["블랙", "카키", "화이트"], { pop: 80, date: "2026-10-30", isNew: true, mat: COTTON }),
  make("half-neck-tee", "하프넥 반팔 티셔츠", "top", "티셔츠", 27000, ["블랙", "그레이"], { sale: 21900, pop: 52, date: "2026-07-20", mat: COTTON_BLEND }),
  // 셔츠
  make("oxford-shirt", "옥스포드 셔츠", "top", "셔츠", 49000, ["화이트", "네이비"], { pop: 85, date: "2026-10-05", mat: COTTON }),
  make("linen-open-collar", "리넨 오픈칼라 셔츠", "top", "셔츠", 55000, ["베이지", "화이트"], { sale: 44000, pop: 60, date: "2026-06-15", mat: "리넨 55% 면 45% / 찬물 손세탁" }),
  make("stripe-shirt", "스트라이프 셔츠", "top", "셔츠", 52000, ["네이비", "그레이"], { pop: 55, date: "2026-08-22", mat: COTTON }),
  // 니트
  make("lambswool-crewneck", "램스울 크루넥 니트", "top", "니트", 69000, ["그레이", "네이비", "베이지"], { pop: 90, date: "2026-11-02", isNew: true, mat: WOOL, sold: [["그레이", "S"]] }),
  make("cable-knit", "케이블 니트", "top", "니트", 79000, ["베이지", "블랙"], { pop: 73, date: "2026-10-18", mat: WOOL }),
  make("half-zip-knit", "하프집업 니트", "top", "니트", 72000, ["카키", "블랙"], { sale: 57600, pop: 58, date: "2026-09-25", mat: WOOL }),
  // 후디
  make("heavy-hoodie", "헤비 후디", "top", "후디", 59000, ["블랙", "그레이", "네이비"], { pop: 95, date: "2026-10-22", mat: "면 90% 폴리에스터 10% / 뒤집어서 찬물 세탁" }),
  make("zip-up-hoodie", "집업 후디", "top", "후디", 65000, ["그레이", "블랙"], { pop: 78, date: "2026-11-05", isNew: true, mat: "면 90% 폴리에스터 10% / 뒤집어서 찬물 세탁" }),
  make("raglan-hoodie", "라글란 후디", "top", "후디", 62000, ["화이트", "카키"], { sale: 49600, pop: 49, date: "2026-08-10", mat: COTTON_BLEND }),
  // 팬츠
  make("wide-slacks", "와이드 슬랙스", "bottom", "팬츠", 59000, ["블랙", "그레이", "베이지"], { pop: 92, date: "2026-10-26", mat: POLY }),
  make("cotton-chino", "코튼 치노 팬츠", "bottom", "팬츠", 49000, ["베이지", "카키", "네이비"], { pop: 81, date: "2026-09-14", mat: COTTON, sold: [["카키", "34"]] }),
  make("cargo-pants", "카고 팬츠", "bottom", "팬츠", 65000, ["카키", "블랙"], { sale: 52000, pop: 69, date: "2026-08-30", mat: COTTON }),
  make("jogger-pants", "스웨트 조거 팬츠", "bottom", "팬츠", 45000, ["그레이", "블랙"], { pop: 74, date: "2026-11-08", isNew: true, mat: COTTON_BLEND }),
  // 데님
  make("straight-denim", "스트레이트 데님", "bottom", "데님", 69000, ["인디고", "블랙"], { pop: 88, date: "2026-10-09", mat: DENIM }),
  make("wide-denim", "와이드 데님", "bottom", "데님", 75000, ["인디고", "그레이"], { pop: 76, date: "2026-10-31", isNew: true, mat: DENIM }),
  make("washed-denim", "워싱 데님 팬츠", "bottom", "데님", 72000, ["인디고"], { sale: 57600, pop: 50, date: "2026-07-05", mat: DENIM }),
  // 쇼츠
  make("cotton-shorts", "코튼 쇼츠", "bottom", "쇼츠", 35000, ["베이지", "네이비"], { pop: 57, date: "2026-06-01", mat: COTTON }),
  make("sweat-shorts", "스웨트 쇼츠", "bottom", "쇼츠", 32000, ["그레이", "블랙"], { sale: 25600, pop: 45, date: "2026-05-20", mat: COTTON_BLEND }),
  make("nylon-shorts", "나일론 쇼츠", "bottom", "쇼츠", 38000, ["블랙", "카키"], { pop: 41, date: "2026-06-18", mat: POLY }),
  // 아우터
  make("coach-jacket", "코치 재킷", "outer", "아우터", 89000, ["블랙", "네이비", "베이지"], { pop: 91, date: "2026-10-20", mat: POLY }),
  make("trench-coat", "싱글 트렌치 코트", "outer", "아우터", 159000, ["베이지", "블랙"], { pop: 83, date: "2026-10-01", mat: "면 65% 폴리에스터 35% / 드라이클리닝", sold: [["베이지", "XL"]] }),
  make("wool-blend-coat", "울 블렌드 코트", "outer", "아우터", 189000, ["그레이", "블랙"], { sale: 151200, pop: 79, date: "2026-10-15", mat: "울 50% 폴리에스터 50% / 드라이클리닝" }),
  make("short-padding", "숏 패딩 재킷", "outer", "아우터", 139000, ["블랙", "카키"], { pop: 86, date: "2026-11-10", isNew: true, mat: "겉감 나일론 100% 충전재 오리털 80% / 드라이클리닝" }),
  make("denim-jacket", "데님 트러커 재킷", "outer", "아우터", 99000, ["인디고", "블랙"], { pop: 66, date: "2026-09-08", mat: DENIM }),
  // 모자
  make("ball-cap", "코튼 볼캡", "accessory", "모자", 25000, ["블랙", "베이지", "네이비"], { pop: 87, date: "2026-10-24", mat: "면 100% / 부분 손세탁" }),
  make("wool-beanie", "울 비니", "accessory", "모자", 29000, ["그레이", "블랙"], { pop: 68, date: "2026-11-01", isNew: true, mat: "울 30% 아크릴 70% / 손세탁" }),
  make("bucket-hat", "버킷햇", "accessory", "모자", 27000, ["베이지", "카키"], { sale: 21600, pop: 44, date: "2026-06-25", mat: COTTON }),
  // 가방
  make("canvas-tote", "캔버스 토트백", "accessory", "가방", 39000, ["베이지", "블랙"], { pop: 84, date: "2026-10-14", mat: "캔버스(면 100%) / 부분 세탁" }),
  make("nylon-crossbag", "나일론 크로스백", "accessory", "가방", 45000, ["블랙", "카키"], { pop: 72, date: "2026-10-29", isNew: true, mat: "나일론 100% / 물세탁 가능" }),
  make("daily-backpack", "데일리 백팩", "accessory", "가방", 69000, ["블랙", "네이비", "그레이"], { sale: 55200, pop: 62, date: "2026-08-18", mat: "나일론 100% / 물세탁 가능" }),
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function effectivePrice(p: Product): number {
  return p.salePrice ?? p.price;
}

export function discountRate(p: Product): number {
  if (!p.salePrice) return 0;
  return Math.round((1 - p.salePrice / p.price) * 100);
}

export function relatedProducts(p: Product, limit = 4): Product[] {
  return PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category)
    .sort((a, b) => {
      const sameSub = Number(b.subcategory === p.subcategory) - Number(a.subcategory === p.subcategory);
      return sameSub || b.popularity - a.popularity;
    })
    .slice(0, limit);
}

export function isSoldOut(p: Product, color: string, size: string): boolean {
  return p.soldOut.some((s) => s.color === color && s.size === size);
}

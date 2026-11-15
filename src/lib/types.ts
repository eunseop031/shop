export type Category = "top" | "bottom" | "outer" | "accessory";

export type ProductColor = { name: string; hex: string };

export type SizeGuide = {
  columns: string[]; // 예: ["총장", "가슴단면"] (cm)
  rows: { size: string; values: number[] }[];
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  subcategory: string;
  price: number;
  salePrice?: number;
  colors: ProductColor[];
  sizes: string[];
  soldOut: { color: string; size: string }[];
  images: string[]; // 외부 이미지 URL. 비어 있으면 생성형 플레이스홀더 사용
  description: string;
  material: string;
  sizeGuide: SizeGuide;
  isNew: boolean;
  popularity: number;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  color: string;
  size: string;
  quantity: number;
};

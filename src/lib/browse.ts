import { PRICE_RANGES } from "./brand";
import { effectivePrice, PRODUCTS } from "./products";
import type { Product } from "./types";

export type BrowseQuery = {
  q: string;
  category: string;
  sub: string;
  price: string;
  sizes: string[];
  colors: string[];
  sort: string;
};

export function parseQuery(sp: URLSearchParams): BrowseQuery {
  return {
    q: (sp.get("q") ?? "").trim(),
    category: sp.get("category") ?? "",
    sub: sp.get("sub") ?? "",
    price: sp.get("price") ?? "",
    sizes: sp.getAll("size"),
    colors: sp.getAll("color"),
    sort: sp.get("sort") ?? "new",
  };
}

export function runQuery(query: BrowseQuery): Product[] {
  const q = query.q.toLowerCase();
  const range = PRICE_RANGES.find((r) => r.id === query.price);

  const items = PRODUCTS.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (query.category && p.category !== query.category) return false;
    if (query.sub && p.subcategory !== query.sub) return false;
    if (range) {
      const price = effectivePrice(p);
      if (price < range.min || price >= range.max) return false;
    }
    if (query.sizes.length && !query.sizes.some((s) => p.sizes.includes(s))) return false;
    if (query.colors.length && !query.colors.some((c) => p.colors.some((pc) => pc.name === c))) return false;
    return true;
  });

  const sorted = [...items];
  switch (query.sort) {
    case "price-asc":
      sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
      break;
    case "price-desc":
      sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
      break;
    case "popular":
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
    default:
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return sorted;
}

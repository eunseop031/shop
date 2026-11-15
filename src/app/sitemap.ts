import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/brand";
import { PRODUCTS } from "@/lib/products";
import { absUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = new Date(
    PRODUCTS.reduce((max, p) => (p.createdAt > max ? p.createdAt : max), PRODUCTS[0].createdAt),
  );
  return [
    { url: absUrl("/"), lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: absUrl("/products"), lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...CATEGORIES.map((c) => ({
      url: absUrl(`/category/${c.id}`),
      lastModified: latest,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...PRODUCTS.map((p) => ({
      url: absUrl(`/products/${p.id}`),
      lastModified: new Date(p.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

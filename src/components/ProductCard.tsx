import Link from "next/link";
import { discountRate, effectivePrice } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  const rate = discountRate(product);
  return (
    <article className="group relative">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-soft">
          <ProductImage product={product} />
          <div className="absolute left-2 top-2 flex gap-1 text-[11px] font-medium tracking-wide">
            {product.isNew && <span className="bg-ink px-1.5 py-0.5 text-paper">NEW</span>}
            {rate > 0 && <span className="bg-accent px-1.5 py-0.5 text-paper">{rate}%</span>}
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted">{product.subcategory}</p>
          <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
          <p className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold">{formatPrice(effectivePrice(product))}</span>
            {product.salePrice && (
              <span className="text-xs text-muted line-through">{formatPrice(product.price)}</span>
            )}
          </p>
          <ul className="flex gap-1.5 pt-1" aria-label="색상">
            {product.colors.map((c) => (
              <li
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full border border-line"
                style={{ backgroundColor: c.hex }}
              >
                <span className="sr-only">{c.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </Link>
      <WishlistButton
        productId={product.id}
        productName={product.name}
        className="absolute right-2 top-2 h-9 w-9 rounded-full bg-paper/90 text-ink hover:bg-paper"
      />
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}

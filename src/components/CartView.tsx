"use client";

import Link from "next/link";
import { MAX_QUANTITY } from "@/lib/brand";
import { formatPrice } from "@/lib/format";
import { effectivePrice, getProduct } from "@/lib/products";
import { removeFromCart, setQuantity, useCartItems } from "@/lib/store";
import { ProductImage } from "./ProductImage";

export function CartView() {
  const items = useCartItems();
  const lines = items.flatMap((item) => {
    const product = getProduct(item.productId);
    return product ? [{ item, product }] : [];
  });
  const total = lines.reduce((sum, l) => sum + effectivePrice(l.product) * l.item.quantity, 0);

  if (lines.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-medium">장바구니가 비어 있습니다.</p>
        <Link href="/products" className="mt-6 inline-block border border-ink px-8 py-3 text-sm font-medium hover:bg-ink hover:text-paper">
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-line border-y border-line">
        {lines.map(({ item, product }) => {
          const hex = product.colors.find((c) => c.name === item.color)?.hex;
          const unit = effectivePrice(product);
          return (
            <li key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4 py-5">
              <Link href={`/products/${product.id}`} className="relative block h-28 w-22 shrink-0 overflow-hidden bg-soft sm:h-32 sm:w-26">
                <ProductImage product={product} hex={hex} sizes="104px" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${product.id}`} className="text-sm font-medium hover:underline">{product.name}</Link>
                  <p className="mt-1 text-xs text-muted">{item.color} / {item.size}</p>
                  <p className="mt-1 text-sm">{formatPrice(unit)}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center border border-line">
                    <button type="button" aria-label={`${product.name} 수량 감소`} disabled={item.quantity <= 1}
                      onClick={() => setQuantity(item, item.quantity - 1)} className="h-8 w-8 disabled:opacity-40">−</button>
                    <span className="w-9 text-center text-sm" aria-live="polite">{item.quantity}</span>
                    <button type="button" aria-label={`${product.name} 수량 증가`} disabled={item.quantity >= MAX_QUANTITY}
                      onClick={() => setQuantity(item, item.quantity + 1)} className="h-8 w-8 disabled:opacity-40">+</button>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(unit * item.quantity)}</p>
                </div>
              </div>
              <button type="button" aria-label={`${product.name} 삭제`} onClick={() => removeFromCart(item)}
                className="self-start p-1 text-muted hover:text-ink">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit bg-soft p-6">
        <h2 className="text-sm font-semibold">합계</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted">상품 수량</dt><dd>{lines.reduce((s, l) => s + l.item.quantity, 0)}개</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-bold"><dt>상품 합계</dt><dd>{formatPrice(total)}</dd></div>
        </dl>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          테스트 결제만 가능한 데모입니다. 실제 결제·청구는 발생하지 않으며, 배송비·쿠폰·적립금은 계산에 포함되지 않습니다.
        </p>
        <Link href="/checkout" className="mt-5 block bg-ink py-3 text-center text-sm font-medium text-paper hover:bg-ink/85">
          결제하기
        </Link>
        <Link href="/products" className="mt-2 block border border-ink py-3 text-center text-sm font-medium hover:bg-ink hover:text-paper">
          쇼핑 계속하기
        </Link>
      </aside>
    </div>
  );
}

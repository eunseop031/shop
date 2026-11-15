"use client";

import Link from "next/link";
import { useState } from "react";
import { MAX_QUANTITY } from "@/lib/brand";
import { formatPrice } from "@/lib/format";
import { discountRate, effectivePrice, isSoldOut } from "@/lib/products";
import { addToCart } from "@/lib/store";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

export function ProductPurchase({ product }: { product: Product }) {
  const [colorName, setColorName] = useState(product.colors[0].name);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(0);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const color = product.colors.find((c) => c.name === colorName) ?? product.colors[0];
  const imageCount = product.images.length || 4; // 실제 사진이 없으면 플레이스홀더 4컷
  const rate = discountRate(product);
  const price = effectivePrice(product);

  function onColor(name: string) {
    setColorName(name);
    if (size && isSoldOut(product, name, size)) setSize("");
    setMessage(null);
  }

  function onAdd() {
    if (!size) {
      setMessage({ kind: "error", text: "사이즈를 선택해 주세요." });
      return;
    }
    addToCart({ productId: product.id, color: colorName, size, quantity: qty });
    setMessage({ kind: "ok", text: "장바구니에 담았습니다." });
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-soft">
          <ProductImage product={product} variant={variant} hex={color.hex} priority sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        {imageCount > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2" aria-label="이미지 선택">
          {Array.from({ length: imageCount }, (_, i) => i).map((i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setVariant(i)}
                aria-label={`이미지 ${i + 1} 보기`}
                aria-current={variant === i}
                className={`relative block aspect-[4/5] w-full overflow-hidden bg-soft ${variant === i ? "ring-2 ring-ink" : "ring-1 ring-line"}`}
              >
                <ProductImage product={product} variant={i} hex={color.hex} sizes="12vw" />
              </button>
            </li>
          ))}
        </ul>
        )}
      </div>

      <div>
        <p className="text-sm text-muted">{product.subcategory}</p>
        <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
        <p className="mt-4 flex items-baseline gap-3">
          {rate > 0 && <span className="text-xl font-bold text-accent">{rate}%</span>}
          <span className="text-2xl font-bold">{formatPrice(price)}</span>
          {product.salePrice && <span className="text-sm text-muted line-through">{formatPrice(product.price)}</span>}
        </p>

        <fieldset className="mt-8">
          <legend className="text-sm font-semibold">색상 · {colorName}</legend>
          <div className="mt-2 flex gap-3">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                aria-label={c.name}
                aria-pressed={c.name === colorName}
                onClick={() => onColor(c.name)}
                className={`h-9 w-9 rounded-full border border-line ${c.name === colorName ? "ring-2 ring-ink ring-offset-2" : ""}`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold">사이즈{size ? ` · ${size}` : ""}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const out = isSoldOut(product, colorName, s);
              return (
                <button
                  key={s}
                  type="button"
                  disabled={out}
                  aria-pressed={s === size}
                  onClick={() => { setSize(s); setMessage(null); }}
                  className={`min-w-14 border px-4 py-2 text-sm ${
                    out ? "border-line text-muted line-through opacity-60" : s === size ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                  }`}
                >
                  {s}
                  {out && <span className="sr-only"> (품절)</span>}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm font-semibold">수량</span>
          <div className="flex items-center border border-line">
            <button type="button" aria-label="수량 감소" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)} className="h-9 w-9 disabled:opacity-40">−</button>
            <span className="w-10 text-center text-sm" aria-live="polite">{qty}</span>
            <button type="button" aria-label="수량 증가" disabled={qty >= MAX_QUANTITY} onClick={() => setQty((q) => q + 1)} className="h-9 w-9 disabled:opacity-40">+</button>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button type="button" onClick={onAdd} className="h-12 flex-1 bg-ink text-sm font-medium text-paper hover:bg-ink/85">
            장바구니 담기
          </button>
          <WishlistButton productId={product.id} productName={product.name} className="h-12 w-12 border border-line hover:border-ink" />
        </div>

        <p role={message?.kind === "error" ? "alert" : "status"} className={`mt-3 min-h-5 text-sm ${message?.kind === "error" ? "text-accent" : ""}`}>
          {message?.text}
          {message?.kind === "ok" && (
            <> <Link href="/cart" className="underline">장바구니 보기</Link></>
          )}
        </p>

        <section className="mt-10 space-y-8 border-t border-line pt-8 text-sm leading-relaxed">
          <div>
            <h2 className="mb-2 font-semibold">상품 설명</h2>
            <p>{product.description}</p>
          </div>
          <div>
            <h2 className="mb-2 font-semibold">소재 / 세탁</h2>
            <p>{product.material}</p>
          </div>
          <div>
            <h2 className="mb-2 font-semibold">사이즈 표</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-72 border-collapse text-center">
                <thead>
                  <tr className="border-b border-ink">
                    <th scope="col" className="py-2 text-left font-medium">사이즈</th>
                    {product.sizeGuide.columns.map((c) => (
                      <th key={c} scope="col" className="py-2 font-medium">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {product.sizeGuide.rows.map((r) => (
                    <tr key={r.size} className="border-b border-line">
                      <th scope="row" className="py-2 text-left font-normal">{r.size}</th>
                      {r.values.map((v, i) => (
                        <td key={i} className="py-2">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-muted">단위: cm · 측정 방법에 따라 1~3cm 오차가 있을 수 있습니다.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

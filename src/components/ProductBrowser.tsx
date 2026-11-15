"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CATEGORIES, PAGE_SIZE, PRICE_RANGES, SORTS } from "@/lib/brand";
import { parseQuery, runQuery } from "@/lib/browse";
import { ALL_SIZES, COLOR_NAMES } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./ProductCard";

function ProductList({ items }: { items: Product[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-medium">조건에 맞는 상품이 없습니다.</p>
        <p className="mt-2 text-sm text-muted">필터를 줄이거나 다른 검색어로 시도해 보세요.</p>
      </div>
    );
  }
  return (
    <>
      <ProductGrid products={items.slice(0, visible)} />
      {visible < items.length && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="border border-ink px-10 py-3 text-sm font-medium hover:bg-ink hover:text-paper"
          >
            더 보기 ({visible}/{items.length})
          </button>
        </div>
      )}
    </>
  );
}

const chip = (active: boolean) =>
  `rounded-full border px-3 py-1 text-sm ${active ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`;

export function ProductBrowser({
  mode,
  fixedCategory,
  description,
}: {
  mode: "list" | "search";
  /** 카테고리 전용 페이지(/category/[slug])에서 카테고리를 URL 경로로 고정 */
  fixedCategory?: string;
  description?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const query = useMemo(() => {
    const q = parseQuery(sp);
    return fixedCategory ? { ...q, category: fixedCategory } : q;
  }, [sp, fixedCategory]);
  const items = useMemo(() => runQuery(query), [query]);
  const category = CATEGORIES.find((c) => c.id === query.category);
  const activeFilters =
    (query.category && !fixedCategory ? 1 : 0) + (query.price ? 1 : 0) + query.sizes.length + query.colors.length;

  function update(mutate: (p: URLSearchParams) => void) {
    const p = new URLSearchParams(sp.toString());
    mutate(p);
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggleMulti(key: "size" | "color", value: string) {
    update((p) => {
      const cur = p.getAll(key);
      p.delete(key);
      (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]).forEach((v) =>
        p.append(key, v),
      );
    });
  }

  const title =
    mode === "search"
      ? query.q
        ? `"${query.q}" 검색 결과`
        : "검색"
      : category
        ? category.label
        : "전체 상품";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>}
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {mode === "search" && !query.q ? "검색어를 입력해 주세요." : `${items.length}개의 상품`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            aria-expanded={filterOpen}
            aria-controls="filter-panel"
            className="border border-line px-3 py-2 text-sm lg:hidden"
          >
            필터{activeFilters > 0 ? ` (${activeFilters})` : ""}
          </button>
          <label className="text-sm">
            <span className="sr-only">정렬</span>
            <select
              value={query.sort}
              onChange={(e) => update((p) => (e.target.value === "new" ? p.delete("sort") : p.set("sort", e.target.value)))}
              className="border border-line bg-paper px-3 py-2 text-sm"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside
          id="filter-panel"
          aria-label="필터"
          className={`${filterOpen ? "block" : "hidden"} space-y-7 lg:block`}
        >
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">카테고리</legend>
            <div className="flex flex-wrap gap-2">
              {fixedCategory ? (
                // 카테고리 페이지에서는 크롤 가능한 일반 링크로 이동
                <>
                  <Link href="/products" className={chip(false)}>전체</Link>
                  {CATEGORIES.map((c) => (
                    <Link key={c.id} href={`/category/${c.id}`} className={chip(fixedCategory === c.id)}
                      aria-current={fixedCategory === c.id ? "page" : undefined}>{c.label}</Link>
                  ))}
                </>
              ) : (
                <>
                  <button type="button" className={chip(!query.category)} aria-pressed={!query.category}
                    onClick={() => update((p) => { p.delete("category"); p.delete("sub"); })}>전체</button>
                  {CATEGORIES.map((c) => (
                    <button key={c.id} type="button" className={chip(query.category === c.id)} aria-pressed={query.category === c.id}
                      onClick={() => update((p) => { p.set("category", c.id); p.delete("sub"); })}>{c.label}</button>
                  ))}
                </>
              )}
            </div>
            {category && category.subs.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {category.subs.map((s) => (
                  <button key={s} type="button" className={chip(query.sub === s)} aria-pressed={query.sub === s}
                    onClick={() => update((p) => (query.sub === s ? p.delete("sub") : p.set("sub", s)))}>{s}</button>
                ))}
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">가격대</legend>
            <div className="space-y-1.5 text-sm">
              {PRICE_RANGES.map((r) => (
                <label key={r.id} className="flex cursor-pointer items-center gap-2">
                  <input type="radio" name="price" checked={query.price === r.id}
                    onChange={() => update((p) => p.set("price", r.id))} />
                  {r.label}
                </label>
              ))}
              {query.price && (
                <button type="button" className="text-xs text-muted underline" onClick={() => update((p) => p.delete("price"))}>
                  가격 필터 해제
                </button>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">사이즈</legend>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((s) => (
                <button key={s} type="button" className={chip(query.sizes.includes(s))} aria-pressed={query.sizes.includes(s)}
                  onClick={() => toggleMulti("size", s)}>{s}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">색상</legend>
            <div className="flex flex-wrap gap-2">
              {COLOR_NAMES.map((c) => (
                <button key={c} type="button" className={chip(query.colors.includes(c))} aria-pressed={query.colors.includes(c)}
                  onClick={() => toggleMulti("color", c)}>{c}</button>
              ))}
            </div>
          </fieldset>

          {(activeFilters > 0 || query.sub) && (
            <Link
              href={mode === "search" && query.q ? `/search?q=${encodeURIComponent(query.q)}` : pathname}
              replace
              className="inline-block text-sm underline"
            >
              필터 모두 초기화
            </Link>
          )}
        </aside>

        <section aria-label="상품 목록">
          {mode === "search" && !query.q ? null : <ProductList key={sp.toString()} items={items} />}
        </section>
      </div>
    </div>
  );
}

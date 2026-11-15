"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRAND, CATEGORIES } from "@/lib/brand";
import { useCartItems, useWishlistIds } from "@/lib/store";

function Badge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-paper">
      {n}
    </span>
  );
}

export function Header() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const cartCount = useCartItems().reduce((sum, i) => sum + i.quantity, 0);
  const wishCount = useWishlistIds().length;

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-[0.18em]">
          {BRAND.name}
        </Link>

        <nav aria-label="카테고리" className="ml-6 hidden gap-6 text-sm md:flex">
          <Link href="/products" className="hover:underline">전체</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/category/${c.id}`} className="hover:underline">
              {c.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} role="search" className="ml-auto flex items-center">
          <label htmlFor="header-search" className="sr-only">상품 검색</label>
          <input
            id="header-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색"
            className="w-28 border-b border-line bg-transparent px-1 py-1 text-sm outline-none focus:border-ink sm:w-48"
          />
          <button type="submit" aria-label="검색" className="px-2 py-1">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <Link href="/wishlist" aria-label={`위시리스트 ${wishCount}개`} className="relative p-1">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
          </svg>
          <Badge n={wishCount} />
        </Link>
        <Link href="/cart" aria-label={`장바구니 ${cartCount}개`} className="relative p-1">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1 12H6L5 8Z" />
            <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
          </svg>
          <Badge n={cartCount} />
        </Link>
      </div>

      <nav aria-label="카테고리(모바일)" className="flex gap-5 overflow-x-auto border-t border-line px-4 py-2 text-sm md:hidden">
        <Link href="/products" className="shrink-0">전체</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.id} href={`/category/${c.id}`} className="shrink-0">
            {c.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

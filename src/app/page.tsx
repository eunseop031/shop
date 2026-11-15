import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/ProductCard";
import { faqLd, FAQ, organizationLd, websiteLd } from "@/lib/seo";
import { BRAND, CATEGORIES } from "@/lib/brand";
import { PRODUCTS } from "@/lib/products";

const newest = [...PRODUCTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).filter((p) => p.isNew).slice(0, 8);
const best = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 8);

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href={href} className="text-sm underline">전체 보기</Link>
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationLd()} />
      <JsonLd data={websiteLd()} />
      <JsonLd data={faqLd()} />
      <section className="bg-soft">
        <div className="mx-auto flex min-h-[420px] max-w-7xl flex-col justify-center px-4 py-16 sm:min-h-[520px] sm:px-6">
          <p className="text-sm tracking-[0.3em] text-muted">2026 F/W COLLECTION</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
            {BRAND.tagline}
          </h1>
          <p className="mt-5 max-w-md text-muted">
            유행을 타지 않는 실루엣과 소재. 하루 종일 편하고, 어디에나 어울리는 기본을 만듭니다.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/products" className="bg-ink px-8 py-3 text-sm font-medium text-paper hover:bg-ink/85">
              전체 상품 보기
            </Link>
            <Link href="/category/outer" className="border border-ink px-8 py-3 text-sm font-medium hover:bg-ink hover:text-paper">
              아우터
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="카테고리 바로가기" className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                href={`/category/${c.id}`}
                className="flex h-28 items-end border border-line p-4 text-lg font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Section title="신상품" href="/products?sort=new">
        <ProductGrid products={newest} />
      </Section>
      <Section title="베스트" href="/products?sort=popular">
        <ProductGrid products={best} />
      </Section>

      <section aria-labelledby="faq-title" className="mx-auto mt-24 max-w-3xl px-4 sm:px-6">
        <h2 id="faq-title" className="mb-6 text-xl font-bold">자주 묻는 질문</h2>
        <dl className="divide-y divide-line border-y border-line">
          {FAQ.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-medium">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

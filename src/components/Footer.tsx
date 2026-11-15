import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-soft">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted sm:px-6">
        <p className="font-bold tracking-[0.18em] text-ink">{BRAND.name}</p>
        <p className="mt-2">{BRAND.tagline}</p>
        <p className="mt-6 text-xs leading-relaxed">
          이 사이트는 포트폴리오/학습용 데모입니다. 결제는 토스페이먼츠 테스트 환경으로만 동작하며 실제
          판매·청구·배송은 이루어지지 않습니다. 상품 정보는 모두 가상의 샘플이며, 상품 사진은{" "}
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">
            Unsplash
          </a>
          의 각 작가가 제공한 무료 이미지입니다(실제 상품과 무관).
        </p>
      </div>
    </footer>
  );
}

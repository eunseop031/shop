# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

NOIR & CO. — 포트폴리오/학습용 의류 쇼핑몰 데모(한국어 UI, 원화). Next.js 16 + React 19 + Tailwind 4 + TypeScript. 백엔드/DB 없이 정적 상품 데이터로 동작하고, 결제는 토스페이먼츠 **테스트 키로만** 동작한다. 제품 요구사항은 저장소 밖 `../PRD.md`(상위 폴더)에 있다. 상위 폴더의 `game.js`, `index.html`은 이 프로젝트와 무관하다. git 저장소 루트는 이 `shop/` 폴더다.

## 명령어

```bash
npm run dev -- -p 3100   # 개발 서버
npm run build            # 프로덕션 빌드 (타입 검사 포함)
npm run start -- -p 3100 # 빌드 결과 실행
npm run lint             # ESLint
```

- 테스트 러너는 없다. 변경 검증은 `npm run lint` + `npm run build`와 서버를 띄워 직접 확인하는 방식으로 한다.
- `npx tsc --noEmit`은 `PageProps<"/products/[id]">` 같은 라우트 타입이 `next dev`/`next build` 때 생성되므로, 생성 전에는 실패한다.
- `next dev`와 `next build`는 `.next`를 공유한다. 빌드 전에 개발 서버를 먼저 종료한다.
- 결제 흐름을 시험하려면 `env.example`을 복사해 `.env.local`을 만든다(키 값은 토스 테스트 키).

## Next.js 16 주의사항 (기존 지식과 다름)

`AGENTS.md`가 요구하듯, 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 관련 문서를 읽는다. 이 프로젝트에서 실제로 부딪힌 점:

- `next.config.ts`에서 `cacheComponents: true`, `partialPrefetching: true`가 켜져 있다. 런타임 데이터(`params`, `searchParams`, `cookies`)는 `<Suspense>` 안에서 읽어야 하고, `params`는 Promise다(`await params`).
- `PageProps<"/route">`, `LayoutProps<"/">`는 전역 타입 헬퍼다(import 불필요).
- 동적 라우트(`/products/[id]`, `/category/[slug]`)는 `generateStaticParams`로 전부 미리 생성하고 `export const instant = false`로 블로킹을 허용한다.
- Cache Components에서는 `dynamicParams = false`를 쓸 수 없다. 그래서 알 수 없는 상품/카테고리 URL이 "첫 요청에 200(소프트 404)"로 응답하는 문제를 `src/proxy.ts`(Next 16의 middleware)가 요청 단계에서 404로 돌려 해결한다. 새 동적 라우트를 추가하면 이 proxy의 matcher/허용 목록도 확인한다.

## 아키텍처

**데이터는 전부 정적 코드다.** `src/lib/products.ts`의 `PRODUCTS`(35개)가 단일 출처이고, 사이트맵·llms.txt·proxy·상세 페이지 정적 생성이 모두 여기서 파생된다. 상품 사진은 `src/lib/product-images.ts`(Unsplash 사진 ID)에서 `make()`가 병합한다. 이미지가 비어 있으면 `ProductImage`가 색상·종류 기반 SVG 플레이스홀더를 그린다. 사진은 상품 색상 옵션과 연동되지 않는다.

**탐색 파이프라인.** URL 쿼리(`category`, `sub`, `price`, `size`, `color`, `sort`, `q`) → `lib/browse.ts`의 `parseQuery` → `runQuery`(필터+정렬). `components/ProductBrowser.tsx`(클라이언트)가 `useSearchParams`로 이 파이프라인을 돌리며, 필터 변경은 `router.replace`로 쿼리를 갱신한다. `/products`, `/search`, `/category/[slug]`가 모두 이 컴포넌트를 쓰고, 카테고리 페이지는 `fixedCategory` prop으로 카테고리를 경로에 고정한다. `useSearchParams` 때문에 이 컴포넌트는 클라이언트 렌더링되므로, 크롤러용 HTML은 Suspense `fallback`의 서버 컴포넌트 `StaticCatalog`가 제공한다(SEO상 중요 — 제거하지 말 것).

**클라이언트 상태.** 장바구니/위시리스트는 `lib/store.ts`의 모듈 단위 외부 스토어 + `useSyncExternalStore`다(localStorage 키 `noir:cart`, `noir:wishlist`, 서버 스냅샷은 빈 배열). 컴포넌트에서 `useEffect`+`setState`로 하이드레이션하지 말고(린트 규칙 `react-hooks/set-state-in-effect`에 걸림) 이 훅들을 쓴다.

**결제(토스페이먼츠 결제위젯, Redirect 방식).** 금액은 클라이언트를 신뢰하지 않는다.
1. `/checkout`(`CheckoutView`) → `POST /api/checkout/prepare`: 서버(`lib/order.ts`)가 장바구니를 `PRODUCTS`로 재검증(옵션·품절·수량 1~10)하고 금액을 직접 계산한다. 주문번호는 `NOIR-<rand>-<HMAC(secret, rand:amount)>`로, 금액에 서명이 묶여 있다(DB 불필요).
2. 위젯 결제 후 `/checkout/success?paymentKey&orderId&amount`(`CheckoutSuccess`) → `POST /api/checkout/confirm`: 주문번호 서명과 금액을 다시 검증한 뒤 토스 승인 API를 호출하고 성공 시 장바구니를 비운다.
3. `lib/order.ts`는 서버 전용(시크릿 키 사용)이다. 클라이언트 컴포넌트에서 import하지 않는다. `test_` 접두사가 아닌 키는 서버가 503으로 거부한다.
4. 환경변수: `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`(같은 세트의 테스트 키여야 함).

**SEO/AEO/GEO.** `lib/site.ts`의 `SITE_URL`(`NEXT_PUBLIC_SITE_URL` → Vercel 자동 URL → localhost)이 canonical, sitemap, JSON-LD의 기준이다. 구조화 데이터 빌더는 `lib/seo.ts`, 출력은 `components/JsonLd.tsx`(`<` 이스케이프). `app/sitemap.ts`, `app/robots.ts`(비공개 경로 제외, AI 크롤러 허용), `app/llms.txt/route.ts`가 `PRODUCTS`/`CATEGORIES`에서 생성된다. 카테고리를 추가하려면 `lib/brand.ts`의 `CATEGORIES`/`CATEGORY_LABEL`과 `lib/seo.ts`의 `CATEGORY_COPY`를 함께 갱신한다. 구글 서치콘솔 소유권 확인 파일은 `public/google8bb63e0468db72e4.html`이며 삭제하면 안 된다.

## 작업 시 참고

- UI 문구와 커밋 메시지는 한국어로 쓴다.
- Windows에서 한글이 들어간 JSON을 `curl -d`로 보내면 인코딩이 깨져 거짓 실패가 난다. API 테스트는 Node 스크립트(`fetch`)로 한다.
- `.env.local`은 git에서 제외되어 있다(`.env*`). 예시 파일 이름이 `env.example`인 이유다.

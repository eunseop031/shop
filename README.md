# NOIR & CO. — 의류 쇼핑 홈페이지 (테스트 결제 데모)

포트폴리오/학습용 의류 쇼핑몰 데모입니다. 상품 탐색부터 장바구니, 토스페이먼츠 **테스트 결제**까지 구현했습니다.
실제 판매·청구·배송은 이루어지지 않으며, 상품 정보는 모두 가상의 샘플입니다.

## 기능
- 페이지: 홈, 상품 목록, 상품 상세, 장바구니, 위시리스트, 검색 결과, 결제
- 탐색: 카테고리·소분류, 가격대·사이즈·색상 필터, 정렬 4종, 키워드 검색, "더 보기"
- 장바구니·위시리스트: 비회원, `localStorage` 저장
- 결제: 토스페이먼츠 결제위젯(테스트 키 전용). 금액은 서버가 상품 데이터로 다시 계산하고, 서명된 주문번호로 승인 시 재검증합니다.

## 기술 스택
Next.js 16 (App Router, Cache Components) · React 19 · Tailwind CSS 4 · TypeScript

> 이 프로젝트의 Next.js는 기존 버전과 달라진 점이 있습니다. 코드를 수정하기 전에
> `node_modules/next/dist/docs/`의 문서를 확인하세요.

## 시작하기
```bash
npm install
cp env.example .env.local   # 테스트 키 입력 (아래 참고)
npm run dev                  # http://localhost:3000
```

### 환경변수 (`.env.local`)
| 이름 | 설명 |
|---|---|
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 토스페이먼츠 결제위젯 **테스트** 클라이언트 키 (`test_gck_...`) |
| `TOSS_SECRET_KEY` | 같은 세트의 **테스트** 시크릿 키 (`test_gsk_...`, 서버 전용) |

- 키는 [토스페이먼츠 개발자센터](https://developers.tosspayments.com/my/api-keys)에서 확인합니다.
- 이 데모는 `test_`로 시작하는 키만 허용하며, `live_` 키는 서버가 거부합니다.
- `.env.local`은 git에 올라가지 않습니다. 시크릿 키를 코드나 이슈에 붙여넣지 마세요.

## 스크립트
`npm run dev` · `npm run build` · `npm run start` · `npm run lint`

## 상품 이미지
상품 사진은 [Unsplash](https://unsplash.com)의 무료 이미지이며 실제 상품과 무관합니다.
사진 ID는 `src/lib/product-images.ts`에서 관리합니다.

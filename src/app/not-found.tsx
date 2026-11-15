import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-32 text-center">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다.</h1>
      <Link href="/products" className="mt-6 inline-block border border-ink px-8 py-3 text-sm font-medium hover:bg-ink hover:text-paper">
        상품 둘러보기
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { clearCart } from "@/lib/store";

type Confirmed = { orderId: string; orderName: string; totalAmount: number; method?: string; approvedAt?: string };
type State =
  | { phase: "loading" }
  | { phase: "done"; payment: Confirmed }
  | { phase: "error"; message: string };

export function CheckoutSuccess() {
  const sp = useSearchParams();
  const [result, setState] = useState<State>({ phase: "loading" });
  const calledRef = useRef(false);

  const paymentKey = sp.get("paymentKey");
  const orderId = sp.get("orderId");
  const amount = sp.get("amount");
  const missing = !paymentKey || !orderId || !amount;
  const state: State = missing ? { phase: "error", message: "결제 정보가 없습니다." } : result;

  useEffect(() => {
    if (missing || calledRef.current) return;
    calledRef.current = true;
    (async () => {
      try {
        const res = await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "결제 승인에 실패했습니다.");
        clearCart();
        setState({ phase: "done", payment: data });
      } catch (e) {
        setState({ phase: "error", message: e instanceof Error ? e.message : "결제 승인에 실패했습니다." });
      }
    })();
  }, [missing, paymentKey, orderId, amount]);

  if (state.phase === "loading") {
    return <p className="py-24 text-center text-muted" role="status">결제를 확인하는 중입니다…</p>;
  }
  if (state.phase === "error") {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold">결제를 완료하지 못했습니다</h1>
        <p role="alert" className="mt-3 text-sm text-accent">{state.message}</p>
        <Link href="/cart" className="mt-8 inline-block border border-ink px-8 py-3 text-sm font-medium hover:bg-ink hover:text-paper">
          장바구니로 돌아가기
        </Link>
      </div>
    );
  }
  const p = state.payment;
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h1 className="text-2xl font-bold">테스트 결제가 완료되었습니다</h1>
      <p className="mt-2 text-sm text-muted">실제 결제·배송은 이루어지지 않습니다.</p>
      <dl className="mt-8 space-y-3 border-y border-line py-6 text-left text-sm">
        <div className="flex justify-between gap-4"><dt className="text-muted">주문 상품</dt><dd>{p.orderName}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted">결제 금액</dt><dd className="font-semibold">{formatPrice(p.totalAmount)}</dd></div>
        {p.method && <div className="flex justify-between gap-4"><dt className="text-muted">결제 수단</dt><dd>{p.method}</dd></div>}
        <div className="flex justify-between gap-4"><dt className="text-muted">주문번호</dt><dd className="break-all">{p.orderId}</dd></div>
      </dl>
      <Link href="/products" className="mt-8 inline-block bg-ink px-8 py-3 text-sm font-medium text-paper hover:bg-ink/85">
        쇼핑 계속하기
      </Link>
    </div>
  );
}

export function CheckoutFail() {
  const sp = useSearchParams();
  const code = sp.get("code");
  const message = sp.get("message");
  return (
    <div className="py-24 text-center">
      <h1 className="text-2xl font-bold">결제에 실패했습니다</h1>
      <p role="alert" className="mt-3 text-sm text-muted">{message ?? "알 수 없는 오류가 발생했습니다."}</p>
      {code && <p className="mt-1 text-xs text-muted">오류 코드: {code}</p>}
      <p className="mt-2 text-xs text-muted">장바구니는 그대로 유지됩니다.</p>
      <Link href="/cart" className="mt-8 inline-block border border-ink px-8 py-3 text-sm font-medium hover:bg-ink hover:text-paper">
        장바구니로 돌아가기
      </Link>
    </div>
  );
}

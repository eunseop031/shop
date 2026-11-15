"use client";

import { ANONYMOUS, loadTossPayments, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { effectivePrice, getProduct } from "@/lib/products";
import { useCartItems } from "@/lib/store";

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";

type Order = { orderId: string; orderName: string; amount: number };
type State =
  | { phase: "loading" }
  | { phase: "ready"; order: Order }
  | { phase: "error"; message: string };

export function CheckoutView() {
  const items = useCartItems();
  const [state, setState] = useState<State>({ phase: "loading" });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const startedRef = useRef(false);

  const lines = items.flatMap((item) => {
    const product = getProduct(item.productId);
    return product ? [{ item, product }] : [];
  });

  const keyProblem = !CLIENT_KEY
    ? "NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다. shop/env.example을 참고해 .env.local을 만든 뒤 개발 서버를 다시 시작해 주세요."
    : !CLIENT_KEY.startsWith("test_")
      ? "이 데모는 테스트 키(test_...)만 사용할 수 있습니다."
      : "";

  useEffect(() => {
    if (keyProblem || startedRef.current || items.length === 0) return;
    startedRef.current = true;

    (async () => {
      try {
        // 1) 서버가 상품 데이터로 금액을 계산하고 서명된 주문번호를 발급
        const res = await fetch("/api/checkout/prepare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "주문을 준비하지 못했습니다.");
        const order = data as Order;

        // 2) 결제위젯 렌더링 (비회원)
        const tossPayments = await loadTossPayments(CLIENT_KEY);
        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        await widgets.setAmount({ currency: "KRW", value: order.amount });
        setState({ phase: "ready", order });
        // 위젯이 붙을 DOM이 렌더된 다음 프레임에 호출
        await new Promise((r) => requestAnimationFrame(r));
        await Promise.all([
          widgets.renderPaymentMethods({ selector: "#payment-method" }),
          widgets.renderAgreement({ selector: "#agreement" }),
        ]);
        widgetsRef.current = widgets;
      } catch (e) {
        setState({ phase: "error", message: e instanceof Error ? e.message : "결제 화면을 불러오지 못했습니다." });
      }
    })();
  }, [items, keyProblem]);

  async function onPay() {
    if (state.phase !== "ready" || !widgetsRef.current) return;
    setPaying(true);
    setPayError("");
    try {
      await widgetsRef.current.requestPayment({
        orderId: state.order.orderId,
        orderName: state.order.orderName,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      });
    } catch (e) {
      // 사용자가 결제창을 닫은 경우 등
      setPayError(e instanceof Error ? e.message : "결제를 진행하지 못했습니다.");
      setPaying(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-medium">결제할 상품이 없습니다.</p>
        <Link href="/products" className="mt-6 inline-block border border-ink px-8 py-3 text-sm font-medium hover:bg-ink hover:text-paper">
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  const total = lines.reduce((s, l) => s + effectivePrice(l.product) * l.item.quantity, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div>
        <p className="mb-4 border border-line bg-soft px-4 py-3 text-sm">
          <strong>테스트 결제 환경입니다.</strong> 테스트 키로 동작하며 실제 결제·청구는 발생하지 않습니다.
        </p>

        {keyProblem ? (
          <p role="alert" className="border border-accent p-4 text-sm text-accent">{keyProblem}</p>
        ) : state.phase === "error" ? (
          <div role="alert" className="border border-accent p-4 text-sm text-accent">
            {state.message}
            <p className="mt-3"><Link href="/cart" className="underline">장바구니로 돌아가기</Link></p>
          </div>
        ) : (
          <>
            {state.phase === "loading" && <p className="py-10 text-center text-sm text-muted">결제 화면을 불러오는 중…</p>}
            <div id="payment-method" />
            <div id="agreement" />
            {state.phase === "ready" && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onPay}
                  disabled={paying}
                  className="h-12 w-full bg-ink text-sm font-medium text-paper hover:bg-ink/85 disabled:opacity-50"
                >
                  {paying ? "결제창 여는 중…" : `${formatPrice(state.order.amount)} 결제하기`}
                </button>
                {payError && <p role="alert" className="mt-3 text-sm text-accent">{payError}</p>}
              </div>
            )}
          </>
        )}
      </div>

      <aside className="h-fit bg-soft p-6">
        <h2 className="text-sm font-semibold">주문 상품</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map(({ item, product }) => (
            <li key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between gap-3">
              <span>
                {product.name}
                <span className="block text-xs text-muted">{item.color} / {item.size} · {item.quantity}개</span>
              </span>
              <span className="shrink-0">{formatPrice(effectivePrice(product) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-3 text-base font-bold">
          <span>결제 금액</span>
          <span>{formatPrice(total)}</span>
        </div>
        <p className="mt-3 text-xs text-muted">결제 금액은 서버에서 다시 계산해 확정됩니다.</p>
      </aside>
    </div>
  );
}

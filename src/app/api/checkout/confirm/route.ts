import { getSecretKey, verifyOrderId } from "@/lib/order";

const CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

export async function POST(request: Request) {
  const key = getSecretKey();
  if (!key.ok) return Response.json({ message: key.message }, { status: 503 });

  let body: { paymentKey?: unknown; orderId?: unknown; amount?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const { paymentKey, orderId } = body;
  const amount = Number(body.amount);
  if (
    typeof paymentKey !== "string" ||
    paymentKey.length === 0 ||
    paymentKey.length > 200 ||
    typeof orderId !== "string" ||
    !Number.isInteger(amount) ||
    amount <= 0
  ) {
    return Response.json({ message: "결제 정보가 올바르지 않습니다." }, { status: 400 });
  }

  // 서버가 발급한 주문번호 + 서버가 계산한 금액과 일치하는지 검증 (금액 변조 방지)
  if (!verifyOrderId(key.secret, orderId, amount)) {
    return Response.json({ message: "주문 금액이 일치하지 않아 승인하지 않았습니다." }, { status: 400 });
  }

  const res = await fetch(CONFIRM_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${key.secret}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return Response.json(
      { code: data.code, message: data.message ?? "결제 승인에 실패했습니다." },
      { status: res.status },
    );
  }

  // 데모: 주문 DB가 없으므로 화면 표시에 필요한 최소 정보만 반환
  return Response.json({
    orderId: data.orderId,
    orderName: data.orderName,
    totalAmount: data.totalAmount,
    method: data.method,
    approvedAt: data.approvedAt,
    status: data.status,
  });
}

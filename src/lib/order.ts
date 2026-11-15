// 서버 전용 모듈: 클라이언트 컴포넌트에서 import하지 마세요. (시크릿 키 사용)
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { MAX_QUANTITY } from "./brand";
import { effectivePrice, getProduct, isSoldOut } from "./products";
import type { CartItem } from "./types";

export type KeyCheck = { ok: true; secret: string } | { ok: false; message: string };

/** 시크릿 키를 읽고, 테스트 키(test_)만 허용합니다. */
export function getSecretKey(): KeyCheck {
  const secret = process.env.TOSS_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: false, message: "TOSS_SECRET_KEY가 설정되지 않았습니다. .env.local을 확인해 주세요." };
  }
  if (!secret.startsWith("test_")) {
    return { ok: false, message: "이 데모는 테스트 키(test_...)만 사용할 수 있습니다." };
  }
  return { ok: true, secret };
}

const PREFIX = "NOIR";

function signature(secret: string, rand: string, amount: number): string {
  return createHmac("sha256", secret).update(`${rand}:${amount}`).digest("hex").slice(0, 24);
}

/** 금액에 서명이 묶인 주문번호. 영문/숫자/-, 길이 46 (토스 규격: 6~64자) */
export function createOrderId(secret: string, amount: number): string {
  const rand = randomBytes(8).toString("hex");
  return `${PREFIX}-${rand}-${signature(secret, rand, amount)}`;
}

/** orderId가 이 서버에서 이 금액으로 발급된 것인지 검증합니다. */
export function verifyOrderId(secret: string, orderId: string, amount: number): boolean {
  const m = /^NOIR-([0-9a-f]{16})-([0-9a-f]{24})$/.exec(orderId);
  if (!m) return false;
  const expected = Buffer.from(signature(secret, m[1], amount));
  const actual = Buffer.from(m[2]);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export type PreparedOrder = { orderId: string; orderName: string; amount: number };

export type PrepareResult =
  | { ok: true; order: PreparedOrder }
  | { ok: false; message: string };

/** 장바구니 항목을 서버의 상품 데이터로 검증하고 금액을 직접 계산합니다. */
export function prepareOrder(secret: string, rawItems: unknown): PrepareResult {
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 50) {
    return { ok: false, message: "장바구니가 비어 있거나 올바르지 않습니다." };
  }

  let amount = 0;
  let firstName = "";
  for (const raw of rawItems as Partial<CartItem>[]) {
    const product = typeof raw?.productId === "string" ? getProduct(raw.productId) : undefined;
    if (!product) return { ok: false, message: "존재하지 않는 상품이 포함되어 있습니다." };

    const { color, size, quantity } = raw;
    if (
      typeof color !== "string" ||
      typeof size !== "string" ||
      !product.colors.some((c) => c.name === color) ||
      !product.sizes.includes(size)
    ) {
      return { ok: false, message: `${product.name}: 옵션이 올바르지 않습니다.` };
    }
    if (isSoldOut(product, color, size)) {
      return { ok: false, message: `${product.name} (${color}/${size})는 품절입니다.` };
    }
    if (!Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > MAX_QUANTITY) {
      return { ok: false, message: `${product.name}: 수량이 올바르지 않습니다.` };
    }

    amount += effectivePrice(product) * (quantity as number);
    if (!firstName) firstName = product.name;
  }

  const orderName = (rawItems.length > 1 ? `${firstName} 외 ${rawItems.length - 1}건` : firstName).slice(0, 100);
  return { ok: true, order: { orderId: createOrderId(secret, amount), orderName, amount } };
}

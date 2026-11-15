import { getSecretKey, prepareOrder } from "@/lib/order";

export async function POST(request: Request) {
  const key = getSecretKey();
  if (!key.ok) return Response.json({ message: key.message }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const result = prepareOrder(key.secret, (body as { items?: unknown })?.items);
  if (!result.ok) return Response.json({ message: result.message }, { status: 400 });
  return Response.json(result.order);
}

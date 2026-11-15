"use client";

import { toggleWishlist, useWishlistIds } from "@/lib/store";

export function WishlistButton({
  productId,
  productName,
  className = "",
  withLabel = false,
}: {
  productId: string;
  productName: string;
  className?: string;
  withLabel?: boolean;
}) {
  const ids = useWishlistIds();
  const active = ids.includes(productId);
  return (
    <button
      type="button"
      onClick={() => toggleWishlist(productId)}
      aria-pressed={active}
      aria-label={active ? `${productName} 위시리스트에서 제거` : `${productName} 위시리스트에 추가`}
      className={`inline-flex items-center justify-center gap-2 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      >
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
      </svg>
      {withLabel && <span>{active ? "위시리스트에 담김" : "위시리스트"}</span>}
    </button>
  );
}

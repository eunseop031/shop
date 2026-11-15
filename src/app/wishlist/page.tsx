import type { Metadata } from "next";
import { WishlistView } from "@/components/WishlistView";

export const metadata: Metadata = { title: "위시리스트", robots: { index: false } };

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold">위시리스트</h1>
      <WishlistView />
    </div>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { MAX_QUANTITY } from "./brand";
import type { CartItem } from "./types";

const CART_KEY = "noir:cart";
const WISH_KEY = "noir:wishlist";

const EMPTY_CART: CartItem[] = [];
const EMPTY_WISH: string[] = [];

let cart: CartItem[] = EMPTY_CART;
let wish: string[] = EMPTY_WISH;
let loaded = false;
const listeners = new Set<() => void>();

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장소 접근 실패 시 메모리 상태만 유지
  }
}

function sanitizeCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return EMPTY_CART;
  return raw.filter(
    (i): i is CartItem =>
      i &&
      typeof i.productId === "string" &&
      typeof i.color === "string" &&
      typeof i.size === "string" &&
      Number.isInteger(i.quantity) &&
      i.quantity > 0,
  );
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  cart = sanitizeCart(read<unknown>(CART_KEY, []));
  const w = read<unknown>(WISH_KEY, []);
  wish = Array.isArray(w) ? w.filter((x): x is string => typeof x === "string") : EMPTY_WISH;
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_KEY || e.key === WISH_KEY) {
      loaded = false;
      load();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getCart = () => {
  load();
  return cart;
};
const getWish = () => {
  load();
  return wish;
};

export function useCartItems(): CartItem[] {
  return useSyncExternalStore(subscribe, getCart, () => EMPTY_CART);
}

export function useWishlistIds(): string[] {
  return useSyncExternalStore(subscribe, getWish, () => EMPTY_WISH);
}

const clamp = (n: number) => Math.min(MAX_QUANTITY, Math.max(1, n));
const same = (a: CartItem, b: Pick<CartItem, "productId" | "color" | "size">) =>
  a.productId === b.productId && a.color === b.color && a.size === b.size;

export function addToCart(item: CartItem) {
  load();
  const exists = cart.find((c) => same(c, item));
  cart = exists
    ? cart.map((c) => (same(c, item) ? { ...c, quantity: clamp(c.quantity + item.quantity) } : c))
    : [...cart, { ...item, quantity: clamp(item.quantity) }];
  write(CART_KEY, cart);
  emit();
}

export function setQuantity(item: Pick<CartItem, "productId" | "color" | "size">, quantity: number) {
  load();
  cart = cart.map((c) => (same(c, item) ? { ...c, quantity: clamp(quantity) } : c));
  write(CART_KEY, cart);
  emit();
}

export function removeFromCart(item: Pick<CartItem, "productId" | "color" | "size">) {
  load();
  cart = cart.filter((c) => !same(c, item));
  write(CART_KEY, cart);
  emit();
}

export function clearCart() {
  load();
  cart = EMPTY_CART;
  write(CART_KEY, cart);
  emit();
}

export function toggleWishlist(productId: string) {
  load();
  wish = wish.includes(productId) ? wish.filter((id) => id !== productId) : [...wish, productId];
  write(WISH_KEY, wish);
  emit();
}

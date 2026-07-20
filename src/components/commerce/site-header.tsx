"use client";

import Link from "next/link";
import { useCartCount } from "@/stores/cart-store";
import { useWishlistCount } from "@/stores/wishlist-store";

export function SiteHeader() {
  const wishlistCount = useWishlistCount();
  const cartCount = useCartCount();

  return (
    <header className="week05-header">
      <Link href="/">Commerce</Link>
      <nav aria-label="주요 메뉴">
        <Link href="/products">상품</Link>
        <span>위시리스트 {wishlistCount}</span>
        <span>장바구니 {cartCount}</span>
      </nav>
    </header>
  );
}

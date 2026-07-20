"use client";

import Image from "next/image";
import { useIsInCart, useToggleCart } from "@/stores/cart-store";
import { useIsInWishlist, useToggleWishlist } from "@/stores/wishlist-store";
import type { Product } from "@/types/commerce";

const formatPrice = (price: number) => `${price.toLocaleString("ko-KR")}원`;

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const isWished = useIsInWishlist(product.id);
  const toggleWishlist = useToggleWishlist();
  const isInCart = useIsInCart(product.id);
  const toggleCart = useToggleCart();

  return (
    <article className="week05-product">
      <Image
        className="week05-image"
        src={product.image}
        alt={product.name}
        width={400}
        height={400}
      />
      <p>{product.brand}</p>
      <h3>{product.name}</h3>
      <strong>
        {product.originalPrice !== null && <del>{formatPrice(product.originalPrice)}</del>}{" "}
        {formatPrice(product.price)}
      </strong>
      <div>
        <button
          type="button"
          aria-label={`${product.name} 위시리스트`}
          aria-pressed={isWished}
          onClick={() => toggleWishlist(product.id)}
        >
          {isWished ? "찜 해제" : "찜"}
        </button>
        <button
          type="button"
          aria-label={`${product.name} 장바구니`}
          aria-pressed={isInCart}
          onClick={() => toggleCart(product.id)}
        >
          {isInCart ? "빼기" : "담기"}
        </button>
      </div>
    </article>
  );
}

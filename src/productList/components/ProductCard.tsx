import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  searchQuery: string;
  isWished: boolean;
  onToggle: (n: number) => void;
  onClick: (n: number) => void;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function ProductCard({
  product,
  searchQuery,
  isWished,
  onToggle,
  onClick,
}: ProductCardProps) {
  const highlightMatch = (text: string) => {
    if (!searchQuery) return <>{text}</>;

    const parts = text.split(
      new RegExp(`(${escapeRegExp(searchQuery)})`, "gi"),
    );

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} style={{ background: "#fff176", padding: 0 }}>
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  const discountRate = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const formattedPrice = product.price.toLocaleString() + "원";
  const formattedOriginal = product.originalPrice
    ? product.originalPrice.toLocaleString() + "원"
    : null;
  const isAlmostSoldOut = product.stock > 0 && product.stock <= 5;
  const isSoldOut = product.stock === 0;
  const isHot = discountRate >= 30;
  const isBest = product.rating >= 4.5 && product.reviewCount >= 100;
  const isFreeShipping = product.price >= 50000;

  // ─── 날짜 포맷팅 인라인 ─────────────────────
  const createdDate = new Date(product.createdAt);
  const now = new Date();
  const daysSinceCreated = Math.floor(
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const isNew = daysSinceCreated <= 7;

  return (
    <article
      key={product.id}
      className="product-card"
      onClick={() => onClick(product.id)}
    >
      <div className="image-wrap">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
        {discountRate > 0 && (
          <span className="badge badge-discount">{discountRate}% 할인</span>
        )}
        {isNew && <span className="badge badge-new">NEW</span>}
        {isHot && <span className="badge badge-hot">특가</span>}
        {isBest && <span className="badge badge-best">BEST</span>}
        {isSoldOut && <span className="badge badge-soldout">품절</span>}
        {!isSoldOut && isAlmostSoldOut && (
          <span className="badge badge-warning">품절 임박</span>
        )}
      </div>

      <div className="card-body">
        <h3 className="product-name">{highlightMatch(product.name)}</h3>
        <div className="price-area">
          {formattedOriginal && (
            <span className="original-price">{formattedOriginal}</span>
          )}
          <span className="price">{formattedPrice}</span>
          {isFreeShipping && (
            <span
              style={{
                marginLeft: 6,
                fontSize: 11,
                color: "#2e7d32",
                fontWeight: 600,
              }}
            >
              무료배송
            </span>
          )}
        </div>
        <div className="rating-area">
          <span className="rating">★ {product.rating.toFixed(1)}</span>
          <span className="review-count">
            ({product.reviewCount.toLocaleString()})
          </span>
          <button
            style={{
              marginLeft: "auto",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 16,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(product.id);
            }}
            aria-label="위시리스트 토글"
          >
            {isWished ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>
  );
}

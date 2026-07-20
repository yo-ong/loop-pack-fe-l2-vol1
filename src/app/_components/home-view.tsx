"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/product-card";
import { homeQueryOptions } from "@/queries/commerce";
import type { Product } from "@/types/commerce";

export function HomeView() {
  const { data, isPending, isError, error, refetch, isFetching } = useQuery(homeQueryOptions());

  if (isPending) {
    return <p className="week05-section">홈 화면을 불러오는 중이에요.</p>;
  }

  if (isError) {
    return (
      <div className="week05-section" role="alert">
        <p>{error.message}</p>
        <button type="button" onClick={() => refetch()} disabled={isFetching}>
          다시 시도
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <section className="week05-hero">
        <p>{data.banner.description}</p>
        <h1>{data.banner.title}</h1>
      </section>
      <section className="week05-section">
        <h2>카테고리</h2>
        <div className="week05-categories">
          {data.categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              {category.name}
            </Link>
          ))}
        </div>
      </section>
      <HomeProductSection title="인기 상품" products={data.popularProducts} />
      <HomeProductSection title="신상품" products={data.newProducts} />
    </>
  );
}

type HomeProductSectionProps = {
  title: string;
  products: Product[];
};

function HomeProductSection({ title, products }: HomeProductSectionProps) {
  return (
    <section className="week05-section">
      <h2>{title}</h2>
      {products.length === 0 ? (
        <p>지금은 보여드릴 상품이 없어요.</p>
      ) : (
        <div className="week05-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

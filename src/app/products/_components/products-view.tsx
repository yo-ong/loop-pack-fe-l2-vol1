"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/commerce/product-card";
import { productListQueryOptions } from "@/queries/commerce";
import { useProductListParams } from "../_lib/product-list-params";
import { FiltersForm } from "./filters-form";
import { Pagination } from "./pagination";

export function ProductsView() {
  const { params, setFilters, setPage } = useProductListParams();
  const { data, isPending, isError, error, refetch, isFetching } = useQuery(
    productListQueryOptions(params),
  );

  let results: ReactNode;

  if (isPending) {
    results = <p>상품 목록을 불러오는 중이에요.</p>;
  } else if (isError) {
    results = (
      <div role="alert">
        <p>{error.message}</p>
        <button type="button" onClick={() => refetch()} disabled={isFetching}>
          다시 시도
        </button>
      </div>
    );
  } else if (!data) {
    results = null;
  } else if (data.totalCount === 0) {
    results = (
      <div>
        <p>검색 결과가 없어요. 다른 조건으로 다시 시도해보세요.</p>
        <button
          type="button"
          onClick={() => setFilters({ q: "", category: "all", sort: "latest" })}
        >
          필터 초기화
        </button>
      </div>
    );
  } else if (data.products.length === 0) {
    // totalCount는 있는데 products가 빈 경우: 마지막 페이지를 초과한 page로 접근한 상태다.
    results = (
      <div>
        <p>요청한 페이지에 표시할 상품이 없어요.</p>
        <button type="button" onClick={() => setPage(1)}>
          첫 페이지로 이동
        </button>
      </div>
    );
  } else {
    results = (
      <>
        <p>총 {data.totalCount}개</p>
        <div className="week05-grid">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Pagination
          page={data.page}
          totalPages={Math.ceil(data.totalCount / data.pageSize)}
          onChangePage={setPage}
        />
      </>
    );
  }

  return (
    <>
      <section className="week05-section">
        <h1>상품 목록</h1>
        <FiltersForm
          q={params.q}
          category={params.category}
          sort={params.sort}
          onChangeFilters={setFilters}
        />
      </section>
      <section className="week05-section" aria-label="상품 검색 결과">
        {results}
      </section>
    </>
  );
}

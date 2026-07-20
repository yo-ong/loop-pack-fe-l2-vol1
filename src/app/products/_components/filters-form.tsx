"use client";

import { useEffect, useState } from "react";
import {
  PRODUCT_CATEGORY_VALUES,
  PRODUCT_SORT_VALUES,
  type ProductListFilters,
} from "../_lib/product-list-params";

const CATEGORY_LABELS: Record<ProductListFilters["category"], string> = {
  all: "전체",
  casual: "캐주얼",
  fashion: "패션",
  goods: "뷰티·잡화",
  home: "홈",
  digital: "디지털",
};

const SORT_LABELS: Record<ProductListFilters["sort"], string> = {
  latest: "최신순",
  popular: "인기순",
  "price-asc": "낮은 가격순",
  "price-desc": "높은 가격순",
};

type FiltersFormProps = {
  q: string;
  category: ProductListFilters["category"];
  sort: ProductListFilters["sort"];
  onChangeFilters: (filters: Partial<ProductListFilters>) => void;
};

export function FiltersForm({ q, category, sort, onChangeFilters }: FiltersFormProps) {
  // 제출 전 입력값은 이 컴포넌트만 쓰는 일시적 상태이므로 URL이 아닌 로컬에 둔다.
  const [draft, setDraft] = useState(q);

  // 뒤로 가기 등으로 URL의 q가 바뀌면 입력창도 확정된 값으로 되돌린다.
  useEffect(() => {
    setDraft(q);
  }, [q]);

  return (
    <form
      className="week05-filters"
      onSubmit={(event) => {
        event.preventDefault();
        onChangeFilters({ q: draft.trim() });
      }}
    >
      <label>
        검색
        <input
          name="q"
          placeholder="상품명 또는 브랜드"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </label>
      <label>
        카테고리
        <select
          name="category"
          value={category}
          onChange={(event) =>
            onChangeFilters({ category: event.target.value as ProductListFilters["category"] })
          }
        >
          {PRODUCT_CATEGORY_VALUES.map((value) => (
            <option key={value} value={value}>
              {CATEGORY_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
      <label>
        정렬
        <select
          name="sort"
          value={sort}
          onChange={(event) =>
            onChangeFilters({ sort: event.target.value as ProductListFilters["sort"] })
          }
        >
          {PRODUCT_SORT_VALUES.map((value) => (
            <option key={value} value={value}>
              {SORT_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">검색</button>
    </form>
  );
}

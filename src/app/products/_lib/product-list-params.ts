import { createParser, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import type { ProductListParams } from "@/services/commerce";
import type { CategoryId, ProductSort } from "@/types/commerce";

export const PRODUCT_CATEGORY_VALUES = [
  "all",
  "casual",
  "fashion",
  "goods",
  "home",
  "digital",
] as const satisfies readonly (CategoryId | "all")[];

export const PRODUCT_SORT_VALUES = [
  "latest",
  "popular",
  "price-asc",
  "price-desc",
] as const satisfies readonly ProductSort[];

export const PRODUCT_PAGE_SIZE = 12;

// 서버의 page 검증(1 이상의 안전한 정수)을 그대로 미러링한다.
// 규칙을 벗어난 값은 null을 돌려줘 withDefault(1)로 떨어지게 한다.
const parseAsPage = createParser({
  parse: (value) => {
    if (!/^[1-9]\d*$/.test(value)) {
      return null;
    }
    const page = Number(value);
    return Number.isSafeInteger(page) ? page : null;
  },
  serialize: (value: number) => String(value),
});

export const productListSearchParams = {
  q: parseAsString.withDefault(""),
  category: parseAsStringLiteral(PRODUCT_CATEGORY_VALUES).withDefault("all"),
  sort: parseAsStringLiteral(PRODUCT_SORT_VALUES).withDefault("latest"),
  page: parseAsPage.withDefault(1),
};

export type ProductListFilters = {
  q: string;
  category: (typeof PRODUCT_CATEGORY_VALUES)[number];
  sort: (typeof PRODUCT_SORT_VALUES)[number];
};

export function useProductListParams() {
  const [urlState, setUrlState] = useQueryStates(productListSearchParams, {
    history: "push",
  });

  const params: ProductListParams = {
    q: urlState.q,
    category: urlState.category,
    sort: urlState.sort,
    page: urlState.page,
    pageSize: PRODUCT_PAGE_SIZE,
  };

  const setFilters = (filters: Partial<ProductListFilters>) => {
    // 검색·카테고리·정렬이 바뀌면 결과 집합이 달라지므로 페이지는 항상 1로 되돌린다.
    setUrlState({ ...filters, page: 1 });
  };

  const setPage = (page: number) => {
    setUrlState({ page });
  };

  return { params, setFilters, setPage };
}

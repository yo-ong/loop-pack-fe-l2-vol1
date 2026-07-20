import { queryOptions } from "@tanstack/react-query";
import { getHome, getProducts, type ProductListParams } from "@/services/commerce";

export function homeQueryOptions() {
  return queryOptions({
    queryKey: ["home"],
    queryFn: getHome,
    // 배너·큐레이션은 세션 안에서 자주 바뀌지 않으므로 provider 기본값(20초)보다
    // 길게 잡아, 홈↔목록을 오갈 때마다 로딩 화면이 다시 뜨지 않게 한다.
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}

export function productListQueryOptions(params: ProductListParams) {
  return queryOptions({
    queryKey: ["products", "list", params],
    queryFn: () => getProducts(params),
    // 검색 결과는 최신성이 상대적으로 중요해 짧게 유지한다.
    // 기본값과 같은 값이지만 "이 쿼리의 정책"으로 명시해 근거를 남긴다.
    staleTime: 1000 * 20,
    // 필터·페이지 조합마다 캐시 엔트리가 쌓이므로 기본값(5분)보다 빨리 정리한다.
    gcTime: 1000 * 60,
  });
}

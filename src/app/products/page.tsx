import { Suspense } from "react";
import { ProductsView } from "./_components/products-view";

export default function ProductsPage() {
  return (
    <main>
      {/* useQueryStates가 내부에서 useSearchParams를 쓰므로 정적 렌더링에는 Suspense 경계가 필요하다. */}
      <Suspense fallback={<p className="week05-section">상품 목록을 준비하는 중이에요.</p>}>
        <ProductsView />
      </Suspense>
    </main>
  );
}

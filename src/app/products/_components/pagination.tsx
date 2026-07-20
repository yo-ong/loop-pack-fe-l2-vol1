"use client";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
};

export function Pagination({ page, totalPages, onChangePage }: PaginationProps) {
  return (
    <nav className="week05-pagination" aria-label="페이지 이동">
      <button type="button" disabled={page <= 1} onClick={() => onChangePage(page - 1)}>
        이전
      </button>
      <span>
        {page} / {totalPages}
      </span>
      <button type="button" disabled={page >= totalPages} onClick={() => onChangePage(page + 1)}>
        다음
      </button>
    </nav>
  );
}

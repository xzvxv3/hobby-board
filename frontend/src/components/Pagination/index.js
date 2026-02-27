// lucide-react 아이콘들 (페이지네이션 방향 버튼용)
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
// 개별 페이지 버튼 컴포넌트 (숫자 버튼 + 이전/다음 버튼 모두 이걸 재사용)
import PageButton from "./PageButton";

// 페이지네이션 전체 컴포넌트
export default function Pagination({
                                       currentPage,    // 현재 보고 있는 페이지 번호
                                       totalPages      // 전체 페이지 수
                                   }) {
    // 한 번에 보여줄 최대 페이지 버튼 개수 (가운데 정렬 방식)
    const maxVisible = 5;

    // 표시할 페이지 범위 계산 (현재 페이지를 가운데에 두려고 함)
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    // 범위가 maxVisible보다 작아지면 startPage를 왼쪽으로 조정
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // 렌더링할 페이지 버튼 배열
    const pages = [];

    // 맨 처음 페이지(1) 표시 필요 여부
    if (startPage > 1) {
        // 항상 1번 페이지 버튼 추가
        pages.push(<PageButton key={1} href="?page=1" currentPage={currentPage}>1</PageButton>);

        // 1번과 startPage 사이에 간격이 2칸 이상이면 ... 표시
        if (startPage > 2) {
            pages.push(<span key="left-ellipsis" className="px-2 text-zinc-400">...</span>);
        }
    }

    // 계산된 범위 내의 페이지 번호 버튼들 생성
    for (let page = startPage; page <= endPage; page++) {
        pages.push(
            <PageButton
                key={page}
                href={`?page=${page}`}
                currentPage={currentPage}
            >
                {page}
            </PageButton>
        );
    }

    // 맨 마지막 페이지(totalPages) 표시 필요 여부
    if (endPage < totalPages) {
        // 마지막 페이지 직전에 ... 표시 (마지막에서 2칸 이상 떨어져 있을 때)
        if (endPage < totalPages - 1) {
            pages.push(<span key="right-ellipsis" className="px-2 text-zinc-400">...</span>);
        }

        // 항상 마지막 페이지 버튼 추가
        pages.push(
            <PageButton
                key={totalPages}
                href={`?page=${totalPages}`}
                currentPage={currentPage}
            >
                {totalPages}
            </PageButton>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2 border-t border-zinc-100 py-4">
            {/* 맨 처음 페이지로 이동 */}
            <PageButton
                href="?page=1"
                disabled={currentPage === 1}
            >
                <ChevronsLeft size={18} />
            </PageButton>

            {/* 이전 페이지로 이동 */}
            <PageButton
                href={`?page=${currentPage - 1}`}
                disabled={currentPage === 1}
            >
                <ChevronLeft size={18} />
            </PageButton>

            {/* 가운데 숫자 페이지 버튼들 */}
            {pages}

            {/* 다음 페이지로 이동 */}
            <PageButton
                href={`?page=${currentPage + 1}`}
                disabled={currentPage >= totalPages}
            >
                <ChevronRight size={18} />
            </PageButton>

            {/* 맨 마지막 페이지로 이동 */}
            <PageButton
                href={`?page=${totalPages}`}
                disabled={currentPage >= totalPages}
            >
                <ChevronsRight size={18} />
            </PageButton>
        </div>
    );
}
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import PageButton from "./PageButton";

export default function Pagination({ currentPage, totalPages }) {
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];

    if (startPage > 1) {
        pages.push(<PageButton key={1} href="?page=1" currentPage={currentPage}>1</PageButton>);
        if (startPage > 2) {
            pages.push(<span key="left-ellipsis" className="px-2 text-zinc-400">...</span>);
        }
    }

    for (let page = startPage; page <= endPage; page++) {
        pages.push(
            <PageButton key={page} href={`?page=${page}`} currentPage={currentPage}>
                {page}
            </PageButton>
        );
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pages.push(<span key="right-ellipsis" className="px-2 text-zinc-400">...</span>);
        }
        pages.push(
            <PageButton key={totalPages} href={`?page=${totalPages}`} currentPage={currentPage}>
                {totalPages}
            </PageButton>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2 border-t border-zinc-100 py-4">
            <PageButton href="?page=1" disabled={currentPage === 1}><ChevronsLeft size={18} /></PageButton>
            <PageButton href={`?page=${currentPage - 1}`} disabled={currentPage === 1}><ChevronLeft size={18} /></PageButton>
            {pages}
            <PageButton href={`?page=${currentPage + 1}`} disabled={currentPage >= totalPages}><ChevronRight size={18} /></PageButton>
            <PageButton href={`?page=${totalPages}`} disabled={currentPage >= totalPages}><ChevronsRight size={18} /></PageButton>
        </div>
    );
}
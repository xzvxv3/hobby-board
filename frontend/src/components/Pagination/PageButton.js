// Next.js의 클라이언트 측 네비게이션 링크 컴포넌트
import Link from "next/link";

// 페이지네이션 버튼 개별 컴포넌트 (숫자 버튼, 이전/다음 버튼 등에 공통 사용)
export default function PageButton({
                                       href,           // 이동할 URL (예: ?page=3)
                                       children,       // 버튼에 표시할 내용 (보통 숫자 또는 « » 등)
                                       disabled,       // 비활성화 여부 (예: 첫 페이지에서 이전 버튼, 마지막 페이지에서 다음 버튼)
                                       className = "", // 추가 커스텀 클래스
                                       currentPage     // 현재 활성화된 페이지 번호 (현재 페이지 강조용)
                                   }) {
    // 기본 스타일 (크기, 여백, 둥근 모서리, 전환 효과)
    const baseClass = "px-3 py-1.5 text-sm rounded-md transition-colors";

    // 기본 텍스트 색상 (라이트/다크 모드)
    const textColor = "text-zinc-600 dark:text-zinc-400";

    // href에서 페이지 번호 추출 (예: ?page=5 → "5")
    const pageFromHref = href?.match(/\?page=(\d+)/)?.[1];

    // 현재 페이지와 일치하는지 확인 (숫자 버튼 강조용)
    const isCurrentPage = pageFromHref && Number(pageFromHref) === currentPage;

    // 현재 페이지일 때 적용할 스타일 (굵게 + 강조 색상)
    const currentStyle = isCurrentPage
        ? "font-bold !text-emerald-600 dark:!text-emerald-400"
        : "";

    // 비활성화 여부에 따른 스타일
    const disabledStyle = disabled
        ? "cursor-not-allowed opacity-70"                    // 클릭 불가 + 투명도 낮춤
        : "hover:text-emerald-700 dark:hover:text-emerald-300"; // 호버 시 색상 변화

    // 모든 클래스 합치기
    const combinedClass = `${baseClass} ${textColor} ${disabledStyle} ${className} ${currentStyle}`;

    // 비활성화 상태면 Link 대신 일반 span으로 렌더링 (클릭 방지)
    if (disabled) {
        return <span className={combinedClass}>{children}</span>;
    }

    // 정상 상태 → Link로 감싸서 이동 가능하게 함
    return <Link href={href} className={combinedClass}>{children}</Link>;
}
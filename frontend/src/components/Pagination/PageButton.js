import Link from "next/link";

export default function PageButton({ href, children, disabled, className = "", currentPage }) {
    const baseClass = "px-3 py-1.5 text-sm rounded-md transition-colors";
    const textColor = "text-zinc-600 dark:text-zinc-400";

    const pageFromHref = href?.match(/\?page=(\d+)/)?.[1];
    const isCurrentPage = pageFromHref && Number(pageFromHref) === currentPage;

    const currentStyle = isCurrentPage ? "font-bold !text-emerald-600 dark:!text-emerald-400" : "";
    const disabledStyle = disabled
        ? "cursor-not-allowed opacity-70"
        : "hover:text-emerald-700 dark:hover:text-emerald-300";

    const combinedClass = `${baseClass} ${textColor} ${disabledStyle} ${className} ${currentStyle}`;

    if (disabled) return <span className={combinedClass}>{children}</span>;
    return <Link href={href} className={combinedClass}>{children}</Link>;
}
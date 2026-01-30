"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function PostCard({ post, index, isEmpty = false }) {
    const router = useRouter();

    if (isEmpty) {
        return (
            <tr className="h-15.25">
                <td className="py-4 pl-6">&nbsp;</td>
                <td className="py-4 pl-4">&nbsp;</td>
                <td className="hidden py-4 lg:table-cell">&nbsp;</td>
                <td className="hidden py-4 sm:table-cell">&nbsp;</td>
                <td className="py-4 pr-6">&nbsp;</td>
            </tr>
        );
    }

    return (
        <tr onClick={() => router.push(`/${post.id}`)}
            className="h-15.25 group hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
            <td className="whitespace-nowrap py-4 pl-6 text-sm text-zinc-500">
                {index}
            </td>
            <td className="py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:pl-6">
                <span className="transition-colors duration-150 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {post.title}
                </span>
            </td>
            <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-zinc-500 lg:table-cell">
                {post.author}
            </td>
            <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-zinc-500 sm:table-cell">
                {post.date}
            </td>
            <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm">
                <div className="flex items-center justify-end gap-1">
                    {/* 수정 버튼: 클릭 시 해당 글의 수정 페이지로 이동 */}
                    <Link
                        href={`/${post.id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
                    >
                        <Pencil size={16} />
                    </Link>
                    {/* 삭제 버튼 */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`${post.id}번 글을 정말 삭제하시겠습니까?`)) {
                                console.log(`삭제 요청: ${post.id}`);
                                // 실제 삭제 fetch 로직 추가 가능
                            }
                        }}
                        className="rounded p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
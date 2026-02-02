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
        </tr>
    );
}
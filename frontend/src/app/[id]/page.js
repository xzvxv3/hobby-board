import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/Button";

// 특정 게시글 정보를 가져오는 함수
async function getPost(id) {
    console.log("Fetching ID:", id);
    const res = await fetch(`http://localhost:8080/api/posts/${id}`, {
        cache: "no-store", // 상세 내용은 수정될 수 있으므로 매번 새로 가져옴
    });

    if (!res.ok) return null;
    return res.json();
}

export default async function PostDetailPage(props) {
    const params = await props.params;
    const id = params.id;
    const post = await getPost(id);

    if (!post) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <p className="text-xl font-semibold text-zinc-500">게시글을 찾을 수 없습니다.</p>
                <Link href="/">
                    <Button>목록으로 돌아가기</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
            <div className="mx-auto max-w-3xl">
                {/* 상단 네비게이션 */}
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition-colors">
                        <ArrowLeft size={20} />
                        <span>목록으로</span>
                    </Link>
                    <div className="flex gap-2">
                        <Link href={`/${id}/edit`}>
                            <Button className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200">
                                <Pencil size={18} /> 수정
                            </Button>
                        </Link>
                        <Button variant="danger">
                            <Trash2 size={18} /> 삭제
                        </Button>
                    </div>
                </div>

                {/* 게시글 본문 */}
                <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <header className="mb-8 border-b border-zinc-100 pb-8 dark:border-zinc-800">
                        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                            <span>작성자: {post.author || "익명"}</span>
                            <span className="text-zinc-300">|</span>
                            <span>작성일: {post.date || "????-??-??"}</span>
                        </div>
                    </header>

                    <div className="prose prose-zinc max-w-none dark:prose-invert">
                        {/* 본문 내용: 줄바꿈 처리를 위해 white-space-pre-wrap 사용 */}
                        <p className="whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {post.content}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
}
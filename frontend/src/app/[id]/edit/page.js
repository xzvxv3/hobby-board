import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/Button";
import { auth } from "@/lib/auth";

async function getPostForEdit(id) {
    const res = await fetch(`http://localhost:8080/api/posts/${id}/edit`, {
        cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function EditPostPage(props) {
    const params = await props.params;
    const id = params.id;

    const post = await getPostForEdit(id);

    if (!post) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <p className="text-xl text-zinc-500">게시글을 찾을 수 없습니다.</p>
                <Link href="/">
                    <Button>목록으로</Button>
                </Link>
            </div>
        );
    }

    const isAuthor = post.author === session.user.name;

    console.log("[권한 체크]", {
        sessionUser: session.user.name,
        postAuthor: post.author,
        isAuthor,
        postId: id
    });

    if (!isAuthor) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <p className="text-xl text-red-600 dark:text-red-400">이 게시글을 수정할 권한이 없습니다.</p>
                <Link href={`/${id}`}>
                    <Button variant="outline">게시글 보기</Button>
                </Link>
            </div>
        )
    }

    async function updatePost(formData) {
        "use server";

        const title = formData.get("title")?.toString().trim();
        const content = formData.get("content")?.toString().trim();

        if (!title || !content) {
            throw new Error("제목과 내용을 모두 입력해주세요.");
        }

        const res = await fetch(`http://localhost:8080/api/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });

        if (!res.ok) {
            throw new Error("수정에 실패했습니다.");
        }

        redirect(`/${id}`);
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <Link
                        href={`/${id}`}
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    >
                        <ArrowLeft size={20} />
                        <span>뒤로</span>
                    </Link>
                </div>

                <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    게시글 수정
                </h1>

                <form action={updatePost} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            제목
                        </label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={post.title}
                            required
                            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            내용
                        </label>
                        <textarea
                            name="content"
                            defaultValue={post.content}
                            required
                            rows={14}
                            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="submit" variant="success">
                            수정 완료
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
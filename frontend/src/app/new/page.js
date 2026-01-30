import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/Button";

export default function NewPostPage() {
    async function createPost(formData) {
        "use server";

        const title = formData.get("title")?.toString().trim();
        const content = formData.get("content")?.toString().trim();
        const author = formData.get("author")?.toString().trim() || "익명";

        if (!title || !content) {
            throw new Error("제목과 내용을 모두 입력해주세요.");
        }

        const res = await fetch("http://localhost:8080/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, author }),
        });

        if (!res.ok) {
            throw new Error("게시글 등록에 실패했습니다.");
        }

        redirect("/");
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>목록으로</span>
                    </Link>
                </div>

                <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    새 게시글 작성
                </h1>

                <form action={createPost} className="space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            제목
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            maxLength={100}
                            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder="제목을 입력하세요"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="author"
                            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            작성자 (선택)
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            maxLength={30}
                            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder="익명으로 작성하려면 비워두세요"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="content"
                            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            내용
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            rows={12}
                            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder="자유롭게 작성해주세요..."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="submit" variant="success">
                            등록하기
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
// 클라이언트 사이드로 리다이렉트하는 Next.js 함수
import { redirect } from "next/navigation";
// Next.js의 Link 컴포넌트 (클라이언트 네비게이션)
import Link from "next/link";
// lucide-react 아이콘
import { ArrowLeft } from "lucide-react";
// 커스텀 Button 컴포넌트
import Button from "@/components/Button";
// 서버 사이드에서 세션 정보를 가져오는 함수
import { getServerSession } from "next-auth/next";
// 인증 옵션 (next-auth 설정 파일)
import { authOptions } from "@/lib/auth";

// 새 게시글 작성 페이지 (Server Component)
export default async function NewPostPage() {
    // 현재 로그인 세션 정보 가져오기
    const session = await getServerSession(authOptions);

    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!session?.user) {
        redirect("/login");
    }

    // 폼 제출 시 실행되는 Server Action (서버에서 직접 처리)
    async function createPost(formData) {
        "use server";

        // 폼 데이터에서 제목, 내용, 익명 여부 추출
        const title = formData.get("title")?.toString().trim();
        const content = formData.get("content")?.toString().trim();
        // 체크박스가 체크되면 "on" 문자열이 넘어옴
        const isAnonymous = formData.get("isAnonymous") === "on";

        // 필수값 검증
        if (!title || !content) {
            throw new Error("제목과 내용을 모두 입력해주세요.");
        }

        // 작성자 결정: 익명 체크 시 "익명", 아니면 로그인한 사용자 이름
        const author = isAnonymous ? "익명" : (session.user.name || "사용자");

        // 백엔드 API로 게시글 생성 요청
        const res = await fetch("http://localhost:8080/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, author }),
        });

        // 요청 실패 시 에러 발생
        if (!res.ok) {
            throw new Error("게시글 등록에 실패했습니다.");
        }

        // 작성 완료 후 메인 목록 페이지로 리다이렉트
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
            <div className="mx-auto max-w-3xl">
                {/* 뒤로 가기 링크 */}
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

                {/* 로그인 사용자에게 환영 메시지 표시 */}
                <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                    {session.user.name ? `${session.user.name}님, 자유롭게 작성해주세요!` : ""}
                </p>

                {/* Server Action을 사용하는 게시글 작성 폼 */}
                <form action={createPost} className="space-y-6">
                    {/* 제목 입력 필드 */}
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

                    {/* 본문 입력 필드 */}
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

                    {/* 익명 작성 체크박스 + 제출 버튼 */}
                    <div className="flex justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isAnonymous"
                                name="isAnonymous"
                                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800"
                            />
                            <label
                                htmlFor="isAnonymous"
                                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
                            >
                                익명으로 작성하기
                            </label>
                        </div>

                        <Button type="submit" variant="success">
                            등록하기
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
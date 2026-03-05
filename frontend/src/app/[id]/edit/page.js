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

// 특정 게시글 데이터를 API에서 가져오는 함수
async function getPost(id) {
    // 캐시 사용 안 함 → 항상 최신 데이터 요청
    const res = await fetch(`${process.env.API_URL}/api/posts/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
}

// 게시글 수정 페이지 (Server Component)
export default async function EditPostPage(props) {
    // 동적 라우트 파라미터 (Next.js App Router 방식)
    const params = await props.params;
    const id = params.id;

    // 현재 로그인 세션 정보 가져오기
    const session = await getServerSession(authOptions);
    // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
    if (!session?.user) {
        redirect("/login");
    }

    // 해당 id의 게시글 데이터 가져오기
    const post = await getPost(id);

    // 게시글이 존재하지 않으면 에러 메시지 표시
    if (!post) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <p className="text-xl text-zinc-500">게시글을 찾을 수 없습니다.</p>
                <Link href="/"><Button>목록으로</Button></Link>
            </div>
        );
    }

    // 게시글 작성자 정보
    const postAuthor = post.author;
    // 현재 로그인한 사용자가 작성자인지 확인
    const isAuthor = postAuthor === session.user.name;

    // 작성자가 아니면 권한 없음 메시지 표시
    if (!isAuthor) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <p className="text-xl text-red-600 dark:text-red-400">
                    이 게시글을 수정할 권한이 없습니다.
                </p>
                <Link href={`/${id}`}>
                    <Button variant="outline">게시글 보기</Button>
                </Link>
            </div>
        )
    }

    // 폼 제출 시 실행되는 Server Action (서버에서 직접 처리)
    async function updatePost(formData) {
        "use server";

        // 폼 데이터에서 제목과 내용 추출
        const title = formData.get("title")?.toString().trim();
        const content = formData.get("content")?.toString().trim();

        // 필수값 검증
        if (!title || !content) {
            throw new Error("제목과 내용을 모두 입력해주세요.");
        }

        // API로 수정 요청 보내기
        const res = await fetch(`${process.env.API_URL}/api/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });

        // 요청 실패 시 에러 발생
        if (!res.ok) {
            throw new Error("수정에 실패했습니다.");
        }

        // 수정 완료 후 해당 게시글 상세 페이지로 리다이렉트
        redirect(`/${id}`);
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
            <div className="mx-auto max-w-3xl">
                {/* 뒤로 가기 링크 */}
                <div className="mb-8">
                    <Link href={`/${id}`} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                        <ArrowLeft size={20} />
                        <span>뒤로</span>
                    </Link>
                </div>

                <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    게시글 수정
                </h1>

                {/* Server Action을 사용하는 폼 */}
                <form action={updatePost} className="space-y-6">
                    {/* 제목 입력 필드 */}
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

                    {/* 본문 입력 필드 */}
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

                    {/* 제출 버튼 영역 */}
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
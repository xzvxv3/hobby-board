'use client'

// Next.js 네비게이션 관련 훅과 컴포넌트
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

// React 기본 훅들
import { useEffect, useState, useTransition } from "react"
// 토스트 알림 라이브러리
import { toast } from 'sonner'
// 커스텀 Button 컴포넌트
import Button from "@/components/Button"
// 하위 댓글 컴포넌트
import CommentSection from "./components/CommentSection"

// 게시글 상세 페이지 컴포넌트 (Client Component)
export default function PostDetailPage() {
    // 페이지 이동 및 새로고침 제어
    const router = useRouter()
    // 동적 라우트 파라미터 (id)
    const params = useParams()
    const id = params.id

    // 게시글 데이터 상태
    const [post, setPost] = useState(null)
    // 로딩 상태
    const [loading, setLoading] = useState(true)
    // 에러 메시지 상태
    const [error, setError] = useState(null)
    // 서버 액션 진행 중 여부 (useTransition)
    const [isPending, startTransition] = useTransition()

    // 게시글 삭제 핸들러
    const handleDelete = () => {
        if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return

        startTransition(async () => {
            try {
                const res = await fetch(`/api/posts/${id}`, {
                    method: "DELETE",
                })

                if (res.ok) {
                    toast.success('게시글이 삭제되었습니다.')
                    // 목록 페이지로 이동 + 캐시 갱신
                    router.replace("/")
                    router.refresh()
                } else {
                    toast.error('삭제에 실패했습니다.')
                }
            } catch (err) {
                console.error(err)
                toast.error('삭제 중 오류가 발생했습니다.')
            }
        })
    }

    // 페이지 마운트 시 또는 id 변경 시 게시글 데이터 불러오기
    useEffect(() => {
        if (!id) return

        async function fetchPost() {
            try {
                setLoading(true)
                // API에서 게시글 단건 조회
                const res = await fetch(`/api/posts/${id}`)

                if (!res.ok) {
                    const message = res.status === 404
                        ? "게시글을 찾을 수 없습니다."
                        : "서버 오류가 발생했습니다."
                    setError(message)
                    setPost(null)
                    return
                }

                const data = await res.json()
                setPost(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPost().catch(err => console.error(err))
    }, [id])

    // 로딩 중 UI
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
        )
    }

    // 에러 또는 게시글 없음 UI
    if (error || !post) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <p className="text-xl font-semibold text-zinc-500">
                    {error || "게시글을 찾을 수 없습니다."}
                </p>
                <Link href="/">
                    <Button>목록으로 돌아가기</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
            <div className="mx-auto max-w-3xl">
                {/* 상단 네비게이션 + 액션 버튼 */}
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition-colors">
                        <ArrowLeft size={20} />
                        <span>목록으로</span>
                    </Link>
                    <div className="flex gap-2">
                        {/* 수정 페이지로 이동 */}
                        <Link href={`/${id}/edit`}>
                            <Button className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200">
                                <Pencil size={18} /> 수정
                            </Button>
                        </Link>
                        {/* 삭제 버튼 */}
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            <Trash2 size={18} />
                            {isPending ? "삭제 중..." : "삭제"}
                        </Button>
                    </div>
                </div>

                {/* 게시글 본문 영역 */}
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

                    {/* 본문 내용 (prose 스타일 적용) */}
                    <div className="prose prose-zinc max-w-none dark:prose-invert">
                        <p className="whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {post.content}
                        </p>
                    </div>
                </article>

                {/* 댓글 섹션 */}
                <CommentSection postId={id} />
            </div>
        </div>
    )
}
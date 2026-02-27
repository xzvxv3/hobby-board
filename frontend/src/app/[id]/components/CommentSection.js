'use client'

// React 훅들 임포트
import { useEffect, useState, useTransition } from 'react'
// 날짜 포맷팅 유틸리티
import { format } from 'date-fns'
// 아이콘들 (lucide-react)
import { Send, Trash2, Edit2, Check } from 'lucide-react'
// 토스트 알림 라이브러리
import { toast } from 'sonner'

// 서버에서 받은 날짜 문자열을 보기 좋게 포맷팅하는 헬퍼 함수
const formatDate = (dateStr) => {
    if (!dateStr) return '날짜 정보 없음'
    try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return '날짜 형식 오류'
        return format(date, 'yyyy.MM.dd HH:mm')
    } catch {
        return '날짜 정보 없음'
    }
}

// 메인 댓글 컴포넌트
export default function CommentSection({ postId }) {
    // 모든 댓글 목록 상태
    const [comments, setComments] = useState([])
    // 새로 작성 중인 댓글 입력값
    const [newComment, setNewComment] = useState('')
    // 서버 요청 중인지 여부 (useTransition 사용)
    const [isPending, startTransition] = useTransition()
    // 현재 수정 중인 댓글의 id
    const [editingCommentId, setEditingCommentId] = useState(null)
    // 수정 중인 댓글의 현재 입력 내용
    const [editingContent, setEditingContent] = useState('')

    // postId가 변경될 때마다 댓글 목록 불러오기
    useEffect(() => {
        async function fetchComments() {
            try {
                const res = await fetch(`/api/posts/${postId}/comments`)
                if (!res.ok) {
                    console.error('댓글 로드 실패', res.status)
                    return
                }
                const data = await res.json()
                // 작성 시간순으로 정렬 (오름차순)
                data.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
                setComments(data)
            } catch (err) {
                console.error('댓글 fetch 오류:', err)
            }
        }

        if (postId) fetchComments()
    }, [postId])

    // 새 댓글 등록 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        // 낙관적 업데이트용 임시 id 생성
        const tempId = 'temp-' + Date.now()
        const optimisticComment = {
            id: tempId,
            author: '나',
            content: newComment.trim(),
            createdAt: new Date().toISOString(),
            isPending: true,
        }

        // 즉시 UI에 추가 (Optimistic UI)
        setComments(prev => [...prev, optimisticComment])
        setNewComment('')

        try {
            // 실제 서버에 등록 요청
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author: '나', content: optimisticComment.content }),
            })

            if (!res.ok) throw new Error(await res.text())

            // 서버에서 받은 실제 id로 교체
            const newId = await res.json()
            setComments(prev =>
                prev.map(c =>
                    c.id === tempId
                        ? { ...c, id: Number(newId), isPending: false }
                        : c
                )
            )
        } catch (err) {
            console.error('댓글 등록 실패:', err)
            // 실패 시 낙관적으로 추가했던 댓글 제거 (롤백)
            setComments(prev => prev.filter(c => c.id !== tempId))
            toast.error('댓글 등록에 실패했습니다.')
        }
    }

    // 댓글 삭제 핸들러
    const handleDelete = (commentId) => {
        if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return

        // 삭제 전 원본 백업 (실패 시 복구용)
        const backup = comments.find(c => c.id === commentId)

        // 즉시 UI에서 제거 (Optimistic UI)
        setComments(prev => prev.filter(c => c.id !== commentId))

        startTransition(async () => {
            try {
                const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                    method: 'DELETE',
                })
                if (!res.ok) throw new Error('삭제 실패')
            } catch (err) {
                console.error('댓글 삭제 실패:', err)
                // 실패 시 백업한 댓글 다시 추가 + 정렬
                if (backup) {
                    setComments(prev =>
                        [...prev, backup].sort(
                            (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
                        )
                    )
                }
                toast.error('댓글 삭제에 실패했습니다.')
            }
        })
    }

    // 수정 모드 시작
    const startEdit = (commentId, currentContent) => {
        setEditingCommentId(commentId)
        setEditingContent(currentContent)
    }

    // 수정 취소
    const cancelEdit = () => {
        setEditingCommentId(null)
        setEditingContent('')
    }

    // 댓글 수정 완료 핸들러
    const handleUpdate = (commentId) => {
        if (!editingContent.trim()) {
            toast.error('댓글 내용이 비어있습니다.')
            return
        }

        // 원본 백업 (실패 시 복구용)
        const originalComment = comments.find(c => c.id === commentId)
        if (!originalComment) return

        // 즉시 UI에 반영 (Optimistic UI)
        setComments(prev =>
            prev.map(c =>
                c.id === commentId
                    ? { ...c, content: editingContent.trim(), isPending: true }
                    : c
            )
        )
        setEditingCommentId(null)
        setEditingContent('')

        startTransition(async () => {
            try {
                const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: editingContent.trim() }),
                })
                if (!res.ok) throw new Error(await res.text())

                // 성공 → pending 상태 해제
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, isPending: false } : c
                    )
                )
            } catch (err) {
                console.error('댓글 수정 실패:', err)
                // 실패 시 원본으로 복구
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...originalComment, isPending: false } : c
                    )
                )
                toast.error('댓글 수정에 실패했습니다.')
            }
        })
    }

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold mb-6 text-emerald-600">
                댓글 {comments.length}개
            </h2>

            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmit} className="mb-10">
                <div className="flex gap-3">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="댓글을 입력해주세요..."
                        className="flex-1 min-h-[80px] p-4 text-zinc-800 dark:text-zinc-300 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        disabled={isPending}
                    />
                    <button
                        type="submit"
                        disabled={isPending || !newComment.trim()}
                        className="self-end p-8 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isPending ? '등록 중...' : <Send size={20} />}
                    </button>
                </div>
            </form>

            {/* 댓글 목록 영역 */}
            <div className="space-y-6">
                {comments.length === 0 && (
                    <p className="text-center text-zinc-400 py-8">
                        첫 번째 댓글을 남겨보세요!
                    </p>
                )}
                {comments.map(comment => (
                    <div
                        key={comment.id}
                        className={`p-5 rounded-xl border transition-colors ${
                            comment.isPending
                                ? 'bg-blue-50/50 border-blue-200 animate-pulse dark:bg-blue-950/20 dark:border-blue-900'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-emerald-600">
                                {comment.author || '익명'}
                            </div>
                            <time className="text-sm text-zinc-500">
                                {formatDate(comment.createdAt)}
                            </time>
                        </div>

                        {/* 수정 모드일 때와 일반 보기 모드 분기 */}
                        {editingCommentId === comment.id ? (
                            <textarea
                                value={editingContent}
                                onChange={e => setEditingContent(e.target.value)}
                                className="w-full min-h-[60px] p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-800"
                                autoFocus
                            />
                        ) : (
                            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {comment.content}
                            </p>
                        )}

                        {/* pending 상태가 아닐 때만 수정/삭제 버튼 노출 */}
                        {!comment.isPending && (
                            <div className="mt-3 flex gap-4 text-sm text-zinc-500">
                                {editingCommentId === comment.id ? (
                                    <>
                                        <button
                                            onClick={() => handleUpdate(comment.id)}
                                            disabled={!editingContent.trim()}
                                            className="hover:text-emerald-600 transition-colors flex items-center disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Check size={16} className="mr-1" /> 완료
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="hover:text-zinc-800 transition-colors"
                                        >
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEdit(comment.id, comment.content)}
                                            className="hover:text-zinc-800 transition-colors flex items-center"
                                        >
                                            <Edit2 size={16} className="mr-1" /> 수정
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="hover:text-red-600 transition-colors flex items-center"
                                        >
                                            <Trash2 size={16} className="mr-1" /> 삭제
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
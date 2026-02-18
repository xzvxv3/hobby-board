'use client'

import { useEffect, useState, useTransition } from 'react'
import { format } from 'date-fns'
import { Send, Trash2 } from 'lucide-react'

// 날짜 안전 포맷팅 헬퍼 함수
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

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [isPending, startTransition] = useTransition()

    // 댓글 목록 불러오기
    useEffect(() => {
        async function fetchComments() {
            try {
                const res = await fetch(`/api/posts/${postId}/comments`, {
                    cache: 'no-store'
                })

                if (!res.ok) {
                    console.error('댓글 로드 실패', res.status)
                    return
                }

                const data = await res.json()
                data.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
                setComments(data)
            } catch (err) {
                console.error('댓글 fetch 오류:', err)
            }
        }

        if (postId) fetchComments()
    }, [postId])

    // 댓글 작성 (수동 optimistic)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        const tempId = 'temp-' + Date.now()
        const optimisticComment = {
            id: tempId,
            author: '나',
            content: newComment.trim(),
            createdAt: new Date().toISOString(),
            isPending: true
        }

        // 즉시 추가 (optimistic)
        setComments(prev => [...prev, optimisticComment])

        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    author: '나',
                    content: newComment.trim()
                })
            })

            if (!res.ok) {
                throw new Error(await res.text())
            }

            const newId = await res.json()

            // 실제 ID로 교체
            setComments(prev =>
                prev.map(c =>
                    c.id === tempId
                        ? { ...c, id: Number(newId), isPending: false }
                        : c
                )
            )
        } catch (err) {
            console.error('댓글 등록 실패:', err)
            // 실패 시 제거
            setComments(prev => prev.filter(c => c.id !== tempId))
            alert('댓글 등록에 실패했습니다.')
        } finally {
            setNewComment('')
        }
    }

    // 댓글 삭제 (수동 optimistic)
    const handleDelete = (commentId) => {
        if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return

        // 즉시 삭제 (optimistic)
        setComments(prev => prev.filter(c => c.id !== commentId))

        startTransition(async () => {
            try {
                const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                    method: 'DELETE'
                })

                if (!res.ok) {
                    throw new Error('삭제 실패')
                }
            } catch (err) {
                console.error('댓글 삭제 실패:', err)
                alert('댓글 삭제에 실패했습니다.')
                // 실패 시 전체 새로고침으로 롤백 (가장 안전)
                window.location.reload()
            }
        })
    }

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold mb-6 text-emerald-600">
                댓글 {comments.length}개
            </h2>

            {/* 댓글 입력 폼 */}
            <form onSubmit={handleSubmit} className="mb-10">
                <div className="flex gap-3">
          <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="댓글을 입력해주세요..."
              className="flex-1 min-h-[80px] p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-800"
              disabled={isPending}
          />
                    <button
                        type="submit"
                        disabled={isPending || !newComment.trim()}
                        className="self-end px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isPending ? '등록 중...' : <Send size={20} />}
                    </button>
                </div>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-6">
                {comments.map(comment => (
                    <div
                        key={comment.id}
                        className={`p-5 rounded-xl border ${
                            comment.isPending
                                ? 'bg-blue-50/50 border-blue-200 animate-pulse'
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

                        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {comment.content}
                        </p>

                        {!comment.isPending && (
                            <div className="mt-3 flex gap-4 text-sm text-zinc-500">
                                <button className="hover:text-zinc-800 transition-colors">
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="hover:text-red-600 transition-colors"
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
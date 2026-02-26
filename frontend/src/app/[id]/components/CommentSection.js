'use client'

import { useEffect, useState, useTransition } from 'react'
import { format } from 'date-fns'
import { Send, Trash2, Edit2, Check } from 'lucide-react'
import { toast } from 'sonner'

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
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editingContent, setEditingContent] = useState('')

    useEffect(() => {
        async function fetchComments() {
            try {
                const res = await fetch(`/api/posts/${postId}/comments`)
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        const tempId = 'temp-' + Date.now()
        const optimisticComment = {
            id: tempId,
            author: '나',
            content: newComment.trim(),
            createdAt: new Date().toISOString(),
            isPending: true,
        }

        setComments(prev => [...prev, optimisticComment])
        setNewComment('')  // ✅ 기존 finally에 있던 것을 즉시 초기화로 이동

        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author: '나', content: optimisticComment.content }),
            })

            if (!res.ok) throw new Error(await res.text())

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
            setComments(prev => prev.filter(c => c.id !== tempId))
            toast.error('댓글 등록에 실패했습니다.')  // ✅ alert 대체
        }
    }

    const handleDelete = (commentId) => {
        if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return

        console.log('삭제 시도:', {
            url: `/api/posts/${postId}/comments/${commentId}`,
            commentId,
            postId,
        })

        // 롤백을 위해 삭제 전 백업
        const backup = comments.find(c => c.id === commentId)

        setComments(prev => prev.filter(c => c.id !== commentId))

        startTransition(async () => {
            try {
                const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
                    method: 'DELETE',
                })
                if (!res.ok) throw new Error('삭제 실패')
            } catch (err) {
                console.error('댓글 삭제 실패:', err)
                // ✅ window.location.reload() 대신 백업 데이터로 롤백
                if (backup) {
                    setComments(prev =>
                        [...prev, backup].sort(
                            (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
                        )
                    )
                }
                toast.error('댓글 삭제에 실패했습니다.')  // ✅ alert 대체
            }
        })
    }

    const startEdit = (commentId, currentContent) => {
        setEditingCommentId(commentId)
        setEditingContent(currentContent)
    }

    const cancelEdit = () => {
        setEditingCommentId(null)
        setEditingContent('')
    }

    const handleUpdate = (commentId) => {
        if (!editingContent.trim()) {
            toast.error('댓글 내용이 비어있습니다.')  // ✅ alert 대체
            return
        }

        const originalComment = comments.find(c => c.id === commentId)
        if (!originalComment) return

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

                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...c, isPending: false } : c
                    )
                )
            } catch (err) {
                console.error('댓글 수정 실패:', err)
                setComments(prev =>
                    prev.map(c =>
                        c.id === commentId ? { ...originalComment, isPending: false } : c
                    )
                )
                toast.error('댓글 수정에 실패했습니다.')  // ✅ alert 대체
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

            {/* 댓글 목록 */}
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
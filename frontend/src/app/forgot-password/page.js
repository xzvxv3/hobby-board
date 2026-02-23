'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setLoading(true)

        // 간단한 클라이언트 측 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.trim() || !emailRegex.test(email)) {
            setError('올바른 이메일 주소를 입력해주세요')
            setLoading(false)
            return
        }

        try {
            // 실제로는 백엔드 API 호출 (아직 구현 안 됐으므로 임시 성공 처리)
            // 예: await fetch('http://localhost:8080/api/users/forgot-password', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email }),
            // })

            console.log('비밀번호 재설정 요청:', email)

            // 성공 시
            setSuccess(true)
        } catch (err) {
            setError('메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* 뒤로가기 + 타이틀 */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            hobby-board
                        </h1>
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                            비밀번호 찾기
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            가입 시 사용한 이메일 주소를 입력해주세요
                        </p>
                    </div>

                    {/* 폼 카드 */}
                    <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        {success ? (
                            /* 성공 상태 UI */
                            <div className="p-8 text-center space-y-6">
                                <div className="flex justify-center">
                                    <CheckCircle size={64} className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                                    이메일이 발송되었습니다
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    입력하신 이메일로 비밀번호 재설정 링크를 보내드렸습니다.<br />
                                    메일함(또는 스팸함)을 확인해주세요.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-block px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                                >
                                    로그인 화면으로 돌아가기
                                </Link>
                            </div>
                        ) : (
                            /* 폼 UI */
                            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                                {error && (
                                    <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-400">
                                        {error}
                                    </div>
                                )}

                                {/* 이메일 입력 */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                    >
                                        이메일 주소
                                    </label>
                                    <div className="mt-1.5">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none transition-colors"
                                            placeholder="example@domain.com"
                                        />
                                    </div>
                                    <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                        가입 시 사용했던 이메일을 정확히 입력해주세요
                                    </p>
                                </div>

                                {/* 제출 버튼 */}
                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`
                      w-full flex items-center justify-center gap-2
                      px-4 py-2.5 rounded-lg font-medium text-white
                      bg-emerald-600 hover:bg-emerald-700
                      disabled:bg-emerald-400 disabled:cursor-not-allowed
                      transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                    `}
                                    >
                                        <Mail size={18} />
                                        {loading ? '메일 발송 중...' : '비밀번호 재설정 메일 받기'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* 로그인으로 돌아가기 */}
                        {!success && (
                            <div className="px-6 sm:px-8 pb-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
                                기억났나요?{' '}
                                <Link
                                    href="/login"
                                    className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                                >
                                    로그인
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-600">
                © {new Date().getFullYear()} hobby-board
            </footer>
        </div>
    )
}
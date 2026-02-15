'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
    const router = useRouter()

    const [form, setForm] = useState({
        username: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
        setError('') // 입력 시 에러 초기화
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                username: form.username,
                password: form.password,
                redirect: false, // 클라이언트에서 직접 처리
            })

            if (result?.error) {
                // Auth.js에서 throw한 에러 메시지 그대로 사용
                setError(result.error || '로그인에 실패했습니다.')
            } else {
                // 성공 → 홈으로 이동 + 데이터 새로고침
                router.push('/')
                router.refresh()
            }
        } catch (err) {
            setError('알 수 없는 오류가 발생했습니다.')
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
                            href="/"
                            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            hobby-board
                        </h1>
                    </div>

                    <div className="text-center">
                        <h2 className="mt-2 text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                            로그인
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            계정으로 자유롭게 글을 작성해보세요
                        </p>
                    </div>

                    {/* 폼 */}
                    <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            {/* 에러 메시지 */}
                            {error && (
                                <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            {/* 아이디/이메일 */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    아이디 또는 이메일
                                </label>
                                <div className="mt-1.5">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        value={form.username}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none transition-colors"
                                        placeholder="example@domain.com"
                                    />
                                </div>
                            </div>

                            {/* 비밀번호 */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    비밀번호
                                </label>
                                <div className="mt-1.5 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none transition-colors pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* 자동 로그인 + 비밀번호 찾기 */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800"
                                    />
                                    <span>로그인 상태 유지</span>
                                </label>

                                <Link
                                    href="/forgot-password"
                                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                                >
                                    비밀번호 찾기
                                </Link>
                            </div>

                            {/* 로그인 버튼 */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`
                    w-full flex items-center justify-center gap-2
                    px-4 py-2.5 rounded-lg font-medium text-white
                    bg-blue-700 hover:bg-blue-800
                    disabled:bg-blue-400 disabled:cursor-not-allowed
                    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  `}
                                >
                                    <LogIn size={18} />
                                    {loading ? '로그인 중...' : '로그인'}
                                </button>
                            </div>
                        </form>

                        {/* 구분선 + 회원가입 유도 */}
                        <div className="px-6 sm:px-8 pb-8">
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-zinc-900 px-4 text-zinc-500 dark:text-zinc-400">
                    또는
                  </span>
                                </div>
                            </div>

                            <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                                아직 계정이 없으신가요?{' '}
                                <Link
                                    href="/signup"
                                    className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                                >
                                    회원가입
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 푸터 */}
            <footer className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-600">
                © {new Date().getFullYear()} hobby-board. All rights reserved.
            </footer>
        </div>
    )
}
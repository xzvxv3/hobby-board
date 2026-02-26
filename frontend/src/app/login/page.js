'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, ArrowLeft, Eye, EyeOff, Clock } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useForm } from '@/hooks/useForm'

export default function LoginPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [failCount, setFailCount] = useState(0)
    const [blockedSeconds, setBlockedSeconds] = useState(0)

    const { form, error, setError, loading, setLoading, handleChange } = useForm({
        username: '',
        password: '',
    })

    const isBlocked = blockedSeconds > 0

    useEffect(() => {
        if (blockedSeconds <= 0) return
        const timer = setInterval(() => {
            setBlockedSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setFailCount(0)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [blockedSeconds])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isBlocked) return

        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                username: form.username,
                password: form.password,
                rememberMe,
                redirect: false,
            })

            if (result?.ok) {
                startTransition(() => {
                    router.push('/')
                    router.refresh()
                })
                return
            }

            if (result?.status === 429) {
                const seconds = parseInt(result?.error?.match(/\d+/)?.[0]) || 60
                setBlockedSeconds(seconds)
                setFailCount(0)
                return
            }

            setFailCount((prev) => prev + 1)
            setError(result?.error || '아이디 또는 비밀번호를 확인해주세요.')

        } catch {
            setError('알 수 없는 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">

                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            hobby-board
                        </h1>
                    </div>

                    <div className="text-center">
                        <h2 className="mt-2 text-2xl font-semibold text-zinc-800 dark:text-zinc-200">로그인</h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            계정으로 자유롭게 글을 작성해보세요
                        </p>
                    </div>

                    <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                            {/* 차단 메시지 */}
                            {isBlocked && (
                                <div className="rounded-lg bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900 p-4">
                                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-medium mb-1">
                                        <Clock size={16} />
                                        <span>로그인이 일시적으로 차단되었습니다</span>
                                    </div>
                                    <p className="text-sm text-orange-600 dark:text-orange-500">
                                        {blockedSeconds}초 후에 다시 시도할 수 있습니다.
                                    </p>
                                    <div className="mt-3 h-1.5 w-full bg-orange-200 dark:bg-orange-900 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(blockedSeconds / 60) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 일반 에러 메시지 */}
                            {error && !isBlocked && (
                                <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-400">
                                    <p>{error}</p>
                                    {failCount >= 3 && failCount < 5 && (
                                        <p className="mt-1 font-medium">
                                            ⚠️ {5 - failCount}회 더 실패하면 1분간 로그인이 차단됩니다.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* 아이디 */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    아이디 또는 이메일
                                </label>
                                <div className="mt-1.5">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        disabled={isBlocked}
                                        value={form.username}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="example@domain.com"
                                    />
                                </div>
                            </div>

                            {/* 비밀번호 */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    비밀번호
                                </label>
                                <div className="mt-1.5 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        disabled={isBlocked}
                                        value={form.password}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none transition-colors pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
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

                            {/* 로그인 상태 유지 + 비밀번호 찾기 */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800"
                                    />
                                    <span>로그인 상태 유지</span>
                                </label>
                                <Link href="/forgot-password" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                                    비밀번호 찾기
                                </Link>
                            </div>

                            {/* 로그인 버튼 */}
                            <button
                                type="submit"
                                disabled={loading || isBlocked || isPending}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <LogIn size={18} />
                                {isBlocked
                                    ? `${blockedSeconds}초 후 재시도 가능`
                                    : isPending
                                        ? '이동 중...'
                                        : loading
                                            ? '로그인 중...'
                                            : '로그인'}
                            </button>
                        </form>

                        <div className="px-6 sm:px-8 pb-8">
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white dark:bg-zinc-900 px-4 text-zinc-500 dark:text-zinc-400">또는</span>
                                </div>
                            </div>
                            <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                                아직 계정이 없으신가요?{' '}
                                <Link href="/signup" className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                                    회원가입
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-600">
                © {new Date().getFullYear()} hobby-board. All rights reserved.
            </footer>
        </div>
    )
}
'use client'

// React 기본 훅 + Next.js 네비게이션
import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// lucide-react 아이콘들
import { LogIn, ArrowLeft, Eye, EyeOff, Clock } from 'lucide-react'
// NextAuth 클라이언트 사이드 로그인 함수
import { signIn } from 'next-auth/react'
// 커스텀 폼 상태 관리 훅 (value, onChange, error 등 통합 관리)
import { useForm } from '@/hooks/useForm'

// 로그인 페이지 컴포넌트
export default function LoginPage() {
    const router = useRouter()

    // 서버 액션/페이지 전환 진행 중 상태
    const [isPending, startTransition] = useTransition()
    // 비밀번호 표시/숨김 토글
    const [showPassword, setShowPassword] = useState(false)
    // 로그인 상태 유지 체크박스
    const [rememberMe, setRememberMe] = useState(false)
    // 연속 로그인 실패 횟수 카운터
    const [failCount, setFailCount] = useState(0)
    // 로그인 차단 남은 초 (브루트포스 방어)
    const [blockedSeconds, setBlockedSeconds] = useState(0)

    // 폼 상태 + 에러 + 로딩 + onChange 통합 관리
    const { form, error, setError, loading, setLoading, handleChange } = useForm({
        username: '',
        password: '',
    })

    // 현재 차단 상태인지 여부
    const isBlocked = blockedSeconds > 0

    // 차단 시간 카운트다운 타이머
    useEffect(() => {
        if (blockedSeconds <= 0) return

        const timer = setInterval(() => {
            setBlockedSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setFailCount(0)           // 차단 해제 시 실패 카운트 초기화
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [blockedSeconds])

    // 로그인 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isBlocked) return

        setError('')
        setLoading(true)

        try {
            // NextAuth credentials 프로바이더로 로그인 시도
            const result = await signIn('credentials', {
                username: form.username,
                password: form.password,
                rememberMe,                // 세션 유지 옵션 전달
                redirect: false,           // 리다이렉트는 직접 제어
            })

            // 로그인 성공
            if (result?.ok) {
                startTransition(() => {
                    router.push('/')
                    router.refresh()       // 캐시 갱신 및 세션 반영
                })
                return
            }

            // 서버에서 429 Too Many Requests 응답 → 차단 시간 적용
            if (result?.status === 429) {
                const seconds = parseInt(result?.error?.match(/\d+/)?.[0]) || 60
                setBlockedSeconds(seconds)
                setFailCount(0)
                return
            }

            // 일반 로그인 실패
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

                    {/* 로고 + 뒤로가기 */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            hobby-board
                        </h1>
                    </div>

                    {/* 페이지 제목 + 안내 */}
                    <div className="text-center">
                        <h2 className="mt-2 text-2xl font-semibold text-zinc-800 dark:text-zinc-200">로그인</h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            계정으로 자유롭게 글을 작성해보세요
                        </p>
                    </div>

                    {/* 폼 컨테이너 */}
                    <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                            {/* 로그인 차단 알림 */}
                            {isBlocked && (
                                <div className="rounded-lg bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900 p-4">
                                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-medium mb-1">
                                        <Clock size={16} />
                                        <span>로그인이 일시적으로 차단되었습니다</span>
                                    </div>
                                    <p className="text-sm text-orange-600 dark:text-orange-500">
                                        {blockedSeconds}초 후에 다시 시도할 수 있습니다.
                                    </p>
                                    {/* 진행률 바 */}
                                    <div className="mt-3 h-1.5 w-full bg-orange-200 dark:bg-orange-900 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(blockedSeconds / 60) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 일반 로그인 실패 메시지 + 경고 */}
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

                            {/* 아이디(또는 이메일) 입력 */}
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

                            {/* 비밀번호 입력 + 표시 토글 */}
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

                            {/* 로그인 유지 + 비밀번호 찾기 링크 */}
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

                        {/* 구분선 + 회원가입 안내 */}
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

            {/* 푸터 */}
            <footer className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-600">
                © {new Date().getFullYear()} hobby-board. All rights reserved.
            </footer>
        </div>
    )
}
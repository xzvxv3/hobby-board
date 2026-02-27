'use client'

// React 훅 + Next.js 네비게이션
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// lucide-react 아이콘들
import { ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react'
// 토스트 알림 라이브러리
import { toast } from 'sonner'
// 커스텀 폼 상태 관리 훅
import { useForm } from '@/hooks/useForm'

// HTTP 상태 코드별 에러 메시지 매핑 함수
function getErrorMessageByStatus(status) {
    switch (status) {
        case 400: return '입력값을 확인해주세요.'
        case 409: return '이미 사용 중인 아이디입니다.'
        case 500: return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        default:  return '회원가입에 실패했습니다.'
    }
}

// 회원가입 페이지 컴포넌트
export default function SignupPage() {
    const router = useRouter()

    // 서버 액션/페이지 전환 진행 중 상태
    const [isPending, startTransition] = useTransition()
    // 비밀번호 표시/숨김 토글 (첫 번째 필드)
    const [showPassword, setShowPassword] = useState(false)
    // 비밀번호 확인 필드 표시/숨김 토글
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

    // 폼 상태 + 에러 + 로딩 + onChange 통합 관리
    const { form, error, setError, loading, setLoading, handleChange } = useForm({
        username: '',
        password: '',
        passwordConfirm: '',
    })

    // 회원가입 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // 클라이언트 측 기본 검증
        if (!form.username.trim()) {
            setError('아이디를 입력해주세요.')
            setLoading(false)
            return
        }
        if (form.password.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다.')
            setLoading(false)
            return
        }
        if (form.password !== form.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.')
            setLoading(false)
            return
        }

        try {
            // 회원가입 API 호출
            const response = await fetch('/api/users/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                    passwordConfirm: form.passwordConfirm,
                }),
            })

            if (response.ok) {
                toast.success('회원가입이 완료되었습니다!')
                // 성공 시 로그인 페이지로 이동
                startTransition(() => {
                    router.push('/login')
                })
            } else {
                // 서버 에러 메시지 우선 사용, 없으면 상태코드 기반 기본 메시지
                let errorMessage = getErrorMessageByStatus(response.status)
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorData.error || errorMessage
                } catch {}
                setError(errorMessage)
            }
        } catch {
            setError('서버와 통신 중 오류가 발생했습니다.')
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
                        <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">회원가입</h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            간단한 정보로 바로 시작하세요
                        </p>
                    </div>

                    {/* 폼 컨테이너 */}
                    <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                            {/* 에러 메시지 표시 영역 */}
                            {error && (
                                <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            {/* 아이디 입력 */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    아이디
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
                                        placeholder="영문, 숫자, 특수문자 사용 가능"
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
                                        autoComplete="new-password"
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none transition-colors pr-10"
                                        placeholder="6자 이상 입력해주세요"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* 비밀번호 확인 입력 + 표시 토글 */}
                            <div>
                                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    비밀번호 확인
                                </label>
                                <div className="mt-1.5 relative">
                                    <input
                                        id="passwordConfirm"
                                        name="passwordConfirm"
                                        type={showPasswordConfirm ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        value={form.passwordConfirm}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none transition-colors pr-10"
                                        placeholder="비밀번호를 다시 입력해주세요"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    >
                                        {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* 회원가입 제출 버튼 */}
                            <button
                                type="submit"
                                disabled={loading || isPending}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                <UserPlus size={18} />
                                {isPending ? '이동 중...' : loading ? '가입 중...' : '회원가입'}
                            </button>
                        </form>

                        {/* 구분선 + 로그인 페이지 링크 */}
                        <div className="px-6 sm:px-8 pb-8">
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white dark:bg-zinc-900 px-4 text-zinc-500 dark:text-zinc-400">또는</span>
                                </div>
                            </div>
                            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                                이미 계정이 있으신가요?{' '}
                                <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                                    로그인
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 푸터 */}
            <footer className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-600">
                © {new Date().getFullYear()} hobby-board
            </footer>
        </div>
    )
}
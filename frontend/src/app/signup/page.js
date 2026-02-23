'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()

    const [form, setForm] = useState({
        username: '',
        password: '',
        passwordConfirm: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
        setError('') // 입력 시 에러 초기화
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // 간단한 클라이언트 유효성 검사
        if (!form.username.trim()) {
            setError('아이디를 입력해주세요')
            setLoading(false)
            return
        }

        if (form.password.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다')
            setLoading(false)
            return
        }

        if (form.password !== form.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다')
            setLoading(false)
            return
        }

        // 실제 회원가입 요청 (나중에 백엔드 연결)
        try {
            // 임시로 성공했다고 가정하고 로그인 페이지로 이동
            // 실제로는 fetch('http://localhost:8080/api/users/join', ...) 로 변경
            console.log('회원가입 시도:', form)

            alert('회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.')
            router.push('/login')
        } catch (err) {
            setError('회원가입 중 오류가 발생했습니다')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
            {/* 메인 컨텐츠 영역 */}
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
                        <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                            회원가입
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            간단한 정보로 바로 시작하세요
                        </p>
                    </div>

                    {/* 폼 카드 */}
                    <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            {/* 에러 메시지 */}
                            {error && (
                                <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            {/* 아이디 */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
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

                            {/* 비밀번호 확인 */}
                            <div>
                                <label
                                    htmlFor="passwordConfirm"
                                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
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

                            {/* 가입 버튼 */}
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
                                    <UserPlus size={18} />
                                    {loading ? '가입 중...' : '회원가입'}
                                </button>
                            </div>
                        </form>

                        {/* 로그인 유도 */}
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

                            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                                이미 계정이 있으신가요?{' '}
                                <Link
                                    href="/login"
                                    className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                                >
                                    로그인
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 푸터 (선택) */}
            <footer className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-600">
                © {new Date().getFullYear()} hobby-board
            </footer>
        </div>
    )
}
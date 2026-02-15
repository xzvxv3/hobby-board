import Link from "next/link";
import { LogIn, ArrowLeft } from "lucide-react";
import Button from "@/components/Button";

export default function LoginPage() {
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

                    {/* 로그인 폼 */}
                    <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                        <form className="p-6 sm:p-8 space-y-6">
                            {/* 이메일 / 아이디 */}
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
                                <div className="mt-1.5">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none transition-colors"
                                        placeholder="••••••••"
                                    />
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
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <LogIn size={18} />
                                    로그인
                                </Button>
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
                                아직 계정이 없으신가요?{" "}
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

            {/* 푸터 (선택) */}
            <footer className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-600">
                © {new Date().getFullYear()} hobby-board. All rights reserved.
            </footer>
        </div>
    );
}
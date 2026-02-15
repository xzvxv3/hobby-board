// src/middleware.js
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default async function middleware(request) {
    const session = await auth()

    const pathname = request.nextUrl.pathname

    // 보호할 경로 패턴 (필요에 따라 추가/수정)
    const protectedPaths = [
        "/new",              // 글쓰기 페이지
        "/[id]/edit",        // 게시물 수정 페이지 (동적 라우트)
        // 나중에 추가 예: "/mypage", "/settings", "/profile"
    ]

    // 보호된 경로 중 하나라도 포함되는지 체크
    const isProtected = protectedPaths.some(path =>
        pathname === path || pathname.startsWith(path + "/") || pathname.match(new RegExp(path.replace(/\[.*?\]/g, "[^/]+")))
    )

    // 로그인 안 된 상태에서 보호된 경로 접근 시 → 로그인 페이지로 리다이렉트
    if (isProtected && !session?.user) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("callbackUrl", pathname) // 로그인 후 원래 페이지로 돌아오게
        return NextResponse.redirect(loginUrl)
    }

    // 이미 로그인된 상태에서 로그인/회원가입 페이지 접근 시 → 홈으로 리다이렉트 (선택)
    if ((pathname === "/login" || pathname === "/signup") && session?.user) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    // 그 외 모든 요청은 그대로 통과
    return NextResponse.next()
}

// matcher: 이 middleware가 적용될 경로 패턴 지정 (필수!)
export const config = {
    matcher: [
        "/new",
        "/[id]/edit/:path*",   // 동적 라우트 [id]/edit 포함
        "/login",
        "/signup",
        // 필요 시 더 추가: "/mypage/:path*", "/api/private/:path*"
    ],
}
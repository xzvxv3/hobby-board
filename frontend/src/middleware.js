// next-auth/jwt에서 토큰을 추출하는 헬퍼 함수
import { getToken } from "next-auth/jwt";
// Next.js 서버 응답 객체 (리다이렉트, next() 등 생성용)
import { NextResponse } from "next/server";

// 로그인해야만 접근 가능한 경로 목록
// 여기서는 새 글 작성 페이지와 게시글 수정 페이지만 보호
const protectedRoutes = ["/new", "/[id]/edit"];

// 미들웨어 함수 (모든 매칭된 요청마다 실행됨)
export async function middleware(req) {
    // 요청 헤더와 쿠키를 이용해 JWT 토큰 추출
    // secret은 next-auth 설정과 동일해야 함 (환경변수 사용)
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    // 현재 요청된 경로 (예: /new, /123/edit 등)
    const { pathname } = req.nextUrl;

    // 현재 경로가 보호된 경로 중 하나로 시작하는지 확인
    // 예: /new → true, /123/edit → true, /about → false
    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // 보호된 경로인데 로그인(토큰)이 없는 경우
    if (isProtected && !token) {
        // 로그인 페이지로 리다이렉트 준비
        const loginUrl = new URL("/login", req.url);

        // callbackUrl 쿼리 파라미터 추가 → 로그인 후 원래 페이지로 돌아오게 함
        loginUrl.searchParams.set("callbackUrl", pathname);

        // 302 리다이렉트 응답 반환
        return NextResponse.redirect(loginUrl);
    }

    // 조건에 걸리지 않으면 다음 미들웨어 또는 페이지로 진행
    return NextResponse.next();
}

// 이 미들웨어가 적용될 경로 패턴 지정
// :id는 동적 세그먼트 (숫자나 문자열 모두 매칭)
export const config = {
    matcher: ["/new", "/:id/edit"],
};
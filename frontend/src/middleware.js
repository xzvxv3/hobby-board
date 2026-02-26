import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// 로그인이 필요한 경로
const protectedRoutes = ["/new", "/[id]/edit"];

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtected && !token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname); // 로그인 후 원래 페이지로 복귀
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/new", "/:id/edit"],
};

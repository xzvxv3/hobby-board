// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const check = rateLimit({ limit: 5, windowMs: 60_000 });

// ✅ NextAuth v4는 App Router에서 이 방식으로 써야 함
const handler = NextAuth(authOptions);

export async function POST(req, context) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const { allowed, retryAfter } = check(ip);

    if (!allowed) {
        return new Response(
            JSON.stringify({ error: `Too many requests. ${retryAfter}초 후 다시 시도하세요.` }),
            { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
    }

    // ✅ context를 함께 넘겨야 nextauth 쿼리 파라미터를 정상적으로 읽음
    return handler(req, context);
}

export async function GET(req, context) {
    return handler(req, context);
}
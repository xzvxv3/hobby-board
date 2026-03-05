// NextAuth v4 핵심 모듈
import NextAuth from "next-auth";
// 인증 옵션 설정 파일 (providers, callbacks, pages 등 정의)
import { authOptions } from "@/lib/auth";
// IP 기반 요청 제한 미들웨어/유틸리티
import { rateLimit } from "@/lib/rateLimit";

// rate limit 설정: 1분(60초) 동안 IP당 최대 5회 요청 허용
const check = rateLimit({ limit: 5, windowMs: 60_000 });

// NextAuth 핸들러 생성
// App Router에서는 이렇게 한 번 생성한 handler를 GET/POST에서 재사용
const handler = NextAuth(authOptions);

// POST 요청 핸들러 (로그인, 세션 콜백, OAuth 콜백 등 대부분의 인증 동작)
export async function POST(req, context) {
    // 실제 클라이언트 IP 추출 (프록시/클라우드플레어 등을 고려)
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    // rate limit 체크
    const { allowed, retryAfter } = check(ip);

    // 제한 초과 시 429 Too Many Requests 응답
    if (!allowed) {
        return new Response(
            JSON.stringify({ error: `Too many requests. ${retryAfter}초 후 다시 시도하세요.` }),
            {
                status: 429,
                headers: { "Retry-After": String(retryAfter) }
            }
        );
    }

    // rate limit 통과 → NextAuth 기본 핸들러 실행
    // context를 반드시 함께 전달해야 쿼리 파라미터(callbackUrl 등)를 정상적으로 처리함
    return handler(req, context);
}

// GET 요청 핸들러 (세션 조회, providers 목록, signin 페이지 등)
export async function GET(req, context) {
    // GET은 rate limit을 적용하지 않음 (보통 세션 체크가 빈번히 발생하므로)
    // 필요하면 POST와 동일하게 rate limit 로직 추가 가능
    return handler(req, context);
}
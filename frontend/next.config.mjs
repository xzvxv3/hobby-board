/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Compiler 활성화 (Next.js 14+에서 사용 가능)
  // 컴파일 타임에 React Hook 규칙 검사 강화 + 자동 memoization 등 최적화 적용
  reactCompiler: true,

  // 모든 페이지에 적용할 HTTP 보안 헤더 설정
  async headers() {
    return [
      {
        // 모든 경로 (루트부터 모든 하위 경로)에 적용
        source: "/(.*)",
        headers: [
          // 클릭재킹 방지: iframe 내에서 페이지 로드 불가
          { key: "X-Frame-Options", value: "DENY" },

          // MIME 타입 스니핑 차단
          // 브라우저가 콘텐츠 타입을 임의로 추측하지 않도록 강제
          { key: "X-Content-Type-Options", value: "nosniff" },

          // XSS 필터 강제 활성화 (오래된 브라우저 지원용, 현대 브라우저에서는 CSP로 대체)
          { key: "X-XSS-Protection", value: "1; mode=block" },

          // 리퍼러 정보 제한: 크로스 오리진 시 origin만 전송
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // HTTPS 강제 + 2년간 유지 (HSTS preload 목록 제출 가능)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // Content-Security-Policy (CSP) – 주요 보안 헤더
          // 허용된 리소스 출처를 엄격히 제한하여 XSS, 데이터 주입 등 방어
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",                    // 기본적으로 같은 출처만 허용
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // 인라인 스크립트와 eval 허용 (React/Next.js 필요)
              "style-src 'self' 'unsafe-inline'",      // 인라인 스타일 허용 (Tailwind, styled-jsx 등)
              "img-src 'self' data: blob:",            // 이미지: 같은 출처 + data URI + blob
              "connect-src 'self'",                    // fetch, XHR, WebSocket 등: 같은 출처만
              // rewrites로 백엔드 프록시 사용 중이므로 외부 API 직접 호출 없음 → 'self'만으로 충분
            ].join("; "),
          },
        ],
      },
    ];
  },

  // API 경로를 백엔드 서버로 프록시하는 rewrites 설정
  // 클라이언트에서 /api/... 로 요청하면 백엔드 서버로 라우팅됨
  // CORS 문제 해결 + API URL 숨김 효과
  async rewrites() {
    // 환경변수 BACKEND_URL 사용 (없으면 로컬 개발용 기본값)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'

    return {
      beforeFiles: [],   // 파일 기반 라우팅 전에 적용 (거의 사용 안 함)
      afterFiles: [],    // 파일 기반 라우팅 후에 적용 (거의 사용 안 함)
      fallback: [        // 모든 나머지 경우에 적용
        {
          // /api로 시작하는 모든 경로를 백엔드로 프록시
          source: '/api/:path*',
          // 백엔드의 동일한 경로로 전달 (:path* → 동적 경로 유지)
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    }
  },
}

export default nextConfig
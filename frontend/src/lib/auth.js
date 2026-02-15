// src/lib/auth.js
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",

            credentials: {
                username: { label: "아이디 또는 이메일", type: "text" },
                password: { label: "비밀번호", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                try {
                    const res = await fetch("http://localhost:8080/api/users/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                        // 쿠키 전달 필요 시 (세션 기반이라면)
                        // credentials: "include",
                    })

                    if (!res.ok) {
                        // 401, 403 등 에러 시 메시지 추출 가능하면 좋음
                        const errorData = await res.json().catch(() => ({}))
                        throw new Error(errorData.message || "로그인 실패: 아이디/비밀번호를 확인해주세요")
                    }

                    const data = await res.json()

                    // 실무에서 거의 필수: 백엔드가 사용자 정보 반환해야 함
                    if (!data?.id) {
                        throw new Error("로그인 성공했으나 사용자 정보가 없습니다")
                    }

                    return {
                        id: String(data.id),              // 반드시 string으로!
                        name: data.username || data.nickname || credentials.username,
                        email: data.email || null,
                        role: data.role || "USER",        // 역할 기반 권한 분기 시 유용
                        // 필요 시: avatar: data.avatarUrl,
                    }
                } catch (error) {
                    console.error("인증 실패:", error)
                    throw error  // 에러 메시지를 클라이언트로 전달
                }
            },
        }),
    ],

    pages: {
        signIn: "/login",
        error: "/login?error=true",  // 에러 페이지로 리다이렉트 (선택)
    },

    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7일 (실무에서 30분~14일 사이가 일반적)
    },

    jwt: {
        maxAge: 7 * 24 * 60 * 60, // JWT 만료 시간 (session과 맞춤)
    },

    callbacks: {
        async jwt({ token, user }) {
            // 로그인 직후 1회 실행
            if (user) {
                token.id = user.id
                token.role = user.role
                // token.accessToken = user.accessToken  // 백엔드 JWT가 있으면 저장 가능
            }
            return token
        },

        async session({ session, token }) {
            // 매번 session() 호출 시 실행
            if (token?.id) {
                session.user.id = token.id
                session.user.role = token.role
            }
            return session
        },
    },

    secret: process.env.AUTH_SECRET,

    // 실무 디버깅용 (production에서는 false)
    debug: process.env.NODE_ENV === "development",
})
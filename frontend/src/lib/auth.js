// src/lib/auth.js
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const {
    handlers,
    signIn,
    signOut,
    auth,
} = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "아이디 또는 이메일", type: "text" },
                password: { label: "비밀번호", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                // 임시로 성공했다고 가정 (나중에 실제 백엔드 연결)
                // 실제로는 fetch로 백엔드 호출
                return {
                    id: "temp-" + credentials.username,
                    name: credentials.username,
                    email: null,
                }
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id
            }
            return session
        },
    },

    // ★★★ 이 부분이 없으면 auth가 생성되지 않음 ★★★
    secret: process.env.AUTH_SECRET,
})
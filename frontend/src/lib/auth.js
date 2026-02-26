// src/lib/auth.js
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authOptions = {
    providers: [
        Credentials({
            credentials: {
                username: { label: "아이디 또는 이메일", type: "text" },
                password: { label: "비밀번호", type: "password" },
            },

            async authorize(credentials) {
                try {
                    const res = await fetch("http://localhost:8080/api/users/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) {
                        const errorText = await res.text();
                        let errorMessage = "아이디 또는 비밀번호가 일치하지 않습니다.";
                        try {
                            const errorData = JSON.parse(errorText);
                            errorMessage = errorData.message || errorMessage;
                        } catch (e) {
                            console.error("JSON Parse Error", errorText);
                        }
                        throw new Error(errorMessage);
                    }

                    const user = await res.json();
                    if (user) {
                        return { id: user.id, name: user.username };
                    }
                    return null;
                } catch (err) {
                    throw new Error(err.message);
                }
            }
        }),
    ],

    pages: {
        signIn: "/login",
    },

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (user?.rememberMe) {
                token.maxAge = 30 * 24 * 60 * 60  // 30일
            } else {
                token.maxAge = 24 * 60 * 60        // 1일
            }
            return token
        }
    },

    secret: process.env.AUTH_SECRET,
}

export default NextAuth(authOptions)

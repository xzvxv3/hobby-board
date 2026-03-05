// NextAuth v4 핵심 모듈 임포트
import NextAuth from "next-auth"
// Credentials 기반 로그인 프로바이더 (아이디/비밀번호 방식)
import Credentials from "next-auth/providers/credentials"

// NextAuth 설정 객체 (전역적으로 사용됨)
export const authOptions = {
    // 인증 제공자 목록
    providers: [
        // 사용자 이름(또는 이메일) + 비밀번호로 로그인하는 Credentials 프로바이더
        Credentials({
            // 로그인 폼에 표시될 필드 레이블과 타입 정의
            credentials: {
                username: { label: "아이디 또는 이메일", type: "text" },
                password: { label: "비밀번호", type: "password" },
            },

            // 실제 인증 로직 (로그인 폼 제출 시 실행됨)
            async authorize(credentials) {
                try {
                    // 백엔드 로그인 API 호출
                    const res = await fetch("http://localhost:8080/api/users/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        // 입력받은 username과 password를 JSON으로 전송
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    });

                    // 응답이 실패(401, 400 등)인 경우
                    if (!res.ok) {
                        const errorText = await res.text();
                        let errorMessage = "아이디 또는 비밀번호가 일치하지 않습니다.";

                        // 서버에서 JSON 에러 메시지가 오면 우선 사용
                        try {
                            const errorData = JSON.parse(errorText);
                            errorMessage = errorData.message || errorMessage;
                        } catch (e) {
                            console.error("JSON Parse Error", errorText);
                        }

                        // NextAuth가 인식할 수 있는 에러로 throw
                        throw new Error(errorMessage);
                    }

                    // 성공 시 사용자 정보 가져오기
                    const user = await res.json();

                    // 사용자 정보가 존재하면 NextAuth 세션에 사용할 객체 반환
                    if (user) {
                        return {
                            id: user.id,          // 고유 식별자 (필수)
                            name: user.username   // 표시용 이름
                        };
                    }

                    // 사용자 정보가 없으면 인증 실패
                    return null;
                } catch (err) {
                    // 네트워크 오류 등 예외 상황에서도 에러 throw
                    throw new Error(err.message);
                }
            }
        }),
    ],

    // 커스텀 페이지 설정
    pages: {
        // 로그인 페이지 경로 (기본 /api/auth/signin 대신 커스텀 페이지 사용)
        signIn: "/login",
    },

    // 세션 관리 전략
    session: {
        // JWT 기반 세션 (기본값, stateless하며 DB 없이 동작)
        strategy: "jwt",
    },

    // JWT 및 세션 커스터마이징 콜백
    callbacks: {
        // JWT 토큰 생성/갱신 시 호출되는 콜백
        async jwt({ token, user, account }) {
            // authorize에서 rememberMe가 전달되었을 때만 (현재 코드에서는 전달되지 않음)
            // → 실제로는 로그인 폼에서 rememberMe 체크박스 값을 credentials에 추가해야 함
            if (user?.rememberMe) {
                // 로그인 상태 유지 체크 시 → 30일
                token.maxAge = 30 * 24 * 60 * 60;
            } else {
                // 기본 → 1일
                token.maxAge = 24 * 60 * 60;
            }

            return token;
        }
        // 추가 콜백 (session, signIn 등)은 현재 생략됨
    },

    // JWT 서명 및 암호화에 사용할 비밀키 (환경변수에서 가져옴)
    // 반드시 .env에 AUTH_SECRET=긴 랜덤 문자열 로 설정해야 함
    secret: process.env.AUTH_SECRET,
}

// NextAuth v4 App Router 방식에서는 이렇게 export 후
// [...nextauth]/route.js 에서 import 해서 사용
export default NextAuth(authOptions)
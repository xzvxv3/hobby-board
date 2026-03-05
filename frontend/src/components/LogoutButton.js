'use client'

// NextAuth 클라이언트 측 로그아웃 함수
import { signOut } from 'next-auth/react'
// 프로젝트 내 커스텀 Button 컴포넌트
import Button from '@/components/Button'

// 로그아웃 버튼 컴포넌트 (클라이언트 컴포넌트)
export default function LogoutButton() {
    return (
        // form + Server Action 스타일로 로그아웃 처리
        // (Next.js 13+ App Router에서 권장되는 방식 중 하나)
        <form
            // form action에 async 함수를 직접 넣어 Server Action처럼 동작
            action={async () => {
                // NextAuth의 signOut 함수 호출
                await signOut({
                    callbackUrl: '/',          // 로그아웃 성공 후 리다이렉트할 경로 (루트 페이지)
                    redirect: true,            // true면 자동으로 callbackUrl로 이동 + 새로고침
                })
            }}
        >
            {/* danger 변형의 Button 컴포넌트 사용 */}
            <Button variant="danger">로그아웃</Button>
        </form>
    )
}
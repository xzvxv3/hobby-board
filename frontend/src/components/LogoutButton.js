'use client'

import { signOut } from 'next-auth/react'
import Button from '@/components/Button'  // 당신의 Button 컴포넌트

export default function LogoutButton() {
    return (
        <form
            action={async () => {
                await signOut({
                    callbackUrl: '/',          // 로그아웃 후 갈 곳 (절대 경로도 OK)
                    redirect: true,            // 대부분 true (페이지 이동 + 새로고침)
                })
            }}
        >
            <Button variant="danger">로그아웃</Button>
        </form>
    )
}
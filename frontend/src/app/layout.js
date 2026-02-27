// 전역 스타일시트 임포트 (Tailwind CSS 등 모든 페이지에 공통 적용)
import "./globals.css";
// Sonner 토스트 알림 컴포넌트 (전역적으로 사용)
import { Toaster } from 'sonner'

// 메타데이터 설정 (SEO, 브라우저 탭 제목 등)
export const metadata = {
    title: "hobby-board",
    description: "hobby-board",
};

// 루트 레이아웃 (Next.js App Router의 최상위 레이아웃)
// 모든 페이지가 이 레이아웃을 기반으로 렌더링됨
export default function RootLayout({ children }) {
    // children: 현재 라우트에 해당하는 페이지 컴포넌트 (또는 중첩 레이아웃)가 들어가는 자리
    return (
        <html lang="ko" className="bg-zinc-50 dark:bg-zinc-950">
        <body className="bg-zinc-50 dark:bg-zinc-950">
        {/* 실제 페이지 콘텐츠가 이 위치에 렌더링됨 */}
        {children}

        {/* Sonner Toaster 컴포넌트 */}
        {/* toast() 함수로 호출되는 모든 알림이 여기서 렌더링됨 */}
        <Toaster
            position="top-center"     // 화면 상단 중앙에 표시
            richColors                // 색상 테마를 더 풍부하게 적용
        />
        </body>
        </html>
    );
}
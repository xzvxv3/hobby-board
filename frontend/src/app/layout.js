import "./globals.css";
import { Toaster } from 'sonner'

export const metadata = {
  title: "hobby-board",
  description: "hobby-board",
};

export default function RootLayout({ children }) { // 이 레이아웃을 사용하는 모든 페이지의 실제 콘텐츠가 들어갈 자리
  return (
      <html lang="ko" className="bg-zinc-50 dark:bg-zinc-950">
        <body className="bg-zinc-50 dark:bg-zinc-950">
            {children}
            <Toaster position="top-center" richColors />
        </body>
      </html>
  );
}

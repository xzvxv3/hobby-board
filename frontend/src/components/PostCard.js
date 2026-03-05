// 이 파일은 클라이언트 컴포넌트로 사용됨 (onClick 이벤트 등 클라이언트 측 동작 포함)
"use client";

// 페이지 이동을 위한 Next.js 훅
import { useRouter } from "next/navigation";

// 게시글 목록의 한 행(Row)을 렌더링하는 컴포넌트
export default function PostCard({
                                     post,       // 게시글 데이터 객체 (title, author, date, id 등 포함)
                                     index,      // 테이블 내 순번 (보통 최신순 기준으로 계산된 번호)
                                     isEmpty = false  // 더미(빈 행) 여부 – 페이지 사이즈 맞추기 위한 플레이스홀더
                                 }) {
    const router = useRouter();

    // 빈 행(더미 데이터)인 경우 → 클릭 불가, 내용 없는 행 렌더링
    if (isEmpty) {
        return (
            <tr className="h-15.25">
                <td className="py-4 pl-6">&nbsp;</td>
                <td className="py-4 pl-4">&nbsp;</td>
                <td className="hidden py-4 lg:table-cell">&nbsp;</td>
                <td className="hidden py-4 sm:table-cell">&nbsp;</td>
            </tr>
        );
    }

    // 실제 게시글 행
    return (
        <tr
            // 행 전체를 클릭하면 해당 게시글 상세 페이지로 이동
            onClick={() => router.push(`/${post.id}`)}
            // 호버 시 배경색 변화 + 커서 포인터 느낌을 위한 group 클래스
            className="h-15.25 group hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
        >
            {/* 번호 열 */}
            <td className="whitespace-nowrap py-4 pl-6 text-sm text-zinc-500">
                {index}
            </td>

            {/* 제목 열 */}
            <td className="py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:pl-6">
                {/* 호버 시 제목 색상 강조 (group-hover 활용) */}
                <span className="transition-colors duration-150 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {post.title}
                </span>
            </td>

            {/* 작성자 열 – lg 이상에서만 표시 */}
            <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-zinc-500 lg:table-cell">
                {post.author}
            </td>

            {/* 작성일 열 – sm 이상에서만 표시 */}
            <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-zinc-500 sm:table-cell">
                {post.date}
            </td>
        </tr>
    );
}
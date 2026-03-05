// lucide-react 아이콘 (새 글 작성 버튼용 + 아이콘)
import { Plus } from "lucide-react";
// Next.js 링크 컴포넌트
import Link from "next/link";
// 게시글 카드 컴포넌트
import PostCard from "@/components/PostCard";
// 커스텀 버튼 컴포넌트
import Button from "@/components/Button";
// 로그아웃 버튼 컴포넌트
import LogoutButton from "@/components/LogoutButton";
// 서버 사이드 세션 가져오기 (NextAuth v4)
import { getServerSession } from "next-auth/next";
// 인증 옵션 설정 파일
import { authOptions } from "@/lib/auth";
// 페이지당 게시글 수 상수
import { PAGE_SIZE } from "@/lib/constants";
// 게시글 목록 조회 API 헬퍼 함수
import { getPosts } from "@/lib/api/posts";
// 페이지네이션 컴포넌트
import Pagination from "@/components/Pagination";

// 메인 홈 페이지 (Server Component)
export default async function Home({ searchParams }) {
  // URL 쿼리 파라미터 (페이지 번호 등)
  const params = await searchParams;
  // 현재 페이지 (최소 1로 보정)
  const currentPage = Math.max(1, Number(params.page) || 1);

  // 현재 페이지의 게시글 데이터 가져오기
  const data = await getPosts(currentPage);
  // 데이터 로드 실패 시 간단한 에러 UI
  if (!data) return <div>데이터를 불러올 수 없습니다.</div>;

  // API 응답 구조 분해
  const { content: posts, totalPages, totalElements } = data;

  // 페이지 사이즈만큼 항상 행을 채우기 위한 더미 데이터 추가
  const displayPosts = [...posts];
  while (displayPosts.length < PAGE_SIZE) {
    displayPosts.push({ id: `empty-${displayPosts.length}`, isEmpty: true });
  }

  // 현재 로그인 세션 정보 가져오기
  const session = await getServerSession(authOptions);

  return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {/* 사이트 타이틀 */}
          <h1 className="mb-10 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            hobby-board
          </h1>

          <section>
            {/* 섹션 헤더: 게시판 제목 + 로그인/로그아웃 영역 */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">자유게시판</h2>
              {session?.user ? (
                  <div className="flex items-center gap-3">
                    {/* 환영 메시지 + 사용자 이름 표시 */}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {session.user.name || session.user.id.slice(0, 8)}님, 안녕하세요
                    </span>
                    <LogoutButton />
                  </div>
              ) : (
                  <Link href="/login"><Button>로그인</Button></Link>
              )}
            </div>

            {/* 게시글 목록 테이블 컨테이너 */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                {/* 테이블 헤더 */}
                <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="w-20 py-3.5 pl-6 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">번호</th>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6">제목</th>
                  <th className="hidden w-35 px-3 py-3.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell">작성자</th>
                  <th className="hidden w-70 px-3 py-3.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:table-cell">날짜</th>
                </tr>
                </thead>
                {/* 테이블 본문 */}
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {displayPosts.map((post, index) => (
                    <PostCard
                        key={post.id}
                        // 실제 게시글 번호 계산 (최신순 기준 역순)
                        post={post}
                        index={post.isEmpty ? "" : totalElements - ((currentPage - 1) * PAGE_SIZE) - index}
                        isEmpty={post.isEmpty}
                    />
                ))}
                </tbody>
              </table>

              {/* 페이지네이션 컴포넌트 */}
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>

            {/* 새 글 작성 버튼 (오른쪽 정렬) */}
            <div className="mt-4 flex justify-end">
              <Link href="/new">
                <Button variant="success"><Plus size={18} />추가</Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
  );
}
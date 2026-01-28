import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Button from "@/components/Button";

// 데이터를 가져오는 비동기 함수
async function getPosts(page) {
  const res = await fetch(`http://localhost:8080/api?page=${page - 1}`, {
    // 실시간 데이터를 위해 캐시를 끄거나 짧게 설정 (선택 사항)
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("데이터를 불러오는 데 실패했습니다.");
  }

  return res.json();
}

export default async function Home({ searchParams}) {
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const data = await getPosts(currentPage);

  if (!data) return <div>데이터를 불러올 수 없습니다.</div>;

  const { content: posts, totalPages, totalElements } = data;

  const pageSize = 12;

  const displayPosts = [...posts];
  while (displayPosts.length < pageSize) {
    displayPosts.push({ id: `empty-${displayPosts.length}`, isEmpty: true });
  }

  return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-10 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            hobby-board
          </h1>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                자유게시판
              </h2>
              <Button>로그인</Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="w-16 py-3.5 pl-6 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">번호</th>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6">제목</th>
                  <th className="hidden w-32 px-3 py-3.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell">작성자</th>
                  <th className="hidden w-28 px-3 py-3.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:table-cell">날짜</th>
                  <th className="w-20 py-3.5 pl-3 pr-6 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-100">관리</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {displayPosts.map((post, index) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        index={post.isEmpty ? "" : totalElements - ((currentPage - 1) * pageSize) - index}
                        total={post.isEmpty}
                    />
                ))}
                </tbody>
              </table>

              {/* --- 페이지네이션 UI --- */}
              <div className="flex items-center justify-center gap-2 border-t border-zinc-100 py-4">
                {/* 맨 처음으로 */}
                <PageButton href="?page=1" disabled={currentPage === 1}>
                  <ChevronsLeft size={18} />
                </PageButton>

                {/* 이전 페이지 */}
                <PageButton href={`?page=${currentPage - 1}`} disabled={currentPage === 1}>
                  <ChevronLeft size={18} />
                </PageButton>

                {/* 페이지 번호 (간단하게 현재 페이지 표시) */}
                <div className="flex items-center gap-1 px-4">
                  <span className="text-sm font-bold text-emerald-600">{currentPage}</span>
                  <span className="text-sm text-zinc-400">/</span>
                  <span className="text-sm text-zinc-500">{totalPages}</span>
                </div>

                {/* 다음 페이지 */}
                <PageButton href={`?page=${currentPage + 1}`} disabled={currentPage >= totalPages}>
                  <ChevronRight size={18} />
                </PageButton>

                {/* 맨 끝으로 */}
                <PageButton href={`?page=${totalPages}`} disabled={currentPage >= totalPages}>
                  <ChevronsRight size={18} />
                </PageButton>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link href="/new">
                <Button variant="success">
                  <Plus size={18} />
                  추가
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
  );
}

function PageButton({ href, children, disabled }) {
  if (disabled) {
    return <span className="p-2 text-zinc-300 cursor-not-allowed">{children}</span>;
  }
  return (
      <Link href={href} className="p-2 text-zinc-500 hover:text-emerald-600 transition-colors">
        {children}
      </Link>
  );
}
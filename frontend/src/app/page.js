import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Button from "@/components/Button";
import { auth, signOut } from "@/lib/auth";

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

  const session = await auth();

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

              {/* 로그인 상태에 따라 버튼 변경 */}
              {session?.user ? (
                  <div className="flex items-center gap-3">
                    {/* 사용자 이름 표시 */}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {session.user.name || session.user.id.slice(0, 8)}님, 안녕하세요
                    </span>

                    {/* 로그아웃 버튼 */}
                    <form
                        action={async () => {
                          "use server";
                          await signOut({ redirectTo: "/" });
                        }}
                    >
                      <Button variant="danger">로그아웃</Button>
                    </form>
                  </div>
              ) : (
                  <Link href="/login">
                    <Button>로그인</Button>
                  </Link>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="w-20 py-3.5 pl-6 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">번호</th>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6">제목</th>
                  <th className="hidden w-35 px-3 py-3.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell">작성자</th>
                  <th className="hidden w-70 px-3 py-3.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:table-cell">날짜</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {displayPosts.map((post, index) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        index={post.isEmpty ? "" : totalElements - ((currentPage - 1) * pageSize) - index}
                        isEmpty={post.isEmpty}
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

                {/* 숫자 페이지 버튼 + ellipsis */}
                {(() => {
                  const maxVisible = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                  // 끝부분 조정 (총 페이지가 적을 때)
                  if (endPage - startPage + 1 < maxVisible) {
                    startPage = Math.max(1, endPage - maxVisible + 1);
                  }

                  const pages = [];

                  // 첫 페이지 항상 표시 + 필요시 ellipsis
                  if (startPage > 1) {
                    pages.push(
                        <PageButton key={1} href="?page=1" currentPage={currentPage}>
                          1
                        </PageButton>
                    );
                    if (startPage > 2) {
                      pages.push(<span key="left-ellipsis" className="px-2 text-zinc-400">...</span>);
                    }
                  }

                  // 가운데 페이지들
                  for (let page = startPage; page <= endPage; page++) {
                    pages.push(
                        <PageButton
                            key={page}
                            href={`?page=${page}`}
                            currentPage={currentPage}
                        >
                          {page}
                        </PageButton>
                    );
                  }

                  // 마지막 페이지 항상 표시 + 필요시 ellipsis
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(<span key="right-ellipsis" className="px-2 text-zinc-400">...</span>);
                    }
                    pages.push(
                        <PageButton key={totalPages} href={`?page=${totalPages}`} currentPage={currentPage}>
                          {totalPages}
                        </PageButton>
                    );
                  }

                  return pages;
                })()}

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

function PageButton({
                      href,
                      children,
                      disabled,
                      className = "",
                      currentPage,   // ← 새로 추가: Home에서 currentPage를 prop으로 넘겨줌
                    }) {
  const baseClass = "px-3 py-1.5 text-sm rounded-md transition-colors";

  // 기본 텍스트 색상: disabled 여부와 상관없이 zinc-600으로 통일
  const textColor = "text-zinc-600 dark:text-zinc-400";

  // 현재 페이지인지 href로 판단 (예: href="?page=3" → page=3)
  const pageFromHref = href?.match(/\?page=(\d+)/)?.[1];
  const isCurrentPage = pageFromHref && Number(pageFromHref) === currentPage;

  // 현재 페이지일 때만 에메랄드 강조
  const currentStyle = isCurrentPage
      ? "font-bold !text-emerald-600 dark:!text-emerald-400"
      : "";

  // disabled 스타일 (색상 변화 없이 커서만 변경)
  const disabledStyle = disabled
      ? "cursor-not-allowed opacity-70"
      : "hover:text-emerald-700 dark:hover:text-emerald-300";

  const combinedClass = `${baseClass} ${textColor} ${disabledStyle} ${className} ${currentStyle}`;

  if (disabled) {
    return (
        <span className={combinedClass}>
        {children}
      </span>
    );
  }

  return (
      <Link href={href} className={combinedClass}>
        {children}
      </Link>
  );
}
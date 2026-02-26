import { Plus } from "lucide-react";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Button from "@/components/Button";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth/next"; // V4 방식
import { authOptions } from "@/lib/auth";
import { PAGE_SIZE } from "@/lib/constants";
import { getPosts } from "@/lib/api/posts";
import Pagination from "@/components/Pagination";

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const data = await getPosts(currentPage);
  if (!data) return <div>데이터를 불러올 수 없습니다.</div>;

  const { content: posts, totalPages, totalElements } = data;

  const displayPosts = [...posts];
  while (displayPosts.length < PAGE_SIZE) {
    displayPosts.push({ id: `empty-${displayPosts.length}`, isEmpty: true });
  }

  const session = await getServerSession(authOptions);

  return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-10 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            hobby-board
          </h1>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">자유게시판</h2>
              {session?.user ? (
                  <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {session.user.name || session.user.id.slice(0, 8)}님, 안녕하세요
                </span>
                    <LogoutButton />
                  </div>
              ) : (
                  <Link href="/login"><Button>로그인</Button></Link>
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
                        index={post.isEmpty ? "" : totalElements - ((currentPage - 1) * PAGE_SIZE) - index}
                        isEmpty={post.isEmpty}
                    />
                ))}
                </tbody>
              </table>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>

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
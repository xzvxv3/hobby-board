import { Pencil, Trash2, Plus } from "lucide-react"; // lucide-react에서 특정 아이콘 가져와서 사용 가능
import Link from "next/link";

const postData = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `게시판 ${i + 1}`,
  author: `user${i + 1}`,
  date: i === 0 ? "방금 전" : `${i}시간 전`,
}));

export default function Home() {
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
              <button
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800"
                  aria-label="새 게시글 작성"
              >
                로그인
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th
                      scope="col" // 접근성을 챙기기 위한 코드, 열 전체를 나타냄
                      className="w-16 py-3.5 pl-6 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    번호
                  </th>
                  <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6"
                  >
                    제목
                  </th>
                  <th
                      scope="col"
                      className="hidden w-32 px-3 py-3.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 lg:table-cell"
                  >
                    작성자
                  </th>
                  <th
                      scope="col"
                      className="hidden w-28 px-3 py-3.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:table-cell"
                  >
                    날짜
                  </th>
                  <th
                      scope="col"
                      className="w-20 py-3.5 pl-3 pr-10.5 text-right text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    관리
                  </th>
                </tr>
                </thead>

                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {postData.length === 0 ? (
                    <tr>
                      <td
                          colSpan={5}
                          className="py-16 text-center text-zinc-500 dark:text-zinc-400"
                      >
                        아직 게시글이 없습니다.
                      </td>
                    </tr>
                ) : (
                    postData.map((post, index) => ( // 각각의 게시글을 post로 받고 몇 번째 인지는 index로 받음
                        <tr
                            key={post.id} // *중요* “이 행은 이 게시글(id)과 연결된 거야”라고 알려줌
                            className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                        >
                          <td className="whitespace-nowrap py-4 pl-6 text-sm text-zinc-500">
                            {postData.length - index}
                          </td>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:pl-6">
                            <Link
                                href={`/posts/${post.id}`} // 나중에 실제 상세 페이지 경로로 변경
                                className="hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                              {post.title}
                            </Link>
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-zinc-500 lg:table-cell">
                            {post.author}
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-center text-sm text-zinc-500 sm:table-cell">
                            {post.date}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm">
                            <div className="flex items-center justify-end gap-1 duration-150">
                              <button
                                  title="수정"
                                  aria-label="이 게시글 수정"
                                  className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                  title="삭제"
                                  aria-label="이 게시글 삭제"
                                  className="rounded p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 active:bg-emerald-800"
                  aria-label="새 게시글 작성"
              >
                <Plus size={18} />
                추가
              </button>
            </div>
          </section>
        </div>
      </div>
  );
}
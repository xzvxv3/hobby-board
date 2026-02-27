// 서버 사이드에서 게시글 목록을 가져오는 헬퍼 함수
// 주로 Home 페이지나 목록 페이지에서 사용됨 (Server Component 내에서 호출)
export async function getPosts(page) {
    // 페이지 번호는 1부터 시작하지만, 백엔드 API는 0부터 시작하는 경우가 많아 page-1 처리
    const res = await fetch(
        `${process.env.API_URL}/api?page=${page - 1}`,
        { cache: "no-store" }  // 항상 최신 데이터를 가져오도록 캐시 완전 비활성화
    );

    // 응답 상태가 200~299가 아니면 에러 처리
    if (!res.ok) {
        throw new Error("데이터를 불러오는 데 실패했습니다.");
    }

    // JSON 형식으로 파싱하여 반환
    // 예상 응답 구조: { content: [...], totalPages: N, totalElements: M, ... }
    return res.json();
}
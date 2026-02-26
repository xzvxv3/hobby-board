export async function getPosts(page) {
    const res = await fetch(
        `${process.env.API_URL}/api?page=${page - 1}`,
        { cache: "no-store" }
    );

    if (!res.ok) throw new Error("데이터를 불러오는 데 실패했습니다.");
    return res.json();
}
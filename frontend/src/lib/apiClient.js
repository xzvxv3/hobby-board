// 공통 fetch 요청 헬퍼 함수 (클라이언트 측에서 사용)
// 모든 HTTP 메서드에 대해 일관된 에러 처리와 JSON 응답을 보장
async function request(url, options = {}) {
    // 기본 헤더 설정 + 사용자 지정 헤더 병합
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        // 나머지 옵션(method, body, credentials 등) 병합
        ...options,
    })

    // 응답이 성공(200~299)이 아닌 경우
    if (!res.ok) {
        // 상태 코드에 따른 기본 에러 메시지 가져오기
        let message = getErrorMessageByStatus(res.status)

        // 서버에서 보낸 JSON 에러 메시지 우선 사용 시도
        try {
            const data = await res.json()
            // 서버가 message 또는 error 필드를 보냈으면 그것 사용
            message = data.message || data.error || message
        } catch {
            // JSON 파싱 실패 시 기본 메시지 유지
        }

        // 통일된 에러 객체로 throw (catch 블록에서 쉽게 처리 가능)
        throw new Error(message)
    }

    // 성공 시 JSON 파싱하여 반환
    return res.json()
}

// API 요청을 편리하게 호출할 수 있는 클라이언트 객체
// 사용 예: apiClient.get('/api/posts'), apiClient.post('/api/comments', { content: '좋아요!' })
export const apiClient = {
    // GET 요청
    get: (url) => request(url),

    // POST 요청 (body를 JSON으로 자동 직렬화)
    post: (url, body) => request(url, {
        method: 'POST',
        body: JSON.stringify(body)
    }),

    // PUT 요청 (수정용)
    put: (url, body) => request(url, {
        method: 'PUT',
        body: JSON.stringify(body)
    }),

    // DELETE 요청
    delete: (url) => request(url, {
        method: 'DELETE'
    }),
}
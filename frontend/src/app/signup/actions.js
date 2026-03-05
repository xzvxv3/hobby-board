// 이 파일은 Server Action으로 사용됨 (클라이언트에서 form action으로 호출 가능)
'use server'

// 회원가입 처리 Server Action
export async function signupAction(formData) {
    // 폼 데이터에서 username과 password 추출
    const username = formData.get('username')
    const password = formData.get('password')

    try {
        // 백엔드 API로 회원가입 요청 전송
        const res = await fetch(`${process.env.API_URL}/api/users/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // JSON 형식으로 아이디와 비밀번호 전송
            body: JSON.stringify({ username, password }),
        })

        // 응답이 실패(4xx, 5xx)인 경우
        if (!res.ok) {
            // 서버에서 보낸 에러 메시지 파싱 시도
            const data = await res.json()
            // 서버 메시지가 있으면 그걸 사용, 없으면 기본 메시지 반환
            return { error: data.message || '회원가입에 실패했습니다.' }
        }

        // 성공 시 간단한 성공 플래그 반환
        return { success: true }

    } catch (err) {
        // 네트워크 오류, fetch 자체 실패 등 예외 상황
        console.error('회원가입 Server Action 오류:', err)
        return { error: '서버 연결에 문제가 발생했습니다.' }
    }
}
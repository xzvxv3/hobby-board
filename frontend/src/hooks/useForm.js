import { useState } from 'react'

// 폼 상태를 편리하게 관리하기 위한 커스텀 훅
// 주로 로그인, 회원가입, 댓글 작성 등 입력 폼이 있는 컴포넌트에서 사용
export function useForm(initialValues) {
    // 입력값들을 객체 형태로 관리하는 상태
    // 예: { username: '', password: '', ... }
    const [form, setForm] = useState(initialValues)

    // 폼 전체에 대한 에러 메시지 (한 번에 하나의 에러만 표시하는 단순 방식)
    const [error, setError] = useState('')

    // 현재 서버 요청/처리 중인지 여부 (로딩 상태)
    const [loading, setLoading] = useState(false)

    // 입력 필드의 onChange 이벤트 핸들러
    // 입력값을 실시간으로 form 상태에 반영하고, 에러 메시지를 지움
    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        // 입력이 들어오면 이전 에러 메시지 초기화
        setError('')
    }

    // 훅이 반환하는 값들
    // 사용하는 컴포넌트에서 구조 분해 할당으로 쉽게 꺼내 쓸 수 있음
    return {
        form,           // 현재 입력값 객체
        error,          // 에러 메시지 문자열
        setError,       // 에러 메시지 직접 설정하는 함수
        loading,        // 로딩 상태
        setLoading,     // 로딩 상태 직접 변경하는 함수
        handleChange    // 모든 input/select 등의 onChange에 연결할 함수
    }
}
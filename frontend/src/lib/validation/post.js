// 게시글 작성/수정 시 입력값을 검증하는 유틸리티 함수
// 클라이언트와 서버 양쪽에서 모두 사용할 수 있도록 순수 함수로 작성됨
export function validatePost({ title, content }) {
    // 검증 실패 시 각 필드별 에러 메시지를 담을 객체
    const errors = {};

    // 제목 검증
    if (!title?.trim()) {
        // 제목이 비어 있거나 공백만 있는 경우
        errors.title = "제목을 입력해주세요.";
    } else if (title.length > 100) {
        // 제목 길이 제한 초과
        errors.title = "제목은 100자 이내로 입력해주세요.";
    }

    // 본문(내용) 검증
    if (!content?.trim()) {
        // 내용이 비어 있거나 공백만 있는 경우
        errors.content = "내용을 입력해주세요.";
    } else if (content.length > 5000) {
        // 내용 길이 제한 초과 (5000자 = 약 1000~1500단어 수준)
        errors.content = "내용은 5000자 이내로 입력해주세요.";
    }

    // 기본적인 XSS 방어: <script> 태그가 포함되어 있는지 검사
    // title과 content 모두 검사
    const scriptPattern = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
    if (scriptPattern.test(title) || scriptPattern.test(content)) {
        // script 태그가 발견되면 전체적으로 에러 처리
        // (실제로는 서버 측에서 더 강력한 sanitization 필요)
        errors.xss = "허용되지 않는 문자가 포함되어 있습니다.";
    }

    // 검증 결과 반환
    // isValid: true → 모든 검증 통과
    // errors: 실패한 항목들이 담긴 객체 (빈 객체 = 성공)
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
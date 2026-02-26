export function validatePost({ title, content }) {
    const errors = {};

    if (!title?.trim()) {
        errors.title = "제목을 입력해주세요.";
    } else if (title.length > 100) {
        errors.title = "제목은 100자 이내로 입력해주세요.";
    }

    if (!content?.trim()) {
        errors.content = "내용을 입력해주세요.";
    } else if (content.length > 5000) {
        errors.content = "내용은 5000자 이내로 입력해주세요.";
    }

    // 스크립트 태그 삽입 시도 감지
    const scriptPattern = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
    if (scriptPattern.test(title) || scriptPattern.test(content)) {
        errors.xss = "허용되지 않는 문자가 포함되어 있습니다.";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
}
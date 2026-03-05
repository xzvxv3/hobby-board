// IP별 요청 횟수를 추적하기 위한 전역 Map
// 키: IP 주소 (문자열), 값: { count: 숫자, startTime: 타임스탬프 }
const rateLimitMap = new Map();

// rate limit 미들웨어/헬퍼 함수를 생성하는 팩토리 함수
// 기본값: 1분(60초) 동안 최대 5회 요청 허용
export function rateLimit({
                              limit = 5,       // 허용할 최대 요청 횟수
                              windowMs = 60_000  // 시간 창 (밀리초) - 기본 60초
                          } = {}) {
    // 실제로 호출될 때마다 IP를 받아 체크하는 함수를 반환 (클로저)
    return function check(ip) {
        const now = Date.now();           // 현재 타임스탬프 (밀리초)

        // 해당 IP의 기존 기록 가져오기
        const record = rateLimitMap.get(ip);

        // 기록이 없거나, 시간 창이 지났다면 → 새로 시작
        if (!record || now - record.startTime > windowMs) {
            // 새 기록 생성: 카운트 1, 시작 시간 = 지금
            rateLimitMap.set(ip, { count: 1, startTime: now });
            return { allowed: true };     // 요청 허용
        }

        // 이미 시간 창 내에 있고, 제한 횟수에 도달했다면 → 차단
        if (record.count >= limit) {
            // 남은 시간(초) 계산 → Math.ceil로 올림 처리
            const retryAfter = Math.ceil((record.startTime + windowMs - now) / 1000);
            return {
                allowed: false,
                retryAfter               // 클라이언트에게 Retry-After 헤더로 알려줄 값
            };
        }

        // 아직 제한에 도달하지 않았다면 → 카운트 증가 후 허용
        record.count++;
        return { allowed: true };
    };
}
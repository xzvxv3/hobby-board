const rateLimitMap = new Map();

export function rateLimit({ limit = 5, windowMs = 60_000 } = {}) {
    return function check(ip) {
        const now = Date.now();
        const record = rateLimitMap.get(ip);

        if (!record || now - record.startTime > windowMs) {
            rateLimitMap.set(ip, { count: 1, startTime: now });
            return { allowed: true };
        }

        if (record.count >= limit) {
            return { allowed: false, retryAfter: Math.ceil((record.startTime + windowMs - now) / 1000) };
        }

        record.count++;
        return { allowed: true };
    };
}
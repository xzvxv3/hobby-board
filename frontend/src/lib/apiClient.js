async function request(url, options = {}) {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    })

    if (!res.ok) {
        let message = getErrorMessageByStatus(res.status)
        try {
            const data = await res.json()
            message = data.message || data.error || message
        } catch {}
        throw new Error(message)  // 에러를 throw로 통일
    }

    return res.json()
}

export const apiClient = {
    get: (url) => request(url),
    post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
    put: (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (url) => request(url, { method: 'DELETE' }),
}
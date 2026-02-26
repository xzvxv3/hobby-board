'use server'

export async function signupAction(formData) {
    const username = formData.get('username')
    const password = formData.get('password')

    const res = await fetch(`${process.env.API_URL}/api/users/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
        const data = await res.json()
        return { error: data.message || '회원가입에 실패했습니다.' }
    }

    return { success: true }
}
import { request, setAuthToken } from './client'

export function registerUser({ name, phone, email, password }) {
    return request('/users/register', {
        method: 'POST',
        idempotent: true,
        body: { name, phone, email, password },
    })
}

export function loginUser({ email, password }) {
    return request('/users/login', {
        method: 'POST',
        idempotent: true,
        body: { email, password },
    })
}

export async function verifyOtp({ challengeId, code }) {
    const result = await request('/users/verify-otp', {
        method: 'POST',
        idempotent: true,
        body: { challengeId, code },
    })

    setAuthToken(result.token)
    return result
}
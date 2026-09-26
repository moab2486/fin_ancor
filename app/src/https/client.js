const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '')

function createIdempotencyKey() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export class ApiError extends Error {
    constructor(message, status, details) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.details = details
    }
}

let authToken = null

export function setAuthToken(token) {
    authToken = token
}

export async function request(path, options = {}) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    }

    if (options.idempotent) {
        headers['Idempotency-Key'] = createIdempotencyKey()
    }

    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
    }

    let response
    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
        })
    } catch (_error) {
        throw new ApiError('Unable to reach the server. Check your connection and try again.')
    }

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw new ApiError(
            payload.error || 'The request could not be completed.',
            response.status,
            payload.details,
        )
    }

    return payload
}

export { API_URL }
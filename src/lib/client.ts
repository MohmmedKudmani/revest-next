import { ApiErrorSchema } from '@/schemas/shared.schema'

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

function parseApiError(body: unknown): string {
  const parsed = ApiErrorSchema.safeParse(body)
  if (!parsed.success) return 'Unexpected error'
  const { message } = parsed.data
  return Array.isArray(message) ? message.join(', ') : message
}

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiRequestError(parseApiError(body), res.status)
  }
  return res.json() as Promise<T>
}

/** Build a URLSearchParams string from an object, omitting undefined/empty values */
export function buildSearchParams(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      sp.set(key, String(value))
    }
  }
  return sp.toString()
}

import { parseApiError } from '@/lib/utils'

/** An error thrown by `client` when the server responds with a non-2xx status.
 *  `statusCode` mirrors the HTTP status (e.g. 404, 422). */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

/** The two backend microservices. */
export type Service = 'product' | 'order'

const BASE_URLS: Record<Service, string> = {
  product: process.env.PRODUCT_SERVICE_URL!,
  order: process.env.ORDER_SERVICE_URL!,
}

/** Wrapper returned by all mutation endpoints (POST / PATCH / DELETE).
 *  Read `data` for the entity and `message` for the success toast. */
export type MutationResponse<T = unknown> = {
  message: string
  data: T
}

/** Options passed to `client`. Extends `RequestInit` with a typed `body`
 *  field — plain objects are JSON-stringified automatically. */
export type ClientInit = Omit<RequestInit, 'body'> & { body?: unknown }

/**
 * Fetch helper for the backend microservices.
 *
 * - Pass `'product'` or `'order'` as the first argument; the base URL is
 *   resolved from env vars internally.
 * - Plain-object `body` is JSON-stringified and `Content-Type: application/json`
 *   is set automatically.
 * - Throws `ApiRequestError` on non-2xx responses.
 * - Tolerates empty / 204 bodies (returns `undefined`).
 *
 * @example
 * const list    = await client<PaginatedProducts>('product', `/products?${buildSearchParams(params)}`)
 * const item    = await client<Product>('product', `/products/${id}`)
 * const created = await client<Product>('product', '/products', { method: 'POST', body: data })
 * await client('product', `/products/${id}`, { method: 'DELETE' })
 */
export async function client<T>(
  service: Service,
  path: string,
  init?: ClientInit,
): Promise<T> {
  const { body, headers, ...rest } = init ?? {}

  const isJsonBody = body !== undefined && body !== null

  const res = await fetch(`${BASE_URLS[service]}${path}`, {
    ...rest,
    headers: {
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: isJsonBody ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new ApiRequestError(parseApiError(errBody), res.status)
  }

  // 204 No Content or empty body — return undefined rather than crashing on .json()
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

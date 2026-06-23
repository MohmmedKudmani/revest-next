import { ApiRequestError } from '@/lib/client'

/**
 * The return type for all Server Actions.
 *
 * Discriminate on the `error` key:
 * - `{ data }` — success; `data` holds the returned value.
 * - `{ error }` — failure; `error.status` is the HTTP status code and
 *   `error.message` is the human-readable reason from the backend.
 *   `fieldErrors` is present when a Zod validation failure maps individual
 *   fields to messages (e.g. form validation before the API is called).
 *
 * @example
 * const result = await createProduct(values)
 * if ('error' in result) {
 *   toast.error(result.error.message)
 * } else {
 *   use(result.data)
 * }
 */
export type ActionResult<T = void> =
  | { data: T; message: string }
  | {
      error: { status: number; message: string }
      fieldErrors?: Record<string, string[]>
    }

/**
 * Map a thrown error to a failed `ActionResult`.
 *
 * - `ApiRequestError` — surfaces the backend's `status` and `message` directly.
 * - Anything else (network failure, timeout) — returns a generic 503 fallback.
 *
 * Use this in the `catch` block of every Server Action so error handling is
 * consistent across the app without repeating the same branching logic.
 *
 * @example
 * } catch (err) {
 *   return toActionError(err)
 * }
 */
export function toActionError(err: unknown): ActionResult<never> {
  if (err instanceof ApiRequestError) {
    return { error: { status: err.statusCode, message: err.message } }
  }

  return { error: { status: 500, message: 'Service unavailable. Try again.' } }
}

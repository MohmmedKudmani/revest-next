import type { ActionResult } from '@/lib/action'

interface HandleActionOptions<T> {
  onSuccess?: (data: T, message: string) => void
  onError?: (error: string) => void
  onFieldError?: (field: string, message: string) => void
}

/**
 * Dispatch an `ActionResult` to the appropriate callback.
 *
 * - On success → calls `onSuccess(data)`.
 * - On error with field-level messages → calls `onFieldError(field, message)`
 *   for each entry, then calls `onError` with the top-level message.
 * - On error → calls `onError(error.message)`.
 *
 * Keeps result-handling out of components so every dialog follows the same pattern.
 *
 * @example
 * handleAction(result, {
 *   onSuccess: () => { toast.success('Saved'); setOpen(false) },
 *   onError:   (msg) => toast.error(msg),
 *   onFieldError: (field, msg) => form.setError(field, { message: msg }),
 * })
 */
export function handleAction<T>(
  result: ActionResult<T>,
  { onSuccess, onError, onFieldError }: HandleActionOptions<T>,
) {
  if ('error' in result) {
    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        const message = messages[0]
        if (message) onFieldError?.(field, message)
      }
    }
    onError?.(result.error.message)
    return
  }

  onSuccess?.(result.data, result.message)
}

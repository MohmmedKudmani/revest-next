import type { ActionResult } from '@/app/products/actions'

interface HandleActionOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  onFieldError?: (field: string, message: string) => void
}

export function handleAction<T>(
  result: ActionResult<T>,
  {
  onSuccess,
  onError,
  onFieldError,
}: HandleActionOptions<T>,
) {
  if (result.ok) {
    onSuccess?.(result.data)
    return
  }

  if (result.fieldErrors) {
    for (const [field, messages] of Object.entries(result.fieldErrors)) {
      const message = messages[0]

      if (message) {
        onFieldError?.(field, message)
      }
    }
  }

  onError?.(result.error)
}

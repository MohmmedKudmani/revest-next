import { useCallback, useEffect, useRef } from 'react'

/**
 * Returns a debounced version of `callback` that only fires after
 * `delay` ms of inactivity. The latest callback ref is always used,
 * so closures over changing values (like `query`) stay fresh.
 */
export function useDebouncedCallback<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  const callbackRef = useRef(callback)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep ref in sync so the debounced fn always calls the latest version
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Clear pending timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  return useCallback(
    (...args: T) => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        callbackRef.current(...args)
      }, delay)
    },
    [delay],
  )
}

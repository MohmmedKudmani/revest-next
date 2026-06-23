import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { ApiErrorSchema } from '@/schemas/shared.schema'

/** Merge Tailwind class names, resolving conflicts via tailwind-merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Return `true` when a value is empty: null, undefined, empty string/array/object/Map/Set. */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string' || Array.isArray(value))
    return value.length === 0
  if (value instanceof Map || value instanceof Set) return value.size === 0
  if (typeof value === 'object')
    return Object.keys(value as object).length === 0
  return false
}

/** Format a date string or Date object as "MMM d, yyyy" (e.g. "Jan 5, 2025"). */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

/** Flatten Next.js searchParams (string | string[] | undefined) to Record<string, string>,
 *  discarding any keys with an undefined value. */
export function normalizeSearchParams(
  raw: Record<string, string | string[] | undefined>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(raw)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, Array.isArray(v) ? (v[0] ?? '') : (v ?? '')]),
  )
}

/** Build a URLSearchParams string from an object, omitting undefined, null, and empty-string values. */
export function buildSearchParams(
  params: Record<string, unknown>,
): string {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      sp.set(key, String(value))
    }
  }
  return sp.toString()
}

/** Extract a human-readable message from a backend error response body.
 *  Handles both string and string[] `message` fields (NestJS validation shape). */
export function parseApiError(body: unknown): string {
  const parsed = ApiErrorSchema.safeParse(body)
  if (!parsed.success) return 'Unexpected error'
  const { message } = parsed.data
  return Array.isArray(message) ? message.join(', ') : message
}

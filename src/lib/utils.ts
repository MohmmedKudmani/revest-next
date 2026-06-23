import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string' || Array.isArray(value))
    return value.length === 0
  if (value instanceof Map || value instanceof Set) return value.size === 0
  if (typeof value === 'object')
    return Object.keys(value as object).length === 0
  return false
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

/** Flatten Next.js searchParams (string | string[] | undefined) to Record<string, string> */
export function normalizeSearchParams(
  raw: Record<string, string | string[] | undefined>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(raw)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, Array.isArray(v) ? (v[0] ?? '') : (v ?? '')]),
  )
}

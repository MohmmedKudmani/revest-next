'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import type { Pagination as PaginationData } from '@/schemas/shared.schema'

interface DataPaginationProps {
  pagination: PaginationData
  query: Record<string, string | number | boolean | undefined>
}

function toSearchParams(
  query: Record<string, string | number | boolean | undefined>,
  overrides: Record<string, string>,
): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) sp.set(k, String(v))
  }
  for (const [k, v] of Object.entries(overrides)) {
    sp.set(k, v)
  }
  return sp.toString()
}

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3)
    return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

export function DataPagination({ pagination, query }: DataPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { page, limit, total, totalPages, hasPrevPage, hasNextPage } =
    pagination

  if (totalPages <= 1) return null

  const pages = getPageNumbers(page, totalPages)
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-muted-foreground text-sm">
        Showing{' '}
        <span className="text-foreground font-medium">
          {start}–{end}
        </span>{' '}
        of <span className="text-foreground font-medium">{total}</span>
      </p>

      <div className="flex items-center gap-3">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`${pathname}?${toSearchParams(query, { page: String(page - 1) })}`}
                aria-disabled={!hasPrevPage}
                className={!hasPrevPage ? 'pointer-events-none opacity-40' : ''}
              />
            </PaginationItem>

            {pages.map((p, i) =>
              p === '…' ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={`${pathname}?${toSearchParams(query, { page: String(p) })}`}
                    isActive={p === page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href={`${pathname}?${toSearchParams(query, { page: String(page + 1) })}`}
                aria-disabled={!hasNextPage}
                className={!hasNextPage ? 'pointer-events-none opacity-40' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <Select
          defaultValue={String(limit)}
          onValueChange={(v) =>
            router.push(
              `${pathname}?${toSearchParams(query, { limit: v, page: '1' })}`,
            )
          }
        >
          <SelectTrigger size="sm" className="w-[100px]">
            {limit} / page
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

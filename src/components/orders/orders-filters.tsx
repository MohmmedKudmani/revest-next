'use client'

import { useRouter, usePathname } from 'next/navigation'
import { XIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import type { OrderQueryInput } from '@/schemas/order.schema'

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created' },
  { value: 'totalPrice', label: 'Total Price' },
  { value: 'quantity', label: 'Quantity' },
]

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
}

export function OrdersFilters({ query }: { query: OrderQueryInput }) {
  const router = useRouter()
  const pathname = usePathname()

  function update(changes: Partial<OrderQueryInput>) {
    const next = { ...query, ...changes, page: 1 }
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(next)) {
      if (v !== undefined) sp.set(k, String(v))
    }
    router.push(`${pathname}?${sp.toString()}`)
  }

  const hasFilters = !!(query.search || query.status)

  const statusLabel = query.status
    ? (STATUS_LABELS[query.status] ?? query.status)
    : 'All statuses'
  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === query.sortBy)?.label ?? 'Created'
  const orderLabel = query.order === 'asc' ? 'Asc' : 'Desc'

  return (
    <div className="bg-card rounded-xl border px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <SearchInput
          value={query.search ?? ''}
          onSearch={(v) => update({ search: v || undefined })}
          placeholder="Search by product name…"
          className="w-60"
        />

        {/* Status */}
        <Select
          value={query.status ?? 'all'}
          onValueChange={(v) =>
            update({
              status:
                v === 'all' ? undefined : (v as OrderQueryInput['status']),
            })
          }
        >
          <SelectTrigger className="w-44">{statusLabel}</SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={query.sortBy}
          onValueChange={(v) =>
            update({ sortBy: v as OrderQueryInput['sortBy'] })
          }
        >
          <SelectTrigger className="w-36">{sortLabel}</SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={query.order}
          onValueChange={(v) =>
            update({ order: v as OrderQueryInput['order'] })
          }
        >
          <SelectTrigger className="w-28">{orderLabel}</SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Desc</SelectItem>
            <SelectItem value="asc">Asc</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-1.5"
            onClick={() => router.push(pathname)}
          >
            <XIcon size={14} />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}

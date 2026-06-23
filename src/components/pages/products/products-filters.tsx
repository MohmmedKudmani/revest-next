'use client'

import { useRouter, usePathname } from 'next/navigation'
import { XIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { SearchInput } from '@/components/ui/search-input'
import { DebouncedInput } from '@/components/ui/debounced-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import type { ProductQueryInput } from '@/schemas/product.schema'

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created' },
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'stock', label: 'Stock' },
]

export function ProductsFilters({ query }: { query: ProductQueryInput }) {
  const router = useRouter()
  const pathname = usePathname()

  function update(changes: Partial<ProductQueryInput>) {
    const next = { ...query, ...changes, page: 1 }
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(next)) {
      if (v !== undefined) sp.set(k, String(v))
    }
    router.push(`${pathname}?${sp.toString()}`)
  }

  const hasFilters = !!(
    query.search ||
    query.minPrice ||
    query.maxPrice ||
    query.inStock ||
    query.minStock
  )

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
          placeholder="Search by name…"
          className="w-56"
        />

        {/* Price range */}
        <DebouncedInput
          type="number"
          placeholder="Min price"
          value={query.minPrice?.toString() ?? ''}
          onDebouncedChange={(v) =>
            update({ minPrice: v ? Number(v) : undefined })
          }
          className="w-28"
          min={0}
        />
        <DebouncedInput
          type="number"
          placeholder="Max price"
          value={query.maxPrice?.toString() ?? ''}
          onDebouncedChange={(v) =>
            update({ maxPrice: v ? Number(v) : undefined })
          }
          className="w-28"
          min={0}
        />

        {/* Sort */}
        <Select
          value={query.sortBy}
          onValueChange={(v) =>
            update({ sortBy: v as ProductQueryInput['sortBy'] })
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
            update({ order: v as ProductQueryInput['order'] })
          }
        >
          <SelectTrigger className="w-28">{orderLabel}</SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Desc</SelectItem>
            <SelectItem value="asc">Asc</SelectItem>
          </SelectContent>
        </Select>

        {/* In-stock checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="inStock"
            checked={query.inStock === 'true'}
            onCheckedChange={(checked) =>
              update({ inStock: checked ? 'true' : undefined })
            }
          />
          <Label htmlFor="inStock" className="cursor-pointer text-sm">
            In stock only
          </Label>
        </div>

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

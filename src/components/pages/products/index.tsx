'use client'

import { isEmpty } from '@/lib/utils'
import { ProductsFilters } from './products-filters'
import { ProductsTable } from './products-table'
import { AddProductDialog } from './dialogs/add-product-dialog'
import { DataPagination } from '@/components/ui/data-pagination'
import { PackageIcon } from '@phosphor-icons/react'
import type {
  PaginatedProducts,
  ProductQueryInput,
} from '@/schemas/product.schema'

interface ProductsViewProps {
  products: PaginatedProducts['data']
  pagination: PaginatedProducts['pagination']
  query: ProductQueryInput
}

export function ProductsView({
  products,
  pagination,
  query,
}: ProductsViewProps) {
  const hasFilters = !!(
    query.search ||
    query.minPrice ||
    query.maxPrice ||
    query.inStock ||
    query.minStock
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Products
          </h1>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
              {pagination.total} items
            </span>
          </div>
        </div>
        <AddProductDialog />
      </div>

      {/* Filter toolbar */}
      <ProductsFilters query={query} />

      {/* Empty states */}
      {isEmpty(products) && !hasFilters && (
        <div className="bg-card flex flex-col items-center gap-4 rounded-xl border border-dashed py-20 text-center shadow-sm">
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <PackageIcon
              size={22}
              className="text-muted-foreground"
              weight="duotone"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No products yet</p>
            <p className="text-muted-foreground text-sm">
              Add your first product to get started.
            </p>
          </div>
          <AddProductDialog />
        </div>
      )}

      {isEmpty(products) && hasFilters && (
        <div className="bg-card flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center shadow-sm">
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <PackageIcon
              size={22}
              className="text-muted-foreground"
              weight="duotone"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              No products match your filters
            </p>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filters.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {!isEmpty(products) && <ProductsTable products={products} />}

      {/* Pagination */}
      {!isEmpty(products) && (
        <DataPagination pagination={pagination} query={query} />
      )}
    </div>
  )
}

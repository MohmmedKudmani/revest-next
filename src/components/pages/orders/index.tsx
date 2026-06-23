'use client'

import { isEmpty } from '@/lib/utils'
import { OrdersFilters } from './orders-filters'
import { OrdersTable } from './orders-table'
import { AddOrderDialog } from './dialogs/add-order-dialog'
import { DataPagination } from '@/components/ui/data-pagination'
import { ListChecksIcon } from '@phosphor-icons/react'
import type { PaginatedOrders, OrderQueryInput } from '@/schemas/order.schema'
import type { Product } from '@/schemas/product.schema'

interface OrdersViewProps {
  orders: PaginatedOrders['data']
  products: Product[]
  pagination: PaginatedOrders['pagination']
  query: OrderQueryInput
}

export function OrdersView({
  orders,
  products,
  pagination,
  query,
}: OrdersViewProps) {
  const hasFilters = !!(query.search || query.status)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Orders
          </h1>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
              {pagination.total} orders
            </span>
          </div>
        </div>
        <AddOrderDialog products={products} />
      </div>

      {/* Filter toolbar */}
      <OrdersFilters query={query} />

      {/* Empty states */}
      {isEmpty(orders) && !hasFilters && (
        <div className="bg-card flex flex-col items-center gap-4 rounded-xl border border-dashed py-20 text-center shadow-sm">
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <ListChecksIcon
              size={22}
              className="text-muted-foreground"
              weight="duotone"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No orders yet</p>
            <p className="text-muted-foreground text-sm">
              Create your first order to get started.
            </p>
          </div>
          <AddOrderDialog products={products} />
        </div>
      )}

      {isEmpty(orders) && hasFilters && (
        <div className="bg-card flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center shadow-sm">
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <ListChecksIcon
              size={22}
              className="text-muted-foreground"
              weight="duotone"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No orders match your filters</p>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or status filter.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {!isEmpty(orders) && <OrdersTable orders={orders} products={products} />}

      {/* Pagination */}
      {!isEmpty(orders) && (
        <DataPagination pagination={pagination} query={query} />
      )}
    </div>
  )
}

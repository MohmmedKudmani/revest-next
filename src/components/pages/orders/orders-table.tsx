'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { isEmpty, formatDate } from '@/lib/utils'
import { OrderStatusSelect } from './order-status-select'
import { DeleteOrderDialog } from './dialogs/delete-order-dialog'
import type { OrderWithProduct } from '@/schemas/order.schema'
import type { Product } from '@/schemas/product.schema'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

interface OrdersTableProps {
  orders: OrderWithProduct[]
  products: Product[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (isEmpty(orders)) return null

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead>Product</TableHead>
            <TableHead className="text-center">Qty</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const productDeleted = order.product === null

            return (
              <TableRow
                key={order.id}
                className={`hover:bg-muted/30 ${productDeleted ? 'opacity-60' : ''}`}
              >
                {/* Product */}
                <TableCell>
                  {productDeleted ? (
                    <Badge
                      variant="outline"
                      className="text-muted-foreground gap-1"
                    >
                      ⚠ Deleted
                    </Badge>
                  ) : (
                    <span className="font-medium">{order.product!.name}</span>
                  )}
                </TableCell>

                {/* Qty */}
                <TableCell className="text-center font-medium tabular-nums">
                  {order.quantity}
                </TableCell>

                {/* Unit price */}
                <TableCell className="text-muted-foreground text-right tabular-nums">
                  {productDeleted ? '—' : formatPrice(order.product!.price)}
                </TableCell>

                {/* Total */}
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatPrice(order.totalPrice)}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                    disabled={productDeleted}
                  />
                </TableCell>

                {/* Created */}
                <TableCell className="text-muted-foreground">
                  {formatDate(order.createdAt)}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex justify-end">
                    <DeleteOrderDialog order={order} />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

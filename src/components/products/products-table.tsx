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
import { Button } from '@/components/ui/button'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { isEmpty, formatDate } from '@/lib/utils'
import type { Product } from '@/schemas/product.schema'
import { EditProductDialog } from './dialogs/edit-product-dialog'
import { DeleteProductDialog } from './dialogs/delete-product-dialog'

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return <Badge variant="destructive">Out of stock</Badge>
  }
  if (stock < 5) {
    return <Badge variant="warning">Low · {stock}</Badge>
  }
  return <Badge variant="success">{stock} in stock</Badge>
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (isEmpty(products)) return null

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-64 truncate">
                {product.description ?? (
                  <span className="text-muted-foreground/50">—</span>
                )}
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {formatPrice(product.price)}
              </TableCell>
              <TableCell>
                <StockBadge stock={product.stock} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(product.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <EditProductDialog product={product}>
                    <Button variant="ghost" size="icon-sm">
                      <PencilSimpleIcon size={15} />
                    </Button>
                  </EditProductDialog>
                  <DeleteProductDialog product={product} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

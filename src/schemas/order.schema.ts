import { z } from 'zod'
import { PaginationSchema } from '@/schemas/shared.schema'
import { ProductSchema } from '@/schemas/product.schema'

export const OrderSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int(),
  totalPrice: z.number(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Order = z.infer<typeof OrderSchema>

// product is null when product-service unreachable or product was deleted
export const OrderWithProductSchema = OrderSchema.extend({
  product: ProductSchema.nullable(),
})
export type OrderWithProduct = z.infer<typeof OrderWithProductSchema>

export const PaginatedOrdersSchema = z.object({
  data: z.array(OrderWithProductSchema),
  pagination: PaginationSchema,
})
export type PaginatedOrders = z.infer<typeof PaginatedOrdersSchema>

// ── Form schemas ──

export const CreateOrderSchema = z.object({
  productId: z.string().min(1, 'Select a product'),
  quantity: z.coerce
    .number({ message: 'Must be a number' })
    .int('Must be a whole number')
    .min(1, 'At least 1 required'),
})
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>

export const UpdateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
})
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>

// ── Query schema (coerces searchParams strings into typed values, mirrors backend) ──

export const OrderQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  productId: z.string().uuid().optional(),
  sortBy: z.enum(['createdAt', 'totalPrice', 'quantity']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})
export type OrderQueryInput = z.infer<typeof OrderQuerySchema>

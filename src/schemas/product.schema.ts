import { z } from 'zod'
import { PaginationSchema } from '@/schemas/shared.schema'

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  stock: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Product = z.infer<typeof ProductSchema>

export const PaginatedProductsSchema = z.object({
  data: z.array(ProductSchema),
  pagination: PaginationSchema,
})
export type PaginatedProducts = z.infer<typeof PaginatedProductsSchema>

// ── Form schemas (coerce because inputs return strings) ──

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce
    .number({ message: 'Price must be a number' })
    .min(0, 'Price must be ≥ 0'),
  stock: z.coerce
    .number({ message: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock must be ≥ 0'),
})
export type CreateProductInput = z.infer<typeof CreateProductSchema>

export const UpdateProductSchema = CreateProductSchema.partial()
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>

// ── Query schema (coerces searchParams strings into typed values, mirrors backend) ──

export const ProductQuerySchema = z.object({
  search: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.enum(['true', 'false']).optional(),
  minStock: z.coerce.number().int().min(0).optional(),
  sortBy: z.enum(['name', 'price', 'stock', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})
export type ProductQueryInput = z.infer<typeof ProductQuerySchema>

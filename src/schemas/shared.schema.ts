import { z } from 'zod'

export const PaginationSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
})
export type Pagination = z.infer<typeof PaginationSchema>

// NestJS error shape — message is string on 404/500, string[] on 400 validation
export const ApiErrorSchema = z.object({
  status: z.number().optional(),
  statusCode: z.number().optional(),
  message: z.union([z.string(), z.array(z.string())]),
})
export type ApiError = z.infer<typeof ApiErrorSchema>

import { apiFetch, buildSearchParams } from '@/lib/client'
import type {
  OrderWithProduct,
  OrderQueryInput,
  PaginatedOrders,
} from '@/schemas/order.schema'

const ORDER_URL = process.env.ORDER_SERVICE_URL!

export async function getOrders(
  params: Partial<OrderQueryInput> = {},
): Promise<PaginatedOrders> {
  return apiFetch(
    `${ORDER_URL}/orders?${buildSearchParams(params as Record<string, string | number | boolean | undefined>)}`,
  )
}

export async function getOrder(id: string): Promise<OrderWithProduct> {
  return apiFetch(`${ORDER_URL}/orders/${id}`)
}

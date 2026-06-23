import { client } from '@/lib/client'
import { buildSearchParams } from '@/lib/utils'
import type {
  OrderWithProduct,
  OrderQueryInput,
  PaginatedOrders,
} from '@/schemas/order.schema'

export async function getOrders(
  params: Partial<OrderQueryInput> = {},
): Promise<PaginatedOrders> {
  return client('order', `/orders?${buildSearchParams(params)}`)
}

export async function getOrder(id: string): Promise<OrderWithProduct> {
  return client('order', `/orders/${id}`)
}
